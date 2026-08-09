"use client";

import { useCallback, useEffect } from "react";
import useSWR, { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";
import { authService } from "@/services";
import { AUTH_EXPIRED_EVENT } from "@/lib/api";
import { errorMessage } from "@/lib/errors";
import { getStoredAuth, storeAuth, clearAuth } from "@/utils/auth";
import type { User, LoginRequest, RegisterRequest } from "@/types/auth";

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
      if (u) localStorage.setItem("auth_user", JSON.stringify(u));
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
    if (typeof window !== "undefined" && localStorage.getItem("auth_token")) {
      // Fire-and-forget server-side session revoke
      authService.revoke().catch(() => {});
    }
    clearAuth();
    mutate(["auth", "me"], null, { revalidate: false });
    mutate(() => true, undefined, { revalidate: false }); // clear all SWR cache
  }, [mutate]);

  return {
    user: user ?? null,
    token: stored?.token ?? null,
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
