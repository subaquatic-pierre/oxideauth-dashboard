"use client"

import * as React from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useMembership } from "@/hooks/use-memberships"
import { useProfile } from "@/hooks/use-profiles"
import { useRoles } from "@/hooks/use-roles"
import { useCan } from "@/hooks/use-permissions-check"
import { StatusBadge } from "@/components/memberships/membership-table"
import { DetailRow } from "@/components/detail-row"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
import type { MembershipDescribeRes } from "@/types/membership"
import type { Profile } from "@/types/profile"
import type { Role, RoleDescribeRes } from "@/types/role"

function getInitials(name?: string): string {
  if (!name) return "?"
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "?"
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}

function MembershipDetail({
  membership,
  profile,
}: {
  membership: MembershipDescribeRes
  profile?: Profile
}) {
  const displayName = profile?.name ?? "Unknown member"
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Member</CardTitle>
          <CardDescription>The linked workspace profile.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3 rounded-lg bg-muted/50 px-4 py-3">
            <Avatar size="lg">
              <AvatarFallback className="text-sm font-medium">
                {getInitials(profile?.name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate font-medium">{displayName}</p>
              {profile?.email ? (
                <p className="truncate text-sm text-muted-foreground">
                  {profile.email}
                </p>
              ) : null}
            </div>
          </div>
          <DetailRow
            label="Profile ID"
            value={
              membership.profile_id ? (
                <span className="font-mono text-xs">{membership.profile_id}</span>
              ) : (
                "—"
              )
            }
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
            value={<span className="tabular-nums">{membership.roles.length}</span>}
          />
          <DetailRow label="Created" value={formatDateTime(membership.created_at)} />
          <DetailRow
            label="Updated"
            value={
              membership.updated_at ? formatDateTime(membership.updated_at) : "—"
            }
          />
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
          <CardDescription>Permissions granted to this membership.</CardDescription>
        </CardHeader>
        <CardContent>
          {membership.roles.length === 0 ? (
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

      <Card>
        <CardHeader>
          <CardTitle>Policies</CardTitle>
          <CardDescription>Resolved policies attached to this membership.</CardDescription>
        </CardHeader>
        <CardContent>
          {!membership.policies || membership.policies.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No policies attached to this membership.
            </p>
          ) : (
            <ul className="divide-y">
              {membership.policies.map((policy) => (
                <li
                  key={policy.id}
                  className="flex items-center justify-between gap-3 py-2.5"
                >
                  <div className="min-w-0">
                    <p className="font-medium">{policy.name ?? policy.id}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {policy.effect} · {policy.actions.join(", ")} · {policy.resource}
                    </p>
                  </div>
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
  const { data: membership, isLoading, error } = useMembership(params.id)
  const { data: workspaceRoles } = useRoles()
  const { data: profile } = useProfile(membership?.profile_id)

  // PERMISSION-GATED: Edit requires `membership:update`.
  const canEdit = useCan("membership", "update")

  // Resolve role names from the workspace list when the describe response did
  // not populate `membership.roles`.
  const resolvedRoles = React.useMemo(() => {
    if (membership?.roles?.length) return membership.roles
    if (!membership || !workspaceRoles) return []
    return membership.roles
      .map((r) => workspaceRoles.find((wr: RoleDescribeRes) => wr.id === r.id))
      .filter((r): r is RoleDescribeRes => Boolean(r))
  }, [membership, workspaceRoles])

  const membershipWithRoles: MembershipDescribeRes | undefined = membership
    ? { ...membership, roles: resolvedRoles as unknown as Role[] }
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
              {profile?.name ?? "Loading member..."}
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
        <MembershipDetail membership={membershipWithRoles} profile={profile} />
      ) : null}
    </div>
  )
}
