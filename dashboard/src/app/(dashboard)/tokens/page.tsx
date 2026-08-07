"use client"

import { useState } from "react"
import { useTokens, useDeleteToken } from "@/hooks/use-tokens"
import { TokenTable } from "@/components/tokens/token-table"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Text } from "@/components/ui/text"
import { Card } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { isNetworkError } from "@/lib/api"
import { TicketIcon } from "lucide-react"
import type { BlacklistedToken } from "@/types/token"

const PAGE_SIZE = 10

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Request failed"
}

export default function TokensPage() {
  const [page, setPage] = useState(1)
  const [kind, setKind] = useState("")
  const [accountInput, setAccountInput] = useState("")
  const [account, setAccount] = useState("")
  const [reasonInput, setReasonInput] = useState("")
  const [reason, setReason] = useState("")
  const [deleteTarget, setDeleteTarget] = useState<BlacklistedToken | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const { tokens, total, isLoading, error } = useTokens({
    limit: PAGE_SIZE,
    offset: (page - 1) * PAGE_SIZE,
    order_bys: ["!created_at"],
    fields: {
      ...(kind ? { kind } : {}),
      ...(account ? { account_id: account } : {}),
      ...(reason ? { reason } : {}),
    },
  })

  const { deleteToken, isDeleting } = useDeleteToken()

  function resetPage() {
    setPage(1)
  }

  function clearFilters() {
    setKind("")
    setAccountInput("")
    setAccount("")
    setReasonInput("")
    setReason("")
    setPage(1)
  }

  async function handleDelete() {
    if (!deleteTarget) return
    setDeleteError(null)
    try {
      await deleteToken(deleteTarget.id)
      setDeleteTarget(null)
    } catch (e) {
      setDeleteError(errorMessage(e))
    }
  }

  const hasFilters = Boolean(kind || account || reason)
  const showEmpty = !isLoading && tokens.length === 0

  return (
    <div className="space-y-6">
      <div>
        <Text variant="h2">Tokens</Text>
        <Text variant="muted">
          Revoked JWT audit entries. Blacklisted tokens are removed by
          deleting them (un-revoking).
        </Text>
      </div>

      {error && (
        <Alert variant="error">
          <AlertTitle>Failed to load tokens</AlertTitle>
          <AlertDescription>
            {isNetworkError(error)
              ? "Unable to connect to the OxideAuth API. Please check your connection and try again."
              : errorMessage(error)}
          </AlertDescription>
        </Alert>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <Select
          value={kind}
          onValueChange={(v) => {
            setKind(v ?? "")
            resetPage()
          }}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Kind" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="auth">Auth</SelectItem>
            <SelectItem value="password_reset">Password Reset</SelectItem>
          </SelectContent>
        </Select>

        <form
          className="flex items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault()
            setAccount(accountInput.trim())
            resetPage()
          }}
        >
          <Input
            placeholder="Account ID..."
            value={accountInput}
            onChange={(e) => setAccountInput(e.target.value)}
            className="w-56"
          />
          <Button type="submit" variant="outline">
            Filter
          </Button>
        </form>

        <form
          className="flex items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault()
            setReason(reasonInput.trim())
            resetPage()
          }}
        >
          <Input
            placeholder="Reason..."
            value={reasonInput}
            onChange={(e) => setReasonInput(e.target.value)}
            className="w-56"
          />
          <Button type="submit" variant="outline">
            Filter
          </Button>
        </form>

        {hasFilters && (
          <Button type="button" variant="ghost" onClick={clearFilters}>
            Clear
          </Button>
        )}
      </div>

      {showEmpty && !hasFilters ? (
        <Card className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <TicketIcon className="size-10 text-muted-foreground/40" />
          <div>
            <p className="font-medium">No blacklisted tokens</p>
            <p className="text-sm text-muted-foreground">
              Tokens are blacklisted automatically when they are revoked.
            </p>
          </div>
        </Card>
      ) : showEmpty && hasFilters ? (
        <div className="rounded-lg border border-dashed py-12 text-center">
          <p className="text-sm text-muted-foreground">
            No tokens match your filters.
          </p>
          <Button variant="outline" className="mt-3" onClick={clearFilters}>
            Clear filters
          </Button>
        </div>
      ) : (
        <TokenTable
          tokens={tokens}
          isLoading={isLoading}
          total={total}
          page={page}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
          onDelete={setDeleteTarget}
        />
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete token"
        description="Removing this entry un-revokes the token, allowing it to be used again. Are you sure?"
        confirmLabel="Delete"
        isConfirming={isDeleting}
        error={deleteError}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteTarget(null)
            setDeleteError(null)
          }
        }}
        onConfirm={handleDelete}
      />
    </div>
  )
}
