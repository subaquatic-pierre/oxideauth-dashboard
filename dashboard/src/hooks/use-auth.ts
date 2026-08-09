"use client";

import { useCallback, useEffect } from "react";
import useSWR, { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";
import { authService } from "@/services";
import { AUTH_EXPIRED_EVENT } from "@/lib/api";
import type { User, LoginRequest, RegisterRequest } from "@/types/auth";

const AUTH_TOKEN_KEY = "auth_token";
const AUTH_USER_KEY = "auth_user";
const AUTH_REFRESH_TOKEN_KEY = "auth_refresh_token";

function getStoredAuth(): { token: string | null; user: User | null } {
  if (typeof window === "undefined") return { token: null, user: null };
  try {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    const userStr = localStorage.getItem(AUTH_USER_KEY);
    const user = userStr ? (JSON.parse(userStr) as User) : null;
    return { token, user };
  } catch {
    return { token: null, user: null };
  }
}

function storeAuth(token: string, user: User, refreshToken?: string) {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  if (refreshToken) {
    localStorage.setItem(AUTH_REFRESH_TOKEN_KEY, refreshToken);
  }
}

function clearAuth() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
  localStorage.removeItem(AUTH_REFRESH_TOKEN_KEY);
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Request failed";
}

export function useAuth() {
  const { mutate } = useSWRConfig();
  const stored = getStoredAuth();

  // Handle session expiry signalled by the API layer (401 responses dispatch
  // the `auth:expired` event). Clear local auth state so the shell redirects
  // to the login page.
  useEffect(() => {
    function handleAuthExpired() {
      clearAuth();
      mutate(["auth", "me"], null, { revalidate: false });
    }
    window.addEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired);
    return () =>
      window.removeEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired);
  }, [mutate]);

  // Load the current user from storage. Only fetches when a token exists
  // (token presence in localStorage is the source of truth for auth state).
  const {
    data: user,
    isLoading,
    error,
  } = useSWR<User | null>(
    stored.token ? ["auth", "me"] : null,
    async () => {
      const u = await authService.me();
      if (u) localStorage.setItem(AUTH_USER_KEY, JSON.stringify(u));
      return u;
    },
    {
      fallbackData: stored.user,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

  // Login mutation
  const loginMutation = useSWRMutation(
    "auth-login",
    async (_key: string, { arg }: { arg: LoginRequest }) => {
      const res = await authService.login(arg);
      storeAuth(res.accessToken, res.account, res.refreshToken);
      return res.account;
    },
    {
      onSuccess: (account) => {
        mutate(["auth", "me"], account, { revalidate: false });
      },
    },
  );

  // Register mutation
  const registerMutation = useSWRMutation(
    "auth-register",
    async (_key: string, { arg }: { arg: RegisterRequest }) => {
      const res = await authService.register(arg);
      storeAuth(res.accessToken, res.account, res.refreshToken);
      return res.account;
    },
  );

  const login = useCallback(
    async (email: string, password: string) => {
      await loginMutation.trigger({ email, password });
    },
    [loginMutation],
  );

  const register = useCallback(
    async (email: string, password: string, name: string) => {
      await registerMutation.trigger({ email, password, name });
    },
    [registerMutation],
  );

  const logout = useCallback(() => {
    if (typeof window !== "undefined" && localStorage.getItem(AUTH_TOKEN_KEY)) {
      // Fire-and-forget server-side session revoke
      authService.revoke().catch(() => {});
    }
    clearAuth();
    mutate(["auth", "me"], null, { revalidate: false });
    mutate(() => true, undefined, { revalidate: false }); // clear all SWR cache
  }, [mutate]);

  return {
    user: user ?? null,
    token: stored.token,
    isAuthenticated: !!user,
    isPending: isLoading,
    error,
    login,
    register,
    logout,
    loginError: loginMutation.error ? errorMessage(loginMutation.error) : null,
    isLoggingIn: loginMutation.isMutating,
    registerError: registerMutation.error
      ? errorMessage(registerMutation.error)
      : null,
    isRegistering: registerMutation.isMutating,
  };
}
