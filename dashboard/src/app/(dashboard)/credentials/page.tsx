"use client"

import { useState } from "react"
import { useCredentials, useDeleteCredential } from "@/hooks/use-credentials"
import { CredentialTable } from "@/components/credentials/credential-table"
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
import { FingerprintIcon } from "lucide-react"
import type { Credential } from "@/types/credential"

const PAGE_SIZE = 10

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Request failed"
}

export default function CredentialsPage() {
  const [page, setPage] = useState(1)
  const [kind, setKind] = useState("")
  const [provider, setProvider] = useState("")
  const [status, setStatus] = useState("")
  const [accountInput, setAccountInput] = useState("")
  const [account, setAccount] = useState("")
  const [deleteTarget, setDeleteTarget] = useState<Credential | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const { credentials, total, isLoading, error } = useCredentials({
    limit: PAGE_SIZE,
    offset: (page - 1) * PAGE_SIZE,
    order_bys: ["!created_at"],
    fields: {
      ...(kind ? { kind } : {}),
      ...(provider ? { provider } : {}),
      ...(status ? { status } : {}),
      ...(account ? { account_id: account } : {}),
    },
  })

  const { deleteCredential, isDeleting } = useDeleteCredential()

  function resetPage() {
    setPage(1)
  }

  function clearFilters() {
    setKind("")
    setProvider("")
    setStatus("")
    setAccountInput("")
    setAccount("")
    setPage(1)
  }

  async function handleDelete() {
    if (!deleteTarget) return
    setDeleteError(null)
    try {
      await deleteCredential({
        accountId: deleteTarget.account_id,
        id: deleteTarget.id,
      })
      setDeleteTarget(null)
    } catch (e) {
      setDeleteError(errorMessage(e))
    }
  }

  const hasFilters = Boolean(kind || provider || status || account)
  const showEmpty = !isLoading && credentials.length === 0

  return (
    <div className="space-y-6">
      <div>
        <Text variant="h2">Credentials</Text>
        <Text variant="muted">
          Authentication records tied to accounts. Credentials are created by
          the auth flows and managed here.
        </Text>
      </div>

      {error && (
        <Alert variant="error">
          <AlertTitle>Failed to load credentials</AlertTitle>
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
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Kind" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="password">Password</SelectItem>
            <SelectItem value="oauth">OAuth</SelectItem>
            <SelectItem value="sso">SSO</SelectItem>
            <SelectItem value="api_key">API Key</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={provider}
          onValueChange={(v) => {
            setProvider(v ?? "")
            resetPage()
          }}
        >
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Provider" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="local">Local</SelectItem>
            <SelectItem value="google">Google</SelectItem>
            <SelectItem value="github">GitHub</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={status}
          onValueChange={(v) => {
            setStatus(v ?? "")
            resetPage()
          }}
        >
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="revoked">Revoked</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
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

        {hasFilters && (
          <Button type="button" variant="ghost" onClick={clearFilters}>
            Clear
          </Button>
        )}
      </div>

      {showEmpty && !hasFilters ? (
        <Card className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <FingerprintIcon className="size-10 text-muted-foreground/40" />
          <div>
            <p className="font-medium">No credentials</p>
            <p className="text-sm text-muted-foreground">
              Credentials are created automatically during registration and
              OAuth flows.
            </p>
          </div>
        </Card>
      ) : showEmpty && hasFilters ? (
        <div className="rounded-lg border border-dashed py-12 text-center">
          <p className="text-sm text-muted-foreground">
            No credentials match your filters.
          </p>
          <Button variant="outline" className="mt-3" onClick={clearFilters}>
            Clear filters
          </Button>
        </div>
      ) : (
        <CredentialTable
          credentials={credentials}
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
        title="Delete credential"
        description="Are you sure you want to delete this credential? This action cannot be undone."
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
