import type { TokenClaims, User } from "@/types/auth";

const AUTH_TOKEN_KEY = "auth_token";
const AUTH_USER_KEY = "auth_user";
const AUTH_REFRESH_TOKEN_KEY = "auth_refresh_token";

// ---------------------------------------------------------------------------
// JWT decode (client-side payload extraction only — no signature verification)
// ---------------------------------------------------------------------------

/** Decode the payload segment of a JWT without verifying the signature. */
export function decodeTokenPayload(token: string): TokenClaims | null {
  try {
    const payload = token.split(".")[1];
    const decoded = atob(payload);
    return JSON.parse(decoded) as TokenClaims;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Auth helpers (extracted from hooks/use-auth.ts)
// ---------------------------------------------------------------------------

/**
 * Read the stored auth token, user, and deserialized JWT claims.
 *
 * Always returns a non-null object so server/client rendering stays
 * consistent (SSR produces the same shape as the hydrated client).
 * When a token exists but cannot be decoded, `claims` is `null` while
 * `token` and `user` are still returned so existing callers work.
 */
export function getStoredAuth(): {
  token: string | null;
  user: User | null;
  claims: TokenClaims | null;
} {
  if (typeof window === "undefined") {
    return { token: null, user: null, claims: null };
  }
  try {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    const userStr = localStorage.getItem(AUTH_USER_KEY);
    const user = userStr ? (JSON.parse(userStr) as User) : null;
    const claims = token ? decodeTokenPayload(token) : null;
    return { token, user, claims };
  } catch {
    return { token: null, user: null, claims: null };
  }
}

/** Persist auth data to localStorage. */
export function storeAuth(
  token: string,
  user: User,
  refreshToken?: string,
) {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  if (refreshToken) {
    localStorage.setItem(AUTH_REFRESH_TOKEN_KEY, refreshToken);
  }
}

/** Remove all auth data from localStorage. */
export function clearAuth() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
  localStorage.removeItem(AUTH_REFRESH_TOKEN_KEY);
}
