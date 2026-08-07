export type CredentialKind = "password" | "oauth" | "sso" | "api_key"
export type CredentialProvider = "local" | "google" | "github"
export type CredentialStatus = "active" | "revoked" | "pending"

export interface Credential {
  id: string
  account_id: string
  workspace_id: string
  kind: CredentialKind
  provider: CredentialProvider
  status: CredentialStatus
  provider_id?: string
  email?: string
  last_used_at?: string
  tags?: string[]
  meta?: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface CredentialFormData {
  status?: CredentialStatus
  kind?: CredentialKind
  provider?: CredentialProvider
  provider_id?: string
  email?: string
  tags?: string[]
  meta?: Record<string, unknown>
}
