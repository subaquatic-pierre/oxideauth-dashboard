"use client"

import useSWR from "swr"
import {
  workspaceService,
  accountService,
  projectService,
  roleService,
  permissionService,
  credentialService,
  tokenService,
  membershipsService,
} from "@/services"
import { useActiveWorkspaceId } from "@/hooks/use-active-workspace"

export interface DashboardCounts {
  workspaces: number
  accounts: number
  projects: number
  roles: number
  permissions: number
  memberships: number
  credentials: number
  tokens: number
}

/**
 * Fetches live per-workspace summary counts for the dashboard home.
 *
 * Paginated resources use `metadata.total` from a `limit: 1` list call
 * (cheap count). Roles/permissions/memberships expose plain arrays, so their
 * counts are derived from `length` of a bounded list.
 *
 * Re-fetches automatically whenever the active workspace changes (the
 * workspace id is part of the SWR key).
 */
export function useDashboardCounts() {
  const workspaceId = useActiveWorkspaceId()
  const key = workspaceId ? (["dashboard", "counts", workspaceId] as const) : null

  const { data, isLoading, error } = useSWR<DashboardCounts>(
    key,
    async () => {
      const wid = workspaceId!
      const [workspaces, accounts, projects, roles, permissions, memberships, credentials, tokens] =
        await Promise.all([
          workspaceService
            .list({ limit: 1 })
            .then((r) => r.metadata?.total ?? 0),
          accountService
            .list(wid, { options: { limit: 1 } })
            .then((r) => r.metadata?.total ?? 0),
          projectService
            .list(wid, { limit: 1 })
            .then((r) => r.metadata?.total ?? 0),
          roleService
            .list(wid, { limit: 100 })
            .then((r) => r.length ?? 0),
          permissionService
            .list(wid, { limit: 100 })
            .then((r) => r.length ?? 0),
          membershipsService
            .list(wid, {})
            .then((r) => r.length ?? 0),
          credentialService
            .list(wid, { limit: 1 })
            .then((r) => r.metadata?.total ?? 0),
          tokenService
            .list({ limit: 1 })
            .then((r) => r.metadata?.total ?? 0),
        ])

      return {
        workspaces,
        accounts,
        projects,
        roles,
        permissions,
        memberships,
        credentials,
        tokens,
      }
    },
  )

  return { counts: data, isLoading, error }
}
