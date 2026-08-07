"use client"

import { Suspense, useState } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import {
  useCredential,
  useCredentials,
  useUpdateCredential,
} from "@/hooks/use-credentials"
import { CredentialForm } from "@/components/credentials/credential-form"
import { Text } from "@/components/ui/text"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type { CredentialFormData } from "@/types/credential"

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Request failed"
}

function EditCredential() {
  const params = useParams<{ id: string }>()
  const searchParams = useSearchParams()
  const router = useRouter()
  const id = params.id
  const accountIdFromUrl = searchParams.get("account_id") ?? ""

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
  const { updateCredential, isUpdating, error: updateError } =
    useUpdateCredential()
  const [submitError, setSubmitError] = useState<string | null>(null)

  async function handleSubmit(data: CredentialFormData) {
    if (!credential) return
    setSubmitError(null)
    try {
      await updateCredential({
        accountId: credential.account_id,
        id: credential.id,
        data,
      })
      router.push(
        `/credentials/${credential.id}?account_id=${credential.account_id}`,
      )
    } catch (e) {
      setSubmitError(errorMessage(e))
    }
  }

  if (isLoading || (!resolvedAccountId && listLoading)) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96 w-full" />
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

  const displayError =
    submitError ?? (updateError ? errorMessage(updateError) : null)

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Text variant="h2">Edit credential</Text>
        <Text variant="muted">
          Manage the {credential.kind} credential for account{" "}
          {credential.account_id.slice(0, 8)}…
        </Text>
      </div>

      {displayError && (
        <Alert variant="error">
          <AlertTitle>Failed to update credential</AlertTitle>
          <AlertDescription>{displayError}</AlertDescription>
        </Alert>
      )}

      <CredentialForm
        credential={credential}
        onSubmit={handleSubmit}
        isSubmitting={isUpdating}
      />
    </div>
  )
}

export default function EditCredentialPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-2xl space-y-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-96 w-full" />
        </div>
      }
    >
      <EditCredential />
    </Suspense>
  )
}
