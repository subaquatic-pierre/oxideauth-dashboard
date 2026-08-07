"use client"

import useSWR, { useSWRConfig } from "swr"
import useSWRMutation from "swr/mutation"
import { credentialService } from "@/services"
import { getActiveWorkspaceId } from "@/lib/workspace"
import type { Credential, CredentialFormData } from "@/types/credential"
import type { ListFilters } from "@/types/common"

/**
 * Credential list for the active workspace. Credentials are read-only in
 * creation terms (no create endpoint); only list/describe/update/delete exist.
 *
 * Pass `null` as `filters` to skip fetching entirely (used by detail pages
 * when the account id is already known via the URL).
 */
export function useCredentials(filters?: ListFilters | null) {
  const workspaceId = getActiveWorkspaceId()

  const { data, isLoading, error, mutate } = useSWR(
    workspaceId && filters != null ? ["credentials", workspaceId, filters] : null,
    () => credentialService.list(workspaceId, filters ?? undefined),
  )

  return {
    credentials: data?.credentials ?? [],
    total: data?.metadata?.total ?? 0,
    isLoading,
    error,
    mutate,
  }
}

/** Fetch a single credential. `accountId` is required by the API. */
export function useCredential(accountId: string, id: string) {
  const workspaceId = getActiveWorkspaceId()

  const { data, isLoading, error, mutate } = useSWR(
    workspaceId && accountId && id
      ? ["credential", workspaceId, accountId, id]
      : null,
    () => credentialService.describe(workspaceId, accountId, id),
  )

  return { credential: data, isLoading, error, mutate }
}

/** Update (e.g. revoke) a credential — no create operation is available. */
export function useUpdateCredential() {
  const workspaceId = getActiveWorkspaceId()
  const { mutate } = useSWRConfig()

  const mutation = useSWRMutation(
    "credentials-update",
    async (_key: string, { arg }: { arg: { accountId: string; id: string; data: CredentialFormData } }) => {
      return credentialService.update(workspaceId, arg.accountId, arg.id, arg.data)
    },
    {
      onSuccess: () => {
        mutate(
          (key) => Array.isArray(key) && (key[0] === "credentials" || key[0] === "credential"),
          undefined,
          { revalidate: true },
        )
      },
    },
  )

  return {
    updateCredential: mutation.trigger,
    isUpdating: mutation.isMutating,
    error: mutation.error,
  }
}

/** Delete a credential permanently. */
export function useDeleteCredential() {
  const workspaceId = getActiveWorkspaceId()
  const { mutate } = useSWRConfig()

  const mutation = useSWRMutation(
    "credentials-delete",
    async (_key: string, { arg }: { arg: { accountId: string; id: string } }) => {
      return credentialService.delete(workspaceId, arg.accountId, arg.id)
    },
    {
      onSuccess: () => {
        mutate(
          (key) => Array.isArray(key) && (key[0] === "credentials" || key[0] === "credential"),
          undefined,
          { revalidate: true },
        )
      },
    },
  )

  return {
    deleteCredential: mutation.trigger,
    isDeleting: mutation.isMutating,
    error: mutation.error,
  }
}

export type { Credential, CredentialFormData }
