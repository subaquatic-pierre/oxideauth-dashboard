export type MembershipScope = "workspace" | "project"
export type MembershipStatus = "invited" | "active" | "suspended"

export interface Membership {
  id: string
  account_id: string
  workspace_id: string
  scope: MembershipScope
  project_id?: string
  status: MembershipStatus
  role_ids: string[]
  tags?: string[]
  meta?: Record<string, unknown>
  created_at: string
  updated_at: string
  // Populated on describe:
  account?: { id: string; email: string; name: string }
  roles?: { id: string; name: string }[]
}

export interface MembershipFormData {
  account_id: string
  scope: MembershipScope
  project_id?: string
  status?: MembershipStatus
  role_ids: string[]
  tags?: string[]
}

// Filters accepted by the memberships list endpoint.
export interface MembershipFilters {
  account_id?: string
  scope?: MembershipScope
  status?: MembershipStatus
  project_id?: string
}
