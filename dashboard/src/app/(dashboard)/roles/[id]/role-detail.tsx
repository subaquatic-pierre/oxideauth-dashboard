"use client"

import { useParams, useRouter } from "next/navigation"
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
import { Pill } from "@/components/ui/pill"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useRole, useDeleteRole } from "@/hooks/use-roles"
import { usePermissions } from "@/hooks/use-permissions"
import { useActiveWorkspaceId } from "@/hooks/use-active-workspace"
import { useCan } from "@/hooks/use-permissions-check"
import { formatDateTime } from "@/lib/format"
import { Building2Icon, KeyIcon, Loader2Icon, PencilIcon, Trash2Icon } from "lucide-react"
import type { Permission } from "@/types/permission"

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-lg bg-muted/50 px-4 py-3">
      <span className="shrink-0 text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{children}</span>
    </div>
  )
}

export default function RoleDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const workspaceId = useActiveWorkspaceId() ?? undefined
  const { data: role, isLoading, error } = useRole(workspaceId, params.id)
  const { data: allPermissions } = usePermissions(workspaceId)
  const { remove, isDeleting, error: deleteError } = useDeleteRole()

  // PERMISSION-GATED: Edit requires `role:update`, Delete requires `role:delete`.
  const canEdit = useCan("role", "update")
  const canDelete = useCan("role", "delete")

  async function handleDelete() {
    if (!workspaceId || !role) return
    if (!window.confirm(`Delete role "${role.name}"?`)) return
    try {
      await remove(workspaceId, role.id)
      router.push("/roles")
    } catch {
      // error is surfaced via deleteError
    }
  }

  // Prefer the permissions embedded on describe; fall back to resolving
  // the permission ids against the workspace permission list.
  const permissions: Permission[] =
    role?.permissions?.length
      ? role.permissions
      : (allPermissions ?? []).filter((p) => role?.permission_ids?.includes(p.id))

  if (!workspaceId) {
    return (
      <div className="space-y-6">
        <Text variant="h2">Role</Text>
        <Alert variant="warning">
          <AlertTitle>No active workspace</AlertTitle>
          <AlertDescription className="flex flex-wrap items-center gap-2">
            <span>Select a workspace to view its roles.</span>
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
      ) : !role ? (
        <Alert variant="error">
          <AlertTitle>Role not found</AlertTitle>
          <AlertDescription>
            {error ? error.message : "This role could not be loaded."}
          </AlertDescription>
        </Alert>
      ) : (
        <>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <Text variant="h2">{role.name}</Text>
              <Pill variant="info" className="mt-1">
                {permissions.length} permission{permissions.length === 1 ? "" : "s"}
              </Pill>
            </div>
            <div className="flex gap-2">
              {canEdit && (
                <Button
                  variant="outline"
                  render={<Link href={`/roles/${role.id}/edit`} />}
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
              <AlertTitle>Failed to load role</AlertTitle>
              <AlertDescription>{error.message}</AlertDescription>
            </Alert>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
              <CardDescription>Role properties.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <DetailRow label="Name">{role.name}</DetailRow>
              <DetailRow label="Description">
                {role.description || "—"}
              </DetailRow>
              <DetailRow label="ID">
                <span className="font-mono text-xs">{role.id}</span>
              </DetailRow>
              <DetailRow label="Workspace">
                <span className="font-mono text-xs">{role.workspace_id}</span>
              </DetailRow>
              <DetailRow label="Created">
                {formatDateTime(role.created_at)}
              </DetailRow>
              <DetailRow label="Updated">
                {formatDateTime(role.updated_at)}
              </DetailRow>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Assigned permissions</CardTitle>
              <CardDescription>
                {permissions.length > 0
                  ? `${permissions.length} permission${permissions.length === 1 ? "" : "s"} granted by this role.`
                  : "No permissions assigned to this role yet."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {permissions.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                    <KeyIcon className="size-5" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Assign permissions by editing this role.
                  </p>
                  <Button size="sm" render={<Link href={`/roles/${role.id}/edit`} />}>
                    <PencilIcon />
                    Edit role
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {permissions.map((permission) => (
                      <TableRow key={permission.id}>
                        <TableCell className="font-medium">
                          <Link
                            href={`/permissions/${permission.id}`}
                            className="underline-offset-4 hover:underline"
                          >
                            {permission.name}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="font-mono">
                            {permission.code}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-72 truncate text-muted-foreground">
                          {permission.description || "—"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
