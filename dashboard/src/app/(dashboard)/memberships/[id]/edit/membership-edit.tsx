"use client"

import * as React from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useActiveWorkspaceId } from "@/hooks/use-active-workspace"
import { useMembership } from "@/hooks/use-memberships"
import { MembershipForm } from "@/components/memberships/membership-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Text } from "@/components/ui/text"
import { ArrowLeftIcon } from "lucide-react"

export default function EditMembershipPage() {
  const params = useParams<{ id: string }>()
  const workspaceId = useActiveWorkspaceId()
  const { data: membership, isLoading, error } = useMembership(
    workspaceId,
    params.id,
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Back to membership"
          render={<Link href={`/memberships/${params.id}`} />}
        >
          <ArrowLeftIcon />
        </Button>
        <div>
          <Text variant="h2">Edit membership</Text>
          <Text variant="muted">
            {"Update the member's scope, status, and assigned roles."}
          </Text>
        </div>
      </div>

      {isLoading ? (
        <Skeleton className="h-96 w-full" />
      ) : error ? (
        <Card>
          <CardContent className="py-10 text-center text-sm text-destructive">
            {error.message}
          </CardContent>
        </Card>
      ) : membership && workspaceId ? (
        <MembershipForm workspaceId={workspaceId} membership={membership} />
      ) : null}
    </div>
  )
}
