"use client"

import * as React from "react"
import Link from "next/link"
import { useActiveWorkspaceId } from "@/hooks/use-active-workspace"
import { MembershipForm } from "@/components/memberships/membership-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Text } from "@/components/ui/text"
import { ArrowLeftIcon, Building2Icon } from "lucide-react"

export default function NewMembershipPage() {
  const workspaceId = useActiveWorkspaceId()

  return (
    <div className="space-y-6">
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
          <Text variant="h2">New membership</Text>
          <Text variant="muted">Add an account to this workspace.</Text>
        </div>
      </div>

      {!workspaceId ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
            <Building2Icon className="size-6 text-muted-foreground" />
            <p className="font-medium">No workspace selected</p>
            <p className="text-sm text-muted-foreground">
              Pick a workspace from the selector in the header before creating a
              membership.
            </p>
          </CardContent>
        </Card>
      ) : (
        <MembershipForm workspaceId={workspaceId} />
      )}
    </div>
  )
}
