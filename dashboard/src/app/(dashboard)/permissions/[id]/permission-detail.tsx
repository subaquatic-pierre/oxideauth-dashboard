"use client"

import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Text } from "@/components/ui/text"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { usePermission, useDeletePermission } from "@/hooks/use-permissions"
import { useActiveWorkspaceId } from "@/hooks/use-active-workspace"
import { useCan } from "@/hooks/use-permissions-check"
import { formatDateTime } from "@/lib/format"
import { Building2Icon, Loader2Icon, PencilIcon, Trash2Icon } from "lucide-react"

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-lg bg-muted/50 px-4 py-3">
      <span className="shrink-0 text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{children}</span>
    </div>
  )
}

export default function PermissionDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const workspaceId = useActiveWorkspaceId() ?? undefined
  const { data: permission, isLoading, error } = usePermission(workspaceId, params.id)
  const { remove, isDeleting, error: deleteError } = useDeletePermission()

  // PERMISSION-GATED: Edit requires `permission:update`, Delete requires `permission:delete`.
  const canEdit = useCan("permission", "update")
  const canDelete = useCan("permission", "delete")

  async function handleDelete() {
    if (!workspaceId || !permission) return
    if (!window.confirm(`Delete permission "${permission.name}"?`)) return
    try {
      await remove(workspaceId, permission.id)
      router.push("/permissions")
    } catch {
      // error is surfaced via deleteError
    }
  }

  if (!workspaceId) {
    return (
      <div className="space-y-6">
        <Text variant="h2">Permission</Text>
        <Alert variant="warning">
          <AlertTitle>No active workspace</AlertTitle>
          <AlertDescription className="flex flex-wrap items-center gap-2">
            <span>Select a workspace to view its permissions.</span>
            <Button size="sm" variant="outline" render={<Link href="/workspaces" />}>
              <Building2Icon />
              Go to Workspaces
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <Card>
            <CardContent className="space-y-3 py-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        </div>
      ) : !permission ? (
        <Alert variant="error">
          <AlertTitle>Permission not found</AlertTitle>
          <AlertDescription>
            {error ? error.message : "This permission could not be loaded."}
          </AlertDescription>
        </Alert>
      ) : (
        <>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <Text variant="h2">{permission.name}</Text>
              <Badge variant="secondary" className="mt-1 font-mono">
                {permission.code}
              </Badge>
            </div>
            <div className="flex gap-2">
              {canEdit && (
                <Button
                  variant="outline"
                  render={<Link href={`/permissions/${permission.id}/edit`} />}
                >
                  <PencilIcon />
                  Edit
                </Button>
              )}
              {canDelete && (
                <Button
                  variant="destructive"
                  disabled={isDeleting}
                  onClick={handleDelete}
                >
                  {isDeleting ? <Loader2Icon className="animate-spin" /> : <Trash2Icon />}
                  Delete
                </Button>
              )}
            </div>
          </div>

          {deleteError && (
            <Alert variant="error">
              <AlertTitle>Delete failed</AlertTitle>
              <AlertDescription>{deleteError}</AlertDescription>
            </Alert>
          )}
          {error && (
            <Alert variant="error">
              <AlertTitle>Failed to load permission</AlertTitle>
              <AlertDescription>{error.message}</AlertDescription>
            </Alert>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
              <CardDescription>Permission properties.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <DetailRow label="Name">{permission.name}</DetailRow>
              <DetailRow label="Code">
                <span className="font-mono">{permission.code}</span>
              </DetailRow>
              <DetailRow label="Description">
                {permission.description || "—"}
              </DetailRow>
              <DetailRow label="ID">
                <span className="font-mono text-xs">{permission.id}</span>
              </DetailRow>
              <DetailRow label="Created">
                {formatDateTime(permission.created_at)}
              </DetailRow>
              <DetailRow label="Updated">
                {permission.updated_at ? formatDateTime(permission.updated_at) : "—"}
              </DetailRow>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
