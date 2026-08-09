"use client";

import useSWR, { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";
import { workspaceService } from "@/services";
import type { ListFilters } from "@/types/common";
import type { PaginatedResponse } from "@/types/pagination";
import type { WorkspaceResponse, WorkspaceFormData } from "@/types/workspace";

export function useWorkspaces(filters?: ListFilters) {
  const key = ["workspaces", "list", filters] as const;
  return useSWR<PaginatedResponse<WorkspaceResponse, "workspaces">>(
    key,
    () => workspaceService.list(filters),
    {
      keepPreviousData: true,
    },
  );
}

export function useWorkspace(id?: string) {
  return useSWR<WorkspaceResponse>(
    id ? ["workspaces", "detail", id] : null,
    () => workspaceService.describe(id as string),
  );
}

export function useCreateWorkspace() {
  const { mutate } = useSWRConfig();

  return useSWRMutation(
    "workspaces-create",
    async (_key, { arg }: { arg: WorkspaceFormData }) =>
      workspaceService.create(arg),
    {
      onSuccess: () => {
        mutate((key) => Array.isArray(key) && key[0] === "workspaces");
      },
    },
  );
}

export function useUpdateWorkspace(id: string) {
  const { mutate } = useSWRConfig();

  return useSWRMutation(
    ["workspaces", "update", id],
    async (_key, { arg }: { arg: Partial<WorkspaceFormData> }) =>
      workspaceService.update(id, arg),
    {
      onSuccess: () => {
        // Invalidate both the list and the detail cache entries.
        mutate((key) => Array.isArray(key) && key[0] === "workspaces");
      },
    },
  );
}

export function useDeleteWorkspace() {
  const { mutate } = useSWRConfig();

  return useSWRMutation(
    "workspaces-delete",
    async (_key, { arg }: { arg: string }) =>
      workspaceService.delete(arg),
    {
      onSuccess: () => {
        mutate((key) => Array.isArray(key) && key[0] === "workspaces");
      },
    },
  );
}
