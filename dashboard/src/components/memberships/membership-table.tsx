"use client"

import * as React from "react"
import Link from "next/link"
import { useDeleteMembership } from "@/hooks/use-memberships"
import { useProfiles } from "@/hooks/use-profiles"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { formatDateTime } from "@/lib/format"
import { EyeIcon, PencilIcon, Trash2Icon } from "lucide-react"
import type { Membership, MembershipStatus } from "@/types/membership"
import type { Profile } from "@/types/profile"

const statusClasses: Record<MembershipStatus, string> = {
  invited: "bg-primary/10 text-primary",
  active: "bg-profit/10 text-profit",
  suspended: "bg-destructive/10 text-destructive",
}

export function StatusBadge({ status }: { status: MembershipStatus }) {
  return (
    <Badge className={cn("border-transparent capitalize", statusClasses[status])}>
      {status}
    </Badge>
  )
}

interface MembershipTableProps {
  memberships: Membership[]
  isLoading?: boolean
  error?: Error | null
}

export function MembershipTable({
  memberships,
  isLoading = false,
  error = null,
}: MembershipTableProps) {
  const deleteMembership = useDeleteMembership()
  const [deleteTarget, setDeleteTarget] = React.useState<Membership | null>(null)

  // Resolve each membership's profile (by `profile_id`) for the member column.
  const { data: profiles } = useProfiles()
  const profileMap = React.useMemo(() => {
    const map = new Map<string, Profile>()
    for (const p of profiles ?? []) map.set(p.id, p)
    return map
  }, [profiles])

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>Scope</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Roles</TableHead>
              <TableHead>Policies</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={7}>
                    <Skeleton className="h-6 w-full" />
                  </TableCell>
                </TableRow>
              ))
            ) : error ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-10 text-center text-sm text-destructive"
                >
                  {error.message}
                </TableCell>
              </TableRow>
            ) : memberships.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-10 text-center text-sm text-muted-foreground"
                >
                  No memberships yet. Invite someone to get started.
                </TableCell>
              </TableRow>
            ) : (
              memberships.map((membership) => {
                const profile = membership.profile_id
                  ? profileMap.get(membership.profile_id)
                  : undefined
                return (
                  <TableRow key={membership.id}>
                    <TableCell>
                      <div className="flex min-w-0 flex-col">
                        <span className="font-medium">
                          {profile?.name ?? "Unknown member"}
                        </span>
                        {profile?.email ? (
                          <span className="truncate text-xs text-muted-foreground">
                            {profile.email}
                          </span>
                        ) : null}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {membership.scope}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={membership.status} />
                    </TableCell>
                    <TableCell className="tabular-nums">
                      {membership.roles.length}
                    </TableCell>
                    <TableCell className="tabular-nums">
                      {membership.policies?.length ?? 0}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {formatDateTime(membership.created_at)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`View ${profile?.name ?? "membership"}`}
                          render={<Link href={`/memberships/${membership.id}`} />}
                        >
                          <EyeIcon />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Edit ${profile?.name ?? "membership"}`}
                          render={
                            <Link href={`/memberships/${membership.id}/edit`} />
                          }
                        >
                          <PencilIcon />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Delete membership"
                          className="text-muted-foreground hover:text-destructive"
                          onClick={() => setDeleteTarget(membership)}
                        >
                          <Trash2Icon />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </CardContent>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete membership"
        description={
          deleteTarget
            ? "Remove this member from the workspace. This action cannot be undone."
            : undefined
        }
        isConfirming={deleteMembership.isMutating}
        onOpenChange={(next) => {
          if (!next) setDeleteTarget(null)
        }}
        onConfirm={async () => {
          if (!deleteTarget) return
          await deleteMembership.trigger(deleteTarget.id)
          setDeleteTarget(null)
        }}
      />
    </Card>
  )
}
