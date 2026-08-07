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
import { PermissionTable } from "@/components/permissions/permission-table"
import { usePermissions, useDeletePermission } from "@/hooks/use-permissions"
import { useActiveWorkspaceId } from "@/hooks/use-active-workspace"
import { useCan } from "@/hooks/use-permissions-check"
import { isNetworkError } from "@/lib/api"
import { Building2Icon, KeyIcon, PlusIcon } from "lucide-react"
import type { Permission } from "@/types/permission"

export default function PermissionsPage() {
  const workspaceId = useActiveWorkspaceId() ?? undefined
  const {
    data: permissions,
    isLoading,
    error,
  } = usePermissions(workspaceId)
  const { remove, error: deleteError } = useDeletePermission()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // PERMISSION-GATED: Create requires `permission:create`.
  const canCreate = useCan("permission", "create")

  async function handleDelete(permission: Permission) {
    if (!workspaceId) return
    if (!window.confirm(`Delete permission "${permission.name}"?`)) return
    setDeletingId(permission.id)
    try {
      await remove(workspaceId, permission.id)
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
          <Text variant="h2">Permissions</Text>
          <Text variant="muted">
            Manage fine-grained permissions for the active workspace.
          </Text>
        </div>
        {canCreate && (
          <Button render={<Link href="/permissions/new" />}>
            <PlusIcon />
            New Permission
          </Button>
        )}
      </div>

      {!workspaceId && (
        <Alert variant="warning">
          <AlertTitle>No active workspace</AlertTitle>
          <AlertDescription className="flex flex-wrap items-center gap-2">
            <span>
              Select a workspace to view its permissions. You can create one
              first from the Workspaces page.
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
          <AlertTitle>Failed to load permissions</AlertTitle>
          <AlertDescription>
            {isNetworkError(error)
              ? "Unable to connect to the OxideAuth API. Please check your connection and try again."
              : error.message}
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All permissions</CardTitle>
          <CardDescription>
            {isLoading
              ? "Loading..."
              : `${permissions?.length ?? 0} permission${permissions?.length === 1 ? "" : "s"}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : !permissions || permissions.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
              <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                <KeyIcon className="size-5" />
              </div>
              <div>
                <p className="font-medium">No permissions yet</p>
                <p className="text-sm text-muted-foreground">
                  Create your first permission to start scoping access.
                </p>
              </div>
              {canCreate && (
                <Button size="sm" render={<Link href="/permissions/new" />}>
                  <PlusIcon />
                  New Permission
                </Button>
              )}
            </div>
          ) : (
            <PermissionTable
              permissions={permissions}
              deletingId={deletingId}
              onDelete={handleDelete}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
