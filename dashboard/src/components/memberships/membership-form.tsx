"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  useCreateMembership,
  useUpdateMembership,
} from "@/hooks/use-memberships"
import { useAccounts } from "@/hooks/use-accounts"
import { useProjects } from "@/hooks/use-projects"
import { useRoles } from "@/hooks/use-roles"
import { OptionCombobox } from "@/components/memberships/option-combobox"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { XIcon } from "lucide-react"
import type {
  Membership,
  MembershipFormData,
  MembershipScope,
  MembershipStatus,
} from "@/types/membership"

interface MembershipFormProps {
  membership?: Membership
}

const scopeOptions: { value: MembershipScope; label: string }[] = [
  { value: "workspace", label: "Workspace" },
  { value: "project", label: "Project" },
]

const statusOptions: { value: MembershipStatus; label: string }[] = [
  { value: "invited", label: "Invited" },
  { value: "active", label: "Active" },
  { value: "suspended", label: "Suspended" },
]

export function MembershipForm({ membership }: MembershipFormProps) {
  const router = useRouter()
  const isEdit = Boolean(membership)
  const createMembership = useCreateMembership()
  const updateMembership = useUpdateMembership(membership?.id ?? "")

  const { data: accountsData, isLoading: accountsLoading } =
    useAccounts()
  const { projects, isLoading: projectsLoading } = useProjects()
  const { data: rolesData, isLoading: rolesLoading } = useRoles()

  const [accountId, setAccountId] = React.useState(membership?.account_id ?? "")
  const [scope, setScope] = React.useState<MembershipScope>(
    membership?.scope ?? "workspace",
  )
  const [projectId, setProjectId] = React.useState(membership?.project_id ?? "")
  const [status, setStatus] = React.useState<MembershipStatus>(
    membership?.status ?? "active",
  )
  const [roleIds, setRoleIds] = React.useState<string[]>(
    membership?.roles?.map((r) => r.id) ?? [],
  )
  const [tagsText, setTagsText] = React.useState(membership?.tags?.join(", ") ?? "")
  const [error, setError] = React.useState<string | null>(null)

  const accountOptions = React.useMemo(() => {
    const list = accountsData?.accounts ?? []
    return list.map((a) => ({
      value: a.id,
      label: a.email || a.name || a.id,
      hint: a.name && a.name !== a.email ? a.name : undefined,
    }))
  }, [accountsData])
  const projectOptions = React.useMemo(
    () => projects.map((p) => ({ value: p.id, label: p.name })),
    [projects],
  )
  const roleOptions = React.useMemo(
    () => (rolesData ?? []).map((r) => ({ value: r.id, label: r.name })),
    [rolesData],
  )

  function parseTags(text: string): string[] {
    return text
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
  }

  function validate(): string | null {
    if (!accountId) return "Please select an account."
    if (scope === "project" && !projectId) {
      return "Please select a project for project-scoped memberships."
    }
    return null
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }
    setError(null)
    try {
      const data: MembershipFormData = {
        account_id: accountId,
        scope,
        status,
        ...(scope === "project" && projectId ? { project_id: projectId } : {}),
        role_ids: roleIds,
        tags: parseTags(tagsText),
      }
      const result = membership
        ? await updateMembership.trigger(data)
        : await createMembership.trigger(data)
      router.push(`/memberships/${result.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save membership.")
    }
  }

  const isSubmitting = createMembership.isMutating || updateMembership.isMutating

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEdit ? "Edit membership" : "New membership"}</CardTitle>
        <CardDescription>
          {isEdit
            ? "Update the member's scope, status, and assigned roles."
            : "Add an account to this workspace and assign roles."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label>Account</Label>
              {accountsLoading ? (
                <Skeleton className="h-8 w-full" />
              ) : (
                <OptionCombobox
                  options={accountOptions}
                  value={accountId}
                  onChange={(v) => setAccountId(typeof v === "string" ? v : "")}
                  placeholder="Search account by email or name..."
                  emptyText="No accounts found"
                />
              )}
            </div>

            <div className="space-y-2">
              <Label>Scope</Label>
              <Select
                value={scope}
                onValueChange={(v) => setScope((v as MembershipScope) ?? "workspace")}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {scopeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {scope === "project" ? (
              <div className="space-y-2">
                <Label>Project</Label>
                {projectsLoading ? (
                  <Skeleton className="h-8 w-full" />
                ) : (
                  <OptionCombobox
                    options={projectOptions}
                    value={projectId}
                    onChange={(v) => setProjectId(typeof v === "string" ? v : "")}
                    placeholder="Search project..."
                    emptyText="No projects found"
                  />
                )}
              </div>
            ) : (
              <div className="hidden sm:block" />
            )}

            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={status}
                onValueChange={(v) => setStatus((v as MembershipStatus) ?? "active")}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label>Roles</Label>
              {rolesLoading ? (
                <Skeleton className="h-8 w-full" />
              ) : (
                <>
                  <OptionCombobox
                    multiple
                    options={roleOptions}
                    value={roleIds}
                    onChange={(v) => setRoleIds(Array.isArray(v) ? v : [])}
                    placeholder="Search and select roles..."
                    emptyText="No roles found"
                  />
                  {roleIds.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {roleIds.map((id) => {
                        const role = (rolesData ?? []).find((r) => r.id === id)
                        return (
                          <span
                            key={id}
                            className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground"
                          >
                            {role?.name ?? id}
                            <button
                              type="button"
                              aria-label={`Remove role ${role?.name ?? id}`}
                              className="inline-flex items-center rounded-sm hover:bg-secondary-foreground/20"
                              onClick={() =>
                                setRoleIds(roleIds.filter((r) => r !== id))
                              }
                            >
                              <XIcon className="size-3" />
                            </button>
                          </span>
                        )
                      })}
                    </div>
                  ) : null}
                </>
              )}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label>Tags</Label>
              <Input
                value={tagsText}
                onChange={(e) => setTagsText(e.target.value)}
                placeholder="comma, separated, tags"
              />
            </div>
          </div>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                router.push(isEdit && membership ? `/memberships/${membership.id}` : "/memberships")
              }
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Saving..."
                : isEdit
                  ? "Save changes"
                  : "Create membership"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
