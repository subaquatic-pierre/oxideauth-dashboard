"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { TagInput } from "@/components/tag-input"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type {
  Credential,
  CredentialFormData,
  CredentialKind,
  CredentialProvider,
  CredentialStatus,
} from "@/types/credential"

const statusOptions: { value: CredentialStatus; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "revoked", label: "Revoked" },
  { value: "pending", label: "Pending" },
]

const kindOptions: { value: CredentialKind; label: string }[] = [
  { value: "password", label: "Password" },
  { value: "oauth", label: "OAuth" },
  { value: "sso", label: "SSO" },
  { value: "api_key", label: "API Key" },
]

const providerOptions: { value: CredentialProvider; label: string }[] = [
  { value: "local", label: "Local" },
  { value: "google", label: "Google" },
  { value: "github", label: "GitHub" },
]

interface CredentialFormProps {
  credential: Credential
  onSubmit: (data: CredentialFormData) => Promise<void>
  isSubmitting?: boolean
}

/**
 * Credential edit form (edit mode only — there is no create flow).
 * Supports status, kind, provider, provider_id, email and tags.
 */
export function CredentialForm({
  credential,
  onSubmit,
  isSubmitting = false,
}: CredentialFormProps) {
  const router = useRouter()
  const [status, setStatus] = useState<CredentialStatus | undefined>(
    credential?.status,
  )
  const [kind, setKind] = useState<CredentialKind | undefined>(credential?.kind)
  const [provider, setProvider] = useState<CredentialProvider | undefined>(
    credential?.provider,
  )
  const [providerId, setProviderId] = useState(credential?.provider_id ?? "")
  const [email, setEmail] = useState(credential?.email ?? "")
  const [tags, setTags] = useState<string[]>(credential?.tags ?? [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await onSubmit({
      status,
      kind,
      provider,
      provider_id: providerId.trim() || undefined,
      email: email.trim() || undefined,
      tags: tags.length > 0 ? tags : undefined,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit credential</CardTitle>
        <CardDescription>
          Update credential properties such as lifecycle status and metadata.
          Secrets cannot be read; they are managed by the auth flows.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={status ?? ""}
                onValueChange={(v) =>
                  setStatus((v as CredentialStatus) || undefined)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="kind">Kind</Label>
              <Select
                value={kind ?? ""}
                onValueChange={(v) =>
                  setKind((v as CredentialKind) || undefined)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select kind" />
                </SelectTrigger>
                <SelectContent>
                  {kindOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="provider">Provider</Label>
              <Select
                value={provider ?? ""}
                onValueChange={(v) =>
                  setProvider((v as CredentialProvider) || undefined)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  {providerOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="provider_id">Provider ID</Label>
              <Input
                id="provider_id"
                placeholder="External provider identifier"
                value={providerId}
                onChange={(e) => setProviderId(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <TagInput value={tags} onChange={setTags} />
          </div>
        </CardContent>
        <CardFooter className="justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(`/credentials/${credential.id}`)}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save changes"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
