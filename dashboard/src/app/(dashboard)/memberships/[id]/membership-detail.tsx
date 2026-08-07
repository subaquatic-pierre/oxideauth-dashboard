"use client"

import * as React from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useActiveWorkspaceId } from "@/hooks/use-active-workspace"
import { useMembership } from "@/hooks/use-memberships"
import { useRoles } from "@/hooks/use-roles"
import { useCan } from "@/hooks/use-permissions-check"
import { StatusBadge } from "@/components/memberships/membership-table"
import { DetailRow } from "@/components/detail-row"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Text } from "@/components/ui/text"
import { formatDateTime } from "@/lib/format"
import { ArrowLeftIcon, PencilIcon } from "lucide-react"
import type { Membership } from "@/types/membership"
import type { Role } from "@/types/role"

function MembershipDetail({ membership }: { membership: Membership }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Details about the member account.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3 rounded-lg bg-muted/50 px-4 py-3">
            <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
              {(membership.account?.name ?? membership.account?.email ?? "?")
                .slice(0, 1)
                .toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate font-medium">
                {membership.account?.name ?? "Unknown account"}
              </p>
              <p className="truncate text-sm text-muted-foreground">
                {membership.account?.email ?? membership.account_id}
              </p>
            </div>
          </div>
          <DetailRow
            label="Account ID"
            value={<span className="font-mono text-xs">{membership.account_id}</span>}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Membership</CardTitle>
          <CardDescription>Scope, status, and role assignments.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <DetailRow
            label="Scope"
            value={
              <Badge variant="outline" className="capitalize">
                {membership.scope}
              </Badge>
            }
          />
          {membership.scope === "project" && membership.project_id ? (
            <DetailRow
              label="Project"
              value={
                <span className="font-mono text-xs">{membership.project_id}</span>
              }
            />
          ) : null}
          <DetailRow label="Status" value={<StatusBadge status={membership.status} />} />
          <DetailRow
            label="Roles"
            value={<span className="tabular-nums">{membership.role_ids.length}</span>}
          />
          <DetailRow label="Created" value={formatDateTime(membership.created_at)} />
          <DetailRow label="Updated" value={formatDateTime(membership.updated_at)} />
          {membership.tags && membership.tags.length > 0 ? (
            <DetailRow
              label="Tags"
              value={
                <div className="flex flex-wrap justify-end gap-1.5">
                  {membership.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              }
            />
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Assigned roles</CardTitle>
          <CardDescription>
            Permissions granted to this membership.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {membership.role_ids.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No roles assigned to this membership.
            </p>
          ) : (
            <ul className="divide-y">
              {membership.roles?.map((role) => (
                <li
                  key={role.id}
                  className="flex items-center justify-between gap-3 py-2.5"
                >
                  <span className="font-medium">{role.name}</span>
                  <span className="font-mono text-xs text-muted-foreground">
                    {role.id}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function MembershipDetailPage() {
  const params = useParams<{ id: string }>()
  const workspaceId = useActiveWorkspaceId()
  const { data: membership, isLoading, error } = useMembership(
    workspaceId,
    params.id,
  )
  const { data: workspaceRoles } = useRoles(workspaceId ?? undefined)

  // PERMISSION-GATED: Edit requires `membership:update`.
  const canEdit = useCan("membership", "update")

  // Resolve role names from the workspace list when the describe response did
  // not populate `membership.roles`.
  const resolvedRoles = React.useMemo(() => {
    if (membership?.roles?.length) return membership.roles
    if (!membership || !workspaceRoles) return []
    return membership.role_ids
      .map((id) => workspaceRoles.find((r) => r.id === id))
      .filter((r): r is Role => Boolean(r))
  }, [membership, workspaceRoles])

  const membershipWithRoles = membership
    ? { ...membership, roles: resolvedRoles }
    : undefined

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Back to memberships"
            render={<Link href="/memberships" />}
          >
            <ArrowLeftIcon />
          </Button>
          <div>
            <Text variant="h2">Membership details</Text>
            <Text variant="muted">
              {membership?.account?.email ?? "Loading member..."}
            </Text>
          </div>
        </div>
        {membership && canEdit ? (
          <Button
            variant="outline"
            render={<Link href={`/memberships/${membership.id}/edit`} />}
          >
            <PencilIcon />
            Edit
          </Button>
        ) : null}
      </div>

      {isLoading ? (
        <div className="space-y-6">
          <Skeleton className="h-44 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : error ? (
        <Card>
          <CardContent className="py-10 text-center text-sm text-destructive">
            {error.message}
          </CardContent>
        </Card>
      ) : membershipWithRoles ? (
        <MembershipDetail membership={membershipWithRoles} />
      ) : null}
    </div>
  )
}
