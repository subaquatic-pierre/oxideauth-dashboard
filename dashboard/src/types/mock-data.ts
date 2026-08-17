export interface MockWorkspace {
  id: string
  name: string
  slug: string
  description: string
  tags: string[]
  created_at: string
  updated_at?: string | null
}

export interface MockAccount {
  id: string
  email: string
  name: string
  verified: boolean
  enabled: boolean
  description: string
  avatar_url: string
  tags: string[]
  created_at: string
  updated_at?: string | null
}

export interface MockProject {
  id: string
  workspace_id: string
  name: string
  code: string
  description: string
  config: Record<string, unknown>
  tags: string[]
  created_at: string
  updated_at?: string | null
}

export interface MockRole {
  id: string
  workspace_id: string
  name: string
  description: string
  permissions: string[]
  created_at: string
  updated_at?: string | null
}

export interface MockProfile {
  id: string
  workspace_id: string
  email: string
  name: string
  description?: string | null
  display_name?: string | null
  job_title?: string | null
  timezone?: string | null
  avatar_url?: string | null
  tags: string[]
  created_at: string
  updated_at?: string | null
}

export interface MockPermission {
  id: string
  workspace_id: string
  name: string
  code: string
  description: string
  created_at: string
  updated_at?: string | null
}

export type MembershipScope = "workspace" | "project"

export type MembershipStatus = "invited" | "active" | "suspended"

export interface MockMembership {
  id: string
  workspace_id: string
  account_id: string
  profile_id: string | null
  scope: MembershipScope
  project_id: string | null
  status: MembershipStatus
  roles: string[]
  policies: unknown[]
  created_at: string
  updated_at?: string | null
}

export type CredentialKind = "password" | "oauth" | "sso" | "api_key"

export interface MockCredential {
  id: string
  workspace_id: string
  account_id: string
  kind: CredentialKind
  provider: string
  status: string
  email: string
  last_used_at: string
  created_at: string
  updated_at?: string | null
}
