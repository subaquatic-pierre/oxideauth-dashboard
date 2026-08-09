"use client"

import * as React from "react"
import Link from "next/link"
import { useDeleteMembership } from "@/hooks/use-memberships"
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
  workspaceId: string
  memberships: Membership[]
  isLoading?: boolean
  error?: Error | null
}

export function MembershipTable({
  workspaceId,
  memberships,
  isLoading = false,
  error = null,
}: MembershipTableProps) {
  const deleteMembership = useDeleteMembership()
  const [deleteTarget, setDeleteTarget] = React.useState<Membership | null>(null)

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Account</TableHead>
              <TableHead>Scope</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Roles</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={6}>
                    <Skeleton className="h-6 w-full" />
                  </TableCell>
                </TableRow>
              ))
            ) : error ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-10 text-center text-sm text-destructive"
                >
                  {error.message}
                </TableCell>
              </TableRow>
            ) : memberships.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-10 text-center text-sm text-muted-foreground"
                >
                  No memberships yet. Invite someone to get started.
                </TableCell>
              </TableRow>
            ) : (
              memberships.map((membership) => (
                <TableRow key={membership.id}>
                  <TableCell>
                    <div className="flex min-w-0 flex-col">
                      <span className="font-medium">
                        {membership.account_id}
                      </span>
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
                  <TableCell className="text-xs text-muted-foreground">
                    {formatDateTime(membership.created_at)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`View ${membership.account_id ?? "membership"}`}
                        render={<Link href={`/memberships/${membership.id}`} />}
                      >
                        <EyeIcon />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Edit ${membership.account_id ?? "membership"}`}
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
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete membership"
        description={
          deleteTarget
            ? `Remove ${deleteTarget.account_id} from this workspace. This action cannot be undone.`
            : undefined
        }
        isConfirming={deleteMembership.isMutating}
        onOpenChange={(next) => {
          if (!next) setDeleteTarget(null)
        }}
        onConfirm={async () => {
          if (!deleteTarget) return
          await deleteMembership.trigger({
            workspaceId,
            id: deleteTarget.id,
          })
          setDeleteTarget(null)
        }}
      />
    </Card>
  )
}
