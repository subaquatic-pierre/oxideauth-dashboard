"use client"

import useSWR from "swr"
import useSWRMutation from "swr/mutation"
import { projectService } from "@/services"
import { getActiveWorkspaceId } from "@/lib/workspace"
import type { Project, ProjectFormData } from "@/types/project"
import type { ListFilters } from "@/types/common"

/**
 * Project list + mutations for the active workspace. The workspace id is read
 * from localStorage ("active_workspace_id"), which the header workspace
 * selector persists. It is used only to partition the SWR cache key — the
 * service reads the active workspace internally.
 */
export function useProjects(filters?: ListFilters) {
  const workspaceId = getActiveWorkspaceId()

  const { data, isLoading, error, mutate } = useSWR(
    workspaceId ? ["projects", workspaceId, filters] : null,
    () => projectService.list(filters),
  )

  const createMutation = useSWRMutation(
    "projects-create",
    async (_key: string, { arg }: { arg: ProjectFormData }) => {
      return projectService.create(arg)
    },
    { onSuccess: () => mutate() },
  )

  const updateMutation = useSWRMutation(
    "projects-update",
    async (_key: string, { arg }: { arg: { id: string; data: ProjectFormData } }) => {
      return projectService.update(arg.id, arg.data)
    },
    { onSuccess: () => mutate() },
  )

  const deleteMutation = useSWRMutation(
    "projects-delete",
    async (_key: string, { arg }: { arg: string }) => {
      return projectService.delete(arg)
    },
    { onSuccess: () => mutate() },
  )

  return {
    projects: data?.projects ?? [],
    total: data?.metadata?.total ?? 0,
    isLoading,
    error,
    mutate,
    createProject: createMutation.trigger,
    updateProject: updateMutation.trigger,
    deleteProject: deleteMutation.trigger,
    isCreating: createMutation.isMutating,
    isUpdating: updateMutation.isMutating,
    isDeleting: deleteMutation.isMutating,
    createError: createMutation.error,
    updateError: updateMutation.error,
    deleteError: deleteMutation.error,
  }
}

/** Fetch a single project by UUID `id` or workspace-unique `code`. */
export function useProject(idOrCode: string) {
  const workspaceId = getActiveWorkspaceId()

  const { data, isLoading, error, mutate } = useSWR(
    workspaceId && idOrCode ? ["project", workspaceId, idOrCode] : null,
    () => projectService.describe(idOrCode),
  )

  return { project: data, isLoading, error, mutate }
}

export type { Project, ProjectFormData }
