"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useToken, useDeleteToken } from "@/hooks/use-tokens"
import { useCan } from "@/hooks/use-permissions-check"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { DetailRow } from "@/components/detail-row"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  ArrowLeftIcon,
  Trash2Icon,
  TicketIcon,
} from "lucide-react"
import { formatDateTime } from "@/lib/format"
import type { TokenKind } from "@/types/token"

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Request failed"
}

const kindVariant: Record<TokenKind, "default" | "outline"> = {
  auth: "default",
  password_reset: "outline",
}

export default function TokenDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const id = params.id
  const { token, isLoading, error } = useToken(id)
  const { deleteToken, isDeleting } = useDeleteToken()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)

  // PERMISSION-GATED: Delete requires `token:delete`.
  const canDelete = useCan("token", "delete")

  async function handleDelete() {
    if (!token) return
    setActionError(null)
    try {
      await deleteToken(token.id)
      router.push("/tokens")
    } catch (e) {
      setActionError(errorMessage(e))
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-28" />
          <Skeleton className="ml-auto h-8 w-28" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (error || !token) {
    return (
      <Alert variant="error">
        <AlertTitle>Failed to load token</AlertTitle>
        <AlertDescription>
          {error ? errorMessage(error) : "Token not found."}
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground"
          onClick={() => router.push("/tokens")}
        >
          <ArrowLeftIcon />
          Back to tokens
        </Button>
        {canDelete && (
          <Button variant="destructive" onClick={() => setConfirmOpen(true)}>
            <Trash2Icon />
            Delete
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
              <TicketIcon className="size-5" />
            </div>
            <div>
              <CardTitle className="text-xl">
                <Badge variant={kindVariant[token.kind]}>{token.kind}</Badge>
              </CardTitle>
              <CardDescription>Blacklisted token entry</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <DetailRow label="ID" value={token.id} mono />
            <DetailRow label="Workspace ID" value={token.workspace_id} mono />
            <DetailRow label="Kind" value={token.kind} />
            <DetailRow label="Account ID" value={token.account_id} mono />
            <DetailRow label="Reason" value={token.reason} />
            <DetailRow
              label="Expires At"
              value={
                token.expires_at ? formatDateTime(token.expires_at) : undefined
              }
            />
            <DetailRow
              label="Tags"
              value={
                token.tags && token.tags.length > 0 ? (
                  <span className="flex flex-wrap justify-end gap-1">
                    {token.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </span>
                ) : undefined
              }
            />
            <DetailRow
              label="Created"
              value={formatDateTime(token.created_at)}
            />
            <DetailRow
              label="Updated"
              value={formatDateTime(token.updated_at)}
            />
          </div>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete token"
        description="Removing this entry un-revokes the token, allowing it to be used again. Are you sure?"
        confirmLabel="Delete"
        isConfirming={isDeleting}
        error={actionError}
        onOpenChange={(open) => {
          if (!open) {
            setConfirmOpen(false)
            setActionError(null)
          }
        }}
        onConfirm={handleDelete}
      />
    </div>
  )
}
