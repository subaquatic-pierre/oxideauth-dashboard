"use client"

import { Suspense, useState } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import {
  useCredential,
  useCredentials,
  useDeleteCredential,
} from "@/hooks/use-credentials"
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
  PencilIcon,
  Trash2Icon,
  FingerprintIcon,
} from "lucide-react"
import { formatDateTime } from "@/lib/format"
import { errorMessage } from "@/lib/errors"
import type { CredentialStatus } from "@/types/credential"

const statusBadgeClass: Record<CredentialStatus, string> = {
  active: "bg-green-500/10 text-green-700 dark:text-green-400",
  revoked: "bg-red-500/10 text-red-700 dark:text-red-400",
  pending: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
}

function CredentialDetail() {
  const params = useParams<{ id: string }>()
  const searchParams = useSearchParams()
  const router = useRouter()
  const id = params.id
  const accountIdFromUrl = searchParams.get("account_id") ?? ""

  // The describe endpoint requires the owning account_id. Prefer the URL
  // param (set by the list rows); otherwise resolve it from the list.
  const { credentials, isLoading: listLoading } = useCredentials(
    accountIdFromUrl ? null : { limit: 100, order_bys: ["!created_at"] },
  )
  const resolvedAccountId =
    accountIdFromUrl ||
    credentials.find((c) => c.id === id)?.account_id ||
    ""

  const { credential, isLoading, error } = useCredential(
    resolvedAccountId,
    id,
  )
  const { deleteCredential, isDeleting } = useDeleteCredential()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)

  // PERMISSION-GATED: Edit requires `credential:update`, Delete requires `credential:delete`.
  const canEdit = useCan("credential", "update")
  const canDelete = useCan("credential", "delete")

  async function handleDelete() {
    if (!credential) return
    setActionError(null)
    try {
      await deleteCredential({
        accountId: credential.account_id,
        id: credential.id,
      })
      router.push("/credentials")
    } catch (e) {
      setActionError(errorMessage(e))
    }
  }

  if (isLoading || (!resolvedAccountId && listLoading)) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-28" />
          <Skeleton className="ml-auto h-8 w-40" />
        </div>
        <Skeleton className="h-72 w-full" />
      </div>
    )
  }

  if (error || !credential) {
    return (
      <Alert variant="error">
        <AlertTitle>Failed to load credential</AlertTitle>
        <AlertDescription>
          {error ? errorMessage(error) : "Credential not found."}
        </AlertDescription>
      </Alert>
    )
  }

  const editPath = `/credentials/${credential.id}/edit?account_id=${credential.account_id}`

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground"
          onClick={() => router.push("/credentials")}
        >
          <ArrowLeftIcon />
          Back to credentials
        </Button>
        <div className="flex items-center gap-2">
          {canEdit && (
            <Button variant="outline" render={<Link href={editPath} />}>
              <PencilIcon />
              Edit
            </Button>
          )}
          {canDelete && (
            <Button variant="destructive" onClick={() => setConfirmOpen(true)}>
              <Trash2Icon />
              Delete
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
              <FingerprintIcon className="size-5" />
            </div>
            <div>
              <CardTitle className="text-xl">
                {credential.kind} credential
              </CardTitle>
              <CardDescription>
                Account {credential.account_id.slice(0, 8)}…
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <DetailRow label="ID" value={credential.id} mono />
            <DetailRow label="Account ID" value={credential.account_id} mono />
            <DetailRow label="Workspace ID" value={credential.workspace_id} mono />
            <DetailRow label="Kind" value={credential.kind} />
            <DetailRow label="Provider" value={credential.provider} />
            <DetailRow
              label="Status"
              value={
                <Badge className={statusBadgeClass[credential.status]}>
                  {credential.status}
                </Badge>
              }
            />
            <DetailRow
              label="Provider ID"
              value={credential.provider_id}
              mono
            />
            <DetailRow label="Email" value={credential.email} />
            <DetailRow
              label="Secret"
              value="••••••••••••"
              mono
            />
            <DetailRow
              label="Last Used"
              value={
                credential.last_used_at
                  ? formatDateTime(credential.last_used_at)
                  : undefined
              }
            />
            <DetailRow
              label="Tags"
              value={
                credential.tags && credential.tags.length > 0 ? (
                  <span className="flex flex-wrap justify-end gap-1">
                    {credential.tags.map((tag) => (
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
              value={formatDateTime(credential.created_at)}
            />
            <DetailRow
              label="Updated"
              value=                {credential.updated_at ? formatDateTime(credential.updated_at) : "—"}
            />
          </div>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete credential"
        description="Are you sure you want to delete this credential? This action cannot be undone."
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

export default function CredentialDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <Skeleton className="h-8 w-28" />
          <Skeleton className="h-72 w-full" />
        </div>
      }
    >
      <CredentialDetail />
    </Suspense>
  )
}
