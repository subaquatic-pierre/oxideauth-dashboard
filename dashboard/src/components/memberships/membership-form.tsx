"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  useCreateMembership,
  useUpdateMembership,
} from "@/hooks/use-memberships"
import { useProjects } from "@/hooks/use-projects"
import { useRoles } from "@/hooks/use-roles"
import { OptionCombobox } from "@/components/memberships/option-combobox"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
  MembershipProfileCreateReq,
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

function parseTags(text: string): string[] {
  return text
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
}

export function MembershipForm({ membership }: MembershipFormProps) {
  const router = useRouter()
  const isEdit = Boolean(membership)
  const createMembership = useCreateMembership()
  const updateMembership = useUpdateMembership(membership?.id ?? "")

  const { projects, isLoading: projectsLoading } = useProjects()
  const { data: rolesData, isLoading: rolesLoading } = useRoles()

  // Onboarding (create) fields
  const [email, setEmail] = React.useState("")
  const [name, setName] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [displayName, setDisplayName] = React.useState("")
  const [jobTitle, setJobTitle] = React.useState("")
  const [timezone, setTimezone] = React.useState("")
  const [avatarUrl, setAvatarUrl] = React.useState("")
  const [profileTagsText, setProfileTagsText] = React.useState("")

  // Shared fields
  const [scope, setScope] = React.useState<MembershipScope>(
    membership?.scope ?? "workspace",
  )
  const [projectId, setProjectId] = React.useState(membership?.project_id ?? "")
  const [status, setStatus] = React.useState<MembershipStatus>(
    membership?.status ?? "invited",
  )
  const [roleIds, setRoleIds] = React.useState<string[]>(
    membership?.roles?.map((r) => r.id) ?? [],
  )
  const [tagsText, setTagsText] = React.useState(
    membership?.tags?.join(", ") ?? "",
  )
  const [error, setError] = React.useState<string | null>(null)

  const projectOptions = React.useMemo(
    () => projects.map((p) => ({ value: p.id, label: p.name })),
    [projects],
  )
  const roleOptions = React.useMemo(
    () => (rolesData ?? []).map((r) => ({ value: r.id, label: r.name })),
    [rolesData],
  )

  function validate(): string | null {
    if (!isEdit && !email.trim()) return "Please enter an email address."
    if (!isEdit && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return "Please enter a valid email address."
    }
    if (scope === "project" && !projectId) {
      return "Please select a project for project-scoped memberships."
    }
    return null
  }

  function buildProfile(): MembershipProfileCreateReq | undefined {
    if (isEdit) return undefined
    const p: MembershipProfileCreateReq = {}
    if (name.trim()) p.name = name.trim()
    if (description.trim()) p.description = description.trim()
    if (displayName.trim()) p.display_name = displayName.trim()
    if (jobTitle.trim()) p.job_title = jobTitle.trim()
    if (timezone.trim()) p.timezone = timezone.trim()
    if (avatarUrl.trim()) p.avatar_url = avatarUrl.trim()
    const profileTags = parseTags(profileTagsText)
    if (profileTags.length) p.tags = profileTags
    return Object.keys(p).length > 0 ? p : undefined
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
      const profile = buildProfile()
      const data: MembershipFormData = {
        scope,
        status,
        ...(scope === "project" && projectId ? { project_id: projectId } : {}),
        role_ids: roleIds,
        tags: parseTags(tagsText),
        ...(!isEdit
          ? { email: email.trim(), ...(profile ? { profile } : {}) }
          : {}),
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
            : "Add a new user by email. A profile is created alongside the membership."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {!isEdit ? (
              <>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="email">
                    Email<span className="ml-1 text-destructive">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="e.g. member@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g. Jane Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="display-name">Display name</Label>
                  <Input
                    id="display-name"
                    placeholder="e.g. Jane"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="job-title">Job title</Label>
                  <Input
                    id="job-title"
                    placeholder="e.g. Engineer"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Input
                    id="timezone"
                    placeholder="e.g. UTC"
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="avatar-url">Avatar URL</Label>
                  <Input
                    id="avatar-url"
                    type="url"
                    placeholder="https://example.com/avatar.png"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    placeholder="Optional profile description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="profile-tags">Profile tags</Label>
                  <Input
                    id="profile-tags"
                    placeholder="comma, separated, tags"
                    value={profileTagsText}
                    onChange={(e) => setProfileTagsText(e.target.value)}
                  />
                </div>
              </>
            ) : null}

            <div className="space-y-2">
              <Label>Scope</Label>
              <Select
                value={scope}
                onValueChange={(v) =>
                  setScope((v as MembershipScope) ?? "workspace")
                }
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
                onValueChange={(v) =>
                  setStatus((v as MembershipStatus) ?? "invited")
                }
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
              <Label htmlFor="membership-tags">Membership tags</Label>
              <Input
                id="membership-tags"
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
                router.push(
                  isEdit && membership
                    ? `/memberships/${membership.id}`
                    : "/memberships",
                )
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
