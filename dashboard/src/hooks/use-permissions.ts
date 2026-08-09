"use client"

import { useCallback } from "react"
import { useActiveWorkspaceId } from "@/hooks/use-active-workspace"
import useSWR, { useSWRConfig } from "swr"
import useSWRMutation from "swr/mutation"
import { permissionService } from "@/services"
import { errorMessage } from "@/lib/errors"
import { revalidatePermissions } from "@/lib/swr-helpers"
import type { PermissionResponse, PermissionFormData } from "@/types/permission"
import type { ListFilters } from "@/types/common"

export function usePermissions(filters?: ListFilters) {
  const workspaceId = useActiveWorkspaceId()
  const key = workspaceId
    ? ["permissions", "list", workspaceId, filters ?? {}]
    : null
  return useSWR<PermissionResponse[]>(
    key,
    () => permissionService.list(filters),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  )
}

export function usePermission(id?: string) {
  const workspaceId = useActiveWorkspaceId()
  const key = workspaceId && id ? ["permissions", "detail", workspaceId, id] : null
  return useSWR<PermissionResponse>(
    key,
    () => permissionService.describe(id as string),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  )
}

export function useCreatePermission() {
  const { mutate } = useSWRConfig()
  const mutation = useSWRMutation(
    "permission-create",
    async (_key, { arg }: { arg: PermissionFormData }) =>
      permissionService.create(arg),
    {
      onSuccess: () => {
        revalidatePermissions(mutate)
      },
    },
  )

  const create = useCallback(
    async (data: PermissionFormData) => {
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

export function useUpdatePermission(id?: string) {
  const { mutate } = useSWRConfig()
  const mutation = useSWRMutation(
    id ? ["permission-update", id] : null,
    async (_key, { arg }: { arg: PermissionFormData }) =>
      permissionService.update(id as string, arg),
    {
      onSuccess: () => {
        revalidatePermissions(mutate)
      },
    },
  )

  const update = useCallback(
    async (data: PermissionFormData) => {
      if (!id) throw new Error("Missing permission id")
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

export function useDeletePermission() {
  const { mutate } = useSWRConfig()
  const mutation = useSWRMutation(
    "permission-delete",
    async (_key, { arg }: { arg: string }) => permissionService.delete(arg),
    {
      onSuccess: () => {
        revalidatePermissions(mutate)
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
