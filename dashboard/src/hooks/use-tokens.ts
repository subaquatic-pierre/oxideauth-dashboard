"use client"

import useSWR, { useSWRConfig } from "swr"
import useSWRMutation from "swr/mutation"
import { tokenService } from "@/services"
import type { BlacklistedToken } from "@/types/token"
import type { ListFilters } from "@/types/common"

/**
 * Blacklisted-token list. Tokens are read-only for creation — the only
 * mutation is delete (un-revoke). The service resolves the active workspace
 * from localStorage internally.
 */
export function useTokens(filters?: ListFilters) {
  const { data, isLoading, error, mutate } = useSWR(
    ["tokens", filters],
    () => tokenService.list(filters),
  )

  return {
    tokens: data?.tokens ?? [],
    total: data?.metadata?.total ?? 0,
    isLoading,
    error,
    mutate,
  }
}

/** Fetch a single blacklisted-token entry. */
export function useToken(id: string) {
  const { data, isLoading, error, mutate } = useSWR(
    id ? ["token", id] : null,
    () => tokenService.describe(id),
  )

  return { token: data, isLoading, error, mutate }
}

/** Delete (un-revoke) a blacklisted token. */
export function useDeleteToken() {
  const { mutate } = useSWRConfig()

  const mutation = useSWRMutation(
    "tokens-delete",
    async (_key: string, { arg }: { arg: string }) => {
      return tokenService.delete(arg)
    },
    {
      onSuccess: () => {
        mutate(
          (key) => Array.isArray(key) && (key[0] === "tokens" || key[0] === "token"),
          undefined,
          { revalidate: true },
        )
      },
    },
  )

  return {
    deleteToken: mutation.trigger,
    isDeleting: mutation.isMutating,
    error: mutation.error,
  }
}

export type { BlacklistedToken }
