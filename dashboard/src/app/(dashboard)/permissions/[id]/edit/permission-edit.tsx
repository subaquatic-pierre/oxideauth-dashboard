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
import { PermissionForm } from "@/components/permissions/permission-form"
import { usePermission, useUpdatePermission } from "@/hooks/use-permissions"
import { useActiveWorkspaceId } from "@/hooks/use-active-workspace"
import { Building2Icon } from "lucide-react"
import type { PermissionFormData } from "@/types/permission"

export default function EditPermissionPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const workspaceId = useActiveWorkspaceId() ?? undefined
  const { data: permission, isLoading, error } = usePermission(params.id)
  const { update, isUpdating, error: updateError } = useUpdatePermission(params.id)

  async function handleSubmit(data: PermissionFormData) {
    if (!workspaceId) return
    try {
      await update(data)
      router.push(`/permissions/${params.id}`)
    } catch {
      // error is surfaced via the mutation error below
    }
  }

  if (!workspaceId) {
    return (
      <div className="space-y-6">
        <Text variant="h2">Edit Permission</Text>
        <Alert variant="warning">
          <AlertTitle>No active workspace</AlertTitle>
          <AlertDescription className="flex flex-wrap items-center gap-2">
            <span>Select a workspace to edit this permission.</span>
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
        <Text variant="h2">Edit Permission</Text>
        <Text variant="muted">Update the permission details.</Text>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="space-y-4 py-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
      ) : !permission ? (
        <Alert variant="error">
          <AlertTitle>Permission not found</AlertTitle>
          <AlertDescription>
            {error ? error.message : "This permission could not be loaded."}
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
              <CardTitle>Permission details</CardTitle>
              <CardDescription>
                Editing <span className="font-medium">{permission.name}</span>.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PermissionForm
                initialData={{
                  name: permission.name,
                  code: permission.code ?? undefined,
                  description: permission.description ?? undefined,
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
