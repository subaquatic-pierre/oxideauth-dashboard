import type { CredentialMeta } from "./common"

export type Credential = CredentialDescribeRes

export type CredentialKind = "password" | "oauth" | "sso" | "api_key"
export type CredentialProvider = "local" | "google" | "github"
export type CredentialStatus = "active" | "revoked" | "pending"

export interface CredentialDescribeRes {
  id: string
  account_id: string
  workspace_id: string
  kind: CredentialKind
  provider: CredentialProvider
  status: CredentialStatus
  provider_id?: string | null
  email?: string | null
  last_used_at?: string | null
  tags: string[]
  meta: CredentialMeta
  created_at: string
  updated_at?: string | null
}

export interface CredentialListRes {
  credentials: CredentialDescribeRes[]
  metadata: import("./pagination").ListResponseMeta
}

export interface CredentialDeleteRes {
  id: string
}

export interface CredentialDescribeReq {
  id: string
  account_id: string
  provider_id?: string
  email?: string
}

export interface CredentialUpdateReq {
  id: string
  provider_id?: string
  email?: string
  account_id: string
  kind?: CredentialKind
  provider?: CredentialProvider
  status?: CredentialStatus
  new_provider_id?: string
  new_email?: string
  secret?: string
  last_used_at?: string
  tags?: string[]
  meta?: CredentialMeta
}

export interface CredentialListReq {
  filter?: import("./pagination").RequestFilterParams<CredentialFilter>
  options?: import("./pagination").RequestListOptions
}

export interface CredentialDeleteReq {
  id: string
  account_id: string
  provider_id?: string
  email?: string
}

export interface CredentialFilter {
  id?: Record<string, string>
  account_id?: Record<string, string>
  workspace_id?: Record<string, string>
  kind?: Record<string, string>
  provider?: Record<string, string>
  status?: Record<string, string>
  provider_id?: Record<string, string>
  email?: Record<string, string>
}

export interface CredentialFormData {
  status?: CredentialStatus
  kind?: CredentialKind
  provider?: CredentialProvider
  provider_id?: string
  email?: string
  tags?: string[]
  meta?: CredentialMeta
}
