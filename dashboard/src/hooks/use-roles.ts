"use client"

import { useCallback } from "react"
import useSWR, { useSWRConfig } from "swr"
import useSWRMutation from "swr/mutation"
import { roleService } from "@/services"
import type { RoleResponse, RoleFormData } from "@/types/role"
import type { ListFilters } from "@/types/common"

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Request failed"
}

function revalidateRoles(mutate: ReturnType<typeof useSWRConfig>["mutate"]) {
  mutate((key) => Array.isArray(key) && key[0] === "roles")
}

export function useRoles(workspaceId?: string, filters?: ListFilters) {
  const key = workspaceId ? ["roles", "list", workspaceId, filters ?? {}] : null
  return useSWR<RoleResponse[]>(
    key,
    () => roleService.list(workspaceId, filters),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  )
}

export function useRole(workspaceId?: string, id?: string) {
  const key = workspaceId && id ? ["roles", "detail", workspaceId, id] : null
  return useSWR<RoleResponse>(
    key,
    () => roleService.describe(workspaceId, id as string),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  )
}

export function useCreateRole() {
  const { mutate } = useSWRConfig()
  const mutation = useSWRMutation(
    "role-create",
    async (_key, { arg }: { arg: { workspaceId: string; data: RoleFormData } }) =>
      roleService.create(arg.workspaceId, arg.data),
    {
      onSuccess: () => {
        revalidateRoles(mutate)
      },
    },
  )

  const create = useCallback(
    async (workspaceId: string, data: RoleFormData) => {
      return mutation.trigger({ workspaceId, data })
    },
    [mutation],
  )

  return {
    create,
    isCreating: mutation.isMutating,
    error: mutation.error ? errorMessage(mutation.error) : null,
  }
}

export function useUpdateRole(id?: string) {
  const { mutate } = useSWRConfig()
  const mutation = useSWRMutation(
    id ? ["role-update", id] : null,
    async (_key, { arg }: { arg: { workspaceId: string; data: RoleFormData } }) =>
      roleService.update(arg.workspaceId, id as string, arg.data),
    {
      onSuccess: () => {
        revalidateRoles(mutate)
      },
    },
  )

  const update = useCallback(
    async (workspaceId: string, data: RoleFormData) => {
      if (!id) throw new Error("Missing role id")
      return mutation.trigger({ workspaceId, data })
    },
    [id, mutation],
  )

  return {
    update,
    isUpdating: mutation.isMutating,
    error: mutation.error ? errorMessage(mutation.error) : null,
  }
}

export function useDeleteRole() {
  const { mutate } = useSWRConfig()
  const mutation = useSWRMutation(
    "role-delete",
    async (_key, { arg }: { arg: { workspaceId: string; id: string } }) =>
      roleService.delete(arg.workspaceId, arg.id),
    {
      onSuccess: () => {
        revalidateRoles(mutate)
      },
    },
  )

  const remove = useCallback(
    async (workspaceId: string, id: string) => {
      return mutation.trigger({ workspaceId, id })
    },
    [mutation],
  )

  return {
    remove,
    isDeleting: mutation.isMutating,
    error: mutation.error ? errorMessage(mutation.error) : null,
  }
}
