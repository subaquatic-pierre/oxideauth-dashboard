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

export async function api<T>(path: string, options?: RequestInit): Promise<T> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
  const url = `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}${path}`;

  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options?.headers,
      },
      ...options,
    });
  } catch {
    // fetch rejected: the API is unreachable (offline, server down, DNS, ...)
    throw new NetworkError();
  }

  const json = await res.json().catch(() => null);

  // Session expired — clear local auth state and notify the shell so it can
  // redirect to the login page, then bail out with a dedicated error.
  if (res.status === 401) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
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

  console.log(json.data);

  return json.data as T;
}
