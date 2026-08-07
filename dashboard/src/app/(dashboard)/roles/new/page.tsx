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
import { RoleForm } from "@/components/roles/role-form"
import { useCreateRole } from "@/hooks/use-roles"
import { useActiveWorkspaceId } from "@/hooks/use-active-workspace"
import { Building2Icon } from "lucide-react"
import type { RoleFormData } from "@/types/role"

export default function NewRolePage() {
  const router = useRouter()
  const workspaceId = useActiveWorkspaceId()
  const { create, isCreating, error } = useCreateRole()

  async function handleSubmit(data: RoleFormData) {
    if (!workspaceId) return
    try {
      const created = await create(workspaceId, data)
      router.push(`/roles/${created.id}`)
    } catch {
      // error is surfaced via the mutation error below
    }
  }

  if (!workspaceId) {
    return (
      <div className="space-y-6">
        <Text variant="h2">New Role</Text>
        <Alert variant="warning">
          <AlertTitle>No active workspace</AlertTitle>
          <AlertDescription className="flex flex-wrap items-center gap-2">
            <span>Select a workspace to create a role in.</span>
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
        <Text variant="h2">New Role</Text>
        <Text variant="muted">
          Create a role and assign permissions to it.
        </Text>
      </div>

      {error && (
        <Alert variant="error">
          <AlertTitle>Create failed</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Role details</CardTitle>
          <CardDescription>
            Assign one or more permissions to define what this role can do.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RoleForm
            workspaceId={workspaceId}
            isSubmitting={isCreating}
            submitLabel="Create role"
            onSubmit={handleSubmit}
          />
        </CardContent>
      </Card>
    </div>
  )
}
