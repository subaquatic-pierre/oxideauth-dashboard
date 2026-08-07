"use client"

import { useState } from "react"
import Link from "next/link"
import { Text } from "@/components/ui/text"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { RoleTable } from "@/components/roles/role-table"
import { useRoles, useDeleteRole } from "@/hooks/use-roles"
import { useActiveWorkspaceId } from "@/hooks/use-active-workspace"
import { useCan } from "@/hooks/use-permissions-check"
import { isNetworkError } from "@/lib/api"
import { Building2Icon, ShieldIcon, PlusIcon } from "lucide-react"
import type { Role } from "@/types/role"

export default function RolesPage() {
  const workspaceId = useActiveWorkspaceId() ?? undefined
  const { data: roles, isLoading, error } = useRoles(workspaceId)
  const { remove, error: deleteError } = useDeleteRole()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // PERMISSION-GATED: Create requires `role:create`.
  const canCreate = useCan("role", "create")

  async function handleDelete(role: Role) {
    if (!workspaceId) return
    if (!window.confirm(`Delete role "${role.name}"?`)) return
    setDeletingId(role.id)
    try {
      await remove(workspaceId, role.id)
    } catch {
      // error is surfaced via deleteError
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Text variant="h2">Roles</Text>
          <Text variant="muted">
            Group permissions into roles for the active workspace.
          </Text>
        </div>
        {canCreate && (
          <Button render={<Link href="/roles/new" />}>
            <PlusIcon />
            New Role
          </Button>
        )}
      </div>

      {!workspaceId && (
        <Alert variant="warning">
          <AlertTitle>No active workspace</AlertTitle>
          <AlertDescription className="flex flex-wrap items-center gap-2">
            <span>
              Select a workspace to view its roles. You can create one first
              from the Workspaces page.
            </span>
            <Button size="sm" variant="outline" render={<Link href="/workspaces" />}>
              <Building2Icon />
              Go to Workspaces
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {deleteError && (
        <Alert variant="error">
          <AlertTitle>Delete failed</AlertTitle>
          <AlertDescription>{deleteError}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="error">
          <AlertTitle>Failed to load roles</AlertTitle>
          <AlertDescription>
            {isNetworkError(error)
              ? "Unable to connect to the OxideAuth API. Please check your connection and try again."
              : error.message}
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All roles</CardTitle>
          <CardDescription>
            {isLoading
              ? "Loading..."
              : `${roles?.length ?? 0} role${roles?.length === 1 ? "" : "s"}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : !roles || roles.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
              <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                <ShieldIcon className="size-5" />
              </div>
              <div>
                <p className="font-medium">No roles yet</p>
                <p className="text-sm text-muted-foreground">
                  Create your first role to group permissions together.
                </p>
              </div>
              {canCreate && (
                <Button size="sm" render={<Link href="/roles/new" />}>
                  <PlusIcon />
                  New Role
                </Button>
              )}
            </div>
          ) : (
            <RoleTable roles={roles} deletingId={deletingId} onDelete={handleDelete} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
