"use client";

import useSWR, { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";
import { accountService, type AccountListQuery, type AccountListResponse } from "@/services";
import { useActiveWorkspaceId } from "@/hooks/use-active-workspace";
import type { AccountResponse, AccountFormData } from "@/types/account";

export function useAccounts(filters?: AccountListQuery) {
  const workspaceId = useActiveWorkspaceId();
  const key = workspaceId
    ? ["accounts", "list", workspaceId, filters ?? {}]
    : null;
  return useSWR<AccountListResponse>(key, () =>
    accountService.list(filters),
  );
}

export function useAccount(id: string) {
  const workspaceId = useActiveWorkspaceId();
  const key = workspaceId && id ? ["accounts", "detail", workspaceId, id] : null;
  return useSWR<AccountResponse>(key, () => accountService.describe(id));
}

export function useCreateAccount() {
  const { mutate } = useSWRConfig();

  return useSWRMutation(
    "accounts-create",
    async (_key: string, { arg }: { arg: AccountFormData }) => {
      return accountService.create(arg);
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
      return accountService.update(id, arg);
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
      return accountService.delete(arg);
    },
    {
      onSuccess: () => {
        mutate((key) => Array.isArray(key) && key[0] === "accounts");
      },
    },
  );
}
