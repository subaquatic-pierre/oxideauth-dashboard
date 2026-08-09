import { clearAuth, getStoredAuth } from "@/utils/auth";
import { getActiveWorkspaceId } from "@/lib/workspace";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

export class NetworkError extends Error {
  constructor(
    message = "Unable to connect to the OxideAuth API. Please check your connection and try again.",
  ) {
    super(message);
    this.name = "NetworkError";
  }
}

/** True when the failure was caused by the API being unreachable. */
export function isNetworkError(error: unknown): boolean {
  return error instanceof NetworkError;
}

/**
 * Fired (on `window`) whenever the API responds with a 401, signalling the
 * session has expired. The dashboard layout listens for this and redirects to
 * the login page.
 */
export const AUTH_EXPIRED_EVENT = "auth:expired";

// ---------------------------------------------------------------------------
// In-flight request cancellation (FR-008)
// ---------------------------------------------------------------------------

let abortController: AbortController | null = null;

function getAbortSignal(): AbortSignal {
  if (!abortController) {
    abortController = new AbortController();
  }
  return abortController.signal;
}

/**
 * Abort all in-flight API requests and create a fresh controller for
 * subsequent calls. Called by the workspace selector when the user switches
 * workspaces so that stale responses from the previous workspace are never
 * processed.
 */
export function abortInFlightRequests(): void {
  if (abortController) {
    abortController.abort();
  }
  abortController = new AbortController();
}

// ---------------------------------------------------------------------------
// Core fetch wrapper
// ---------------------------------------------------------------------------

export async function api<T>(path: string, options?: RequestInit): Promise<T> {
  const auth = getStoredAuth();
  const token = auth?.token;
  const url = `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}${path}`;

  const tokenHeaders: Record<string, string> = {};
  if (token) {
    tokenHeaders["Authorization"] = `Bearer ${token}`;
  }

  // Inject workspace ID from the workspace selector (localStorage) when
  // the user has explicitly selected one, otherwise fall back to the
  // workspace ID from the JWT token claims (FR-004, FR-006).
  const workspaceId =
    getActiveWorkspaceId() || auth?.claims?.ws || "";
  if (workspaceId) {
    tokenHeaders["X-Workspace-Id"] = workspaceId;
  }

  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...tokenHeaders,
        ...options?.headers,
      },
      signal: getAbortSignal(),
      ...options,
    });
  } catch (err: unknown) {
    // AbortError is triggered by abortInFlightRequests() on workspace
    // switch — silently discard the response (FR-008).
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new NetworkError("Request cancelled");
    }
    // fetch rejected: the API is unreachable (offline, server down, DNS, ...)
    throw new NetworkError();
  }

  const json = await res.json().catch(() => null);

  // Session expired — clear local auth state and notify the shell so it can
  // redirect to the login page, then bail out with a dedicated error.
  if (res.status === 401) {
    if (typeof window !== "undefined") {
      clearAuth();
      window.dispatchEvent(new CustomEvent(AUTH_EXPIRED_EVENT));
    }
    throw new ApiError("Session expired", 401);
  }

  if (!res.ok || !json?.success) {
    throw new ApiError(
      json?.data?.message || json?.data?.error || "Request failed",
      res.status,
    );
  }

  return json.data as T;
}