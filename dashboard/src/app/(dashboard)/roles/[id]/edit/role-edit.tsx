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
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { RoleForm } from "@/components/roles/role-form"
import { useRole, useUpdateRole } from "@/hooks/use-roles"
import { useActiveWorkspaceId } from "@/hooks/use-active-workspace"
import { Building2Icon } from "lucide-react"
import type { RoleFormData } from "@/types/role"

export default function EditRolePage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const workspaceId = useActiveWorkspaceId()
  const { data: role, isLoading, error } = useRole(workspaceId ?? undefined, params.id)
  const { update, isUpdating, error: updateError } = useUpdateRole(params.id)

  async function handleSubmit(data: RoleFormData) {
    if (!workspaceId) return
    try {
      await update(workspaceId, data)
      router.push(`/roles/${params.id}`)
    } catch {
      // error is surfaced via the mutation error below
    }
  }

  if (!workspaceId) {
    return (
      <div className="space-y-6">
        <Text variant="h2">Edit Role</Text>
        <Alert variant="warning">
          <AlertTitle>No active workspace</AlertTitle>
          <AlertDescription className="flex flex-wrap items-center gap-2">
            <span>Select a workspace to edit this role.</span>
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
      <div>
        <Text variant="h2">Edit Role</Text>
        <Text variant="muted">Update the role and its permissions.</Text>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="space-y-4 py-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-24 w-full" />
          </CardContent>
        </Card>
      ) : !role ? (
        <Alert variant="error">
          <AlertTitle>Role not found</AlertTitle>
          <AlertDescription>
            {error ? error.message : "This role could not be loaded."}
          </AlertDescription>
        </Alert>
      ) : (
        <>
          {(error || updateError) && (
            <Alert variant="error">
              <AlertTitle>Something went wrong</AlertTitle>
              <AlertDescription>{updateError ?? error?.message}</AlertDescription>
            </Alert>
          )}
          <Card>
            <CardHeader>
              <CardTitle>Role details</CardTitle>
              <CardDescription>
                Editing <span className="font-medium">{role.name}</span>.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RoleForm
                workspaceId={workspaceId}
                initialData={{
                  name: role.name,
                  description: role.description ?? undefined,
                  permission_ids: role.permissions?.map((p) => p.id) ?? [],
                }}
                isSubmitting={isUpdating}
                submitLabel="Save changes"
                onSubmit={handleSubmit}
              />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
