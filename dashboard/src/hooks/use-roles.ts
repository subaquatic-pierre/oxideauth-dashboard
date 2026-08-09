"use client"

import { useCallback } from "react"
import { useActiveWorkspaceId } from "@/hooks/use-active-workspace"
import useSWR, { useSWRConfig } from "swr"
import useSWRMutation from "swr/mutation"
import { roleService } from "@/services"
import { errorMessage } from "@/lib/errors"
import { revalidateRoles } from "@/lib/swr-helpers"
import type { RoleResponse, RoleFormData } from "@/types/role"
import type { ListFilters } from "@/types/common"

export function useRoles(filters?: ListFilters) {
  const workspaceId = useActiveWorkspaceId()
  const key = workspaceId ? ["roles", "list", workspaceId, filters ?? {}] : null
  return useSWR<RoleResponse[]>(
    key,
    () => roleService.list(filters),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  )
}

export function useRole(id?: string) {
  const workspaceId = useActiveWorkspaceId()
  const key = workspaceId && id ? ["roles", "detail", workspaceId, id] : null
  return useSWR<RoleResponse>(
    key,
    () => roleService.describe(id as string),
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
    async (_key, { arg }: { arg: RoleFormData }) => roleService.create(arg),
    {
      onSuccess: () => {
        revalidateRoles(mutate)
      },
    },
  )

  const create = useCallback(
    async (data: RoleFormData) => {
      return mutation.trigger(data)
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
    async (_key, { arg }: { arg: RoleFormData }) =>
      roleService.update(id as string, arg),
    {
      onSuccess: () => {
        revalidateRoles(mutate)
      },
    },
  )

  const update = useCallback(
    async (data: RoleFormData) => {
      if (!id) throw new Error("Missing role id")
      return mutation.trigger(data)
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
    async (_key, { arg }: { arg: string }) => roleService.delete(arg),
    {
      onSuccess: () => {
        revalidateRoles(mutate)
      },
    },
  )

  const remove = useCallback(
    async (id: string) => {
      return mutation.trigger(id)
    },
    [mutation],
  )

  return {
    remove,
    isDeleting: mutation.isMutating,
    error: mutation.error ? errorMessage(mutation.error) : null,
  }
}
