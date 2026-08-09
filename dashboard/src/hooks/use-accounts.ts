"use client";

import useSWR, { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";
import { accountService, type AccountListQuery, type AccountListResponse } from "@/services";
import { getActiveWorkspaceId } from "@/lib/workspace";
import type { AccountResponse, AccountFormData } from "@/types/account";

export function useAccounts(
  workspaceId?: string | null,
  filters?: AccountListQuery,
) {
  const key = workspaceId
    ? ["accounts", "list", workspaceId, filters ?? {}]
    : null;
  return useSWR<AccountListResponse>(key, () =>
    accountService.list(workspaceId!, filters),
  );
}

export function useAccount(workspaceId: string | null | undefined, id: string) {
  const key = workspaceId && id ? ["accounts", "detail", workspaceId, id] : null;
  return useSWR<AccountResponse>(key, () => accountService.describe(workspaceId!, id));
}

export function useCreateAccount() {
  const { mutate } = useSWRConfig();

  return useSWRMutation(
    "accounts-create",
    async (_key: string, { arg }: { arg: AccountFormData }) => {
      const workspaceId = getActiveWorkspaceId();
      if (!workspaceId) throw new Error("No active workspace selected");
      return accountService.create(workspaceId, arg);
    },
    {
      onSuccess: () => {
        mutate((key) => Array.isArray(key) && key[0] === "accounts");
      },
    },
  );
}

export function useUpdateAccount(id: string) {
  const { mutate } = useSWRConfig();

  return useSWRMutation(
    ["accounts", "update", id],
    async (
      _key: string[],
      { arg }: { arg: Partial<AccountFormData> },
    ) => {
      const workspaceId = getActiveWorkspaceId();
      if (!workspaceId) throw new Error("No active workspace selected");
      return accountService.update(workspaceId, id, arg);
    },
    {
      onSuccess: () => {
        // Invalidate both list and detail caches for accounts.
        mutate((key) => Array.isArray(key) && key[0] === "accounts");
      },
    },
  );
}

export function useDeleteAccount() {
  const { mutate } = useSWRConfig();

  return useSWRMutation(
    "accounts-delete",
    async (_key: string, { arg }: { arg: string }) => {
      const workspaceId = getActiveWorkspaceId();
      if (!workspaceId) throw new Error("No active workspace selected");
      return accountService.delete(workspaceId, arg);
    },
    {
      onSuccess: () => {
        mutate((key) => Array.isArray(key) && key[0] === "accounts");
      },
    },
  );
}
