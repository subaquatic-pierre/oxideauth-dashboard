"use client"

import { useRouter } from "next/navigation"
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { PermissionForm } from "@/components/permissions/permission-form"
import { useCreatePermission } from "@/hooks/use-permissions"
import { useActiveWorkspaceId } from "@/hooks/use-active-workspace"
import { Building2Icon } from "lucide-react"
import type { PermissionFormData } from "@/types/permission"

export default function NewPermissionPage() {
  const router = useRouter()
  const workspaceId = useActiveWorkspaceId() ?? undefined
  const { create, isCreating, error } = useCreatePermission()

  async function handleSubmit(data: PermissionFormData) {
    if (!workspaceId) return
    try {
      const created = await create(data)
      router.push(`/permissions/${created.id}`)
    } catch {
      // error is surfaced via the mutation error below
    }
  }

  if (!workspaceId) {
    return (
      <div className="space-y-6">
        <Text variant="h2">New Permission</Text>
        <Alert variant="warning">
          <AlertTitle>No active workspace</AlertTitle>
          <AlertDescription className="flex flex-wrap items-center gap-2">
            <span>
              Select a workspace to create a permission in.
            </span>
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
        <Text variant="h2">New Permission</Text>
        <Text variant="muted">Create a fine-grained permission.</Text>
      </div>

      {error && (
        <Alert variant="error">
          <AlertTitle>Create failed</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Permission details</CardTitle>
          <CardDescription>
            The code must be unique within the workspace.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PermissionForm
            isSubmitting={isCreating}
            submitLabel="Create permission"
            onSubmit={handleSubmit}
          />
        </CardContent>
      </Card>
    </div>
  )
}
