"use client"

import { useCallback } from "react"
import useSWR, { useSWRConfig } from "swr"
import useSWRMutation from "swr/mutation"
import { permissionService } from "@/services"
import { errorMessage } from "@/lib/errors"
import { revalidatePermissions } from "@/lib/swr-helpers"
import type { PermissionResponse, PermissionFormData } from "@/types/permission"
import type { ListFilters } from "@/types/common"

export function usePermissions(workspaceId?: string, filters?: ListFilters) {
  const key = workspaceId
    ? ["permissions", "list", workspaceId, filters ?? {}]
    : null
  return useSWR<PermissionResponse[]>(
    key,
    () => permissionService.list(workspaceId, filters),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  )
}

export function usePermission(workspaceId?: string, id?: string) {
  const key = workspaceId && id ? ["permissions", "detail", workspaceId, id] : null
  return useSWR<PermissionResponse>(
    key,
    () => permissionService.describe(workspaceId, id as string),
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
    async (_key, { arg }: { arg: { workspaceId: string; data: PermissionFormData } }) =>
      permissionService.create(arg.workspaceId, arg.data),
    {
      onSuccess: () => {
        revalidatePermissions(mutate)
      },
    },
  )

  const create = useCallback(
    async (workspaceId: string, data: PermissionFormData) => {
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

export function useUpdatePermission(id?: string) {
  const { mutate } = useSWRConfig()
  const mutation = useSWRMutation(
    id ? ["permission-update", id] : null,
    async (_key, { arg }: { arg: { workspaceId: string; data: PermissionFormData } }) =>
      permissionService.update(arg.workspaceId, id as string, arg.data),
    {
      onSuccess: () => {
        revalidatePermissions(mutate)
      },
    },
  )

  const update = useCallback(
    async (workspaceId: string, data: PermissionFormData) => {
      if (!id) throw new Error("Missing permission id")
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

export function useDeletePermission() {
  const { mutate } = useSWRConfig()
  const mutation = useSWRMutation(
    "permission-delete",
    async (_key, { arg }: { arg: { workspaceId: string; id: string } }) =>
      permissionService.delete(arg.workspaceId, arg.id),
    {
      onSuccess: () => {
        revalidatePermissions(mutate)
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
