"use client"

import * as React from "react"
import Link from "next/link"
import { useActiveWorkspaceId } from "@/hooks/use-active-workspace"
import { useMemberships } from "@/hooks/use-memberships"
import { useAccounts } from "@/hooks/use-accounts"
import { useProjects } from "@/hooks/use-projects"
import { useCan } from "@/hooks/use-permissions-check"
import { MembershipTable } from "@/components/memberships/membership-table"
import { OptionCombobox } from "@/components/memberships/option-combobox"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Text } from "@/components/ui/text"
import { PlusIcon, RotateCcwIcon, Building2Icon } from "lucide-react"
import type {
  MembershipFilters,
  MembershipScope,
  MembershipStatus,
} from "@/types/membership"

const scopeOptions: { value: "all" | MembershipScope; label: string }[] = [
  { value: "all", label: "All scopes" },
  { value: "workspace", label: "Workspace" },
  { value: "project", label: "Project" },
]

const statusOptions: { value: "all" | MembershipStatus; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "invited", label: "Invited" },
  { value: "active", label: "Active" },
  { value: "suspended", label: "Suspended" },
]

export default function MembershipsPage() {
  const workspaceId = useActiveWorkspaceId()
  const [accountId, setAccountId] = React.useState<string | null>(null)
  const [scope, setScope] = React.useState<"all" | MembershipScope>("all")
  const [status, setStatus] = React.useState<"all" | MembershipStatus>("all")
  const [projectId, setProjectId] = React.useState<string | null>(null)

  const filters = React.useMemo<MembershipFilters>(
    () => ({
      ...(accountId ? { account_id: accountId } : {}),
      ...(scope !== "all" ? { scope } : {}),
      ...(status !== "all" ? { status } : {}),
      ...(projectId ? { project_id: projectId } : {}),
    }),
    [accountId, scope, status, projectId],
  )

  const { data: accountsData } = useAccounts()
  const { projects } = useProjects()
  const { data: memberships, isLoading, error } = useMemberships(filters)

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

  function resetFilters() {
    setAccountId(null)
    setScope("all")
    setStatus("all")
    setProjectId(null)
  }

  // PERMISSION-GATED: Create requires `membership:create`.
  const canCreate = useCan("membership", "create")

  const hasFilters = Boolean(accountId || scope !== "all" || status !== "all" || projectId)
  const showEmpty = !isLoading && memberships && memberships.length === 0

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Text variant="h2">Memberships</Text>
          <Text variant="muted">Manage who belongs to this workspace.</Text>
        </div>
        {canCreate && (
          <Button render={<Link href="/memberships/new" />}>
            <PlusIcon />
            New membership
          </Button>
        )}
      </div>

      {!workspaceId ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
            <Building2Icon className="size-6 text-muted-foreground" />
            <p className="font-medium">No workspace selected</p>
            <p className="text-sm text-muted-foreground">
              Pick a workspace from the selector in the header to view its
              memberships.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardContent className="flex flex-wrap items-end gap-3">
              <div className="flex min-w-48 flex-col gap-1.5">
                <Label>Account</Label>
                <OptionCombobox
                  options={accountOptions}
                  value={accountId}
                  onChange={(v) => setAccountId(typeof v === "string" ? v : null)}
                  placeholder="Filter by account"
                  emptyText="No accounts found"
                  className="w-56"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Scope</Label>
                <Select
                  value={scope}
                  onValueChange={(v) => setScope((v as "all" | MembershipScope) ?? "all")}
                >
                  <SelectTrigger className="w-40">
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
              <div className="flex flex-col gap-1.5">
                <Label>Status</Label>
                <Select
                  value={status}
                  onValueChange={(v) => setStatus((v as "all" | MembershipStatus) ?? "all")}
                >
                  <SelectTrigger className="w-40">
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
              <div className="flex min-w-48 flex-col gap-1.5">
                <Label>Project</Label>
                <OptionCombobox
                  options={projectOptions}
                  value={projectId}
                  onChange={(v) => setProjectId(typeof v === "string" ? v : null)}
                  placeholder="Filter by project"
                  emptyText="No projects found"
                  className="w-56"
                />
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 text-muted-foreground"
                onClick={resetFilters}
              >
                <RotateCcwIcon />
                Reset
              </Button>
            </CardContent>
          </Card>

          {showEmpty && hasFilters ? (
            <div className="rounded-lg border border-dashed py-12 text-center">
              <p className="text-sm text-muted-foreground">
                No memberships match your filters.
              </p>
              <Button variant="outline" className="mt-3" onClick={resetFilters}>
                Clear filters
              </Button>
            </div>
          ) : showEmpty ? (
            <Card className="flex flex-col items-center justify-center gap-3 py-16 text-center">
              <Building2Icon className="size-10 text-muted-foreground/40" />
              <div>
                <Text variant="h3">No memberships yet</Text>
                <Text variant="muted" className="mt-2">
                  Create your first membership to link an account to this
                  workspace.
                </Text>
              </div>
              {canCreate && (
                <Button render={<Link href="/memberships/new" />}>
                  <PlusIcon />
                  New membership
                </Button>
              )}
            </Card>
          ) : (
            <MembershipTable
              memberships={memberships ?? []}
              isLoading={isLoading}
              error={error}
            />
          )}
        </>
      )}
    </div>
  )
}
