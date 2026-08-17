import type { MembershipMeta } from "./common"
import type { Role } from "./role"

export type Membership = MembershipDescribeRes

export type MembershipScope = "workspace" | "project"
export type MembershipStatus = "invited" | "active" | "suspended"

/** Minimal resolved-policy shape (full Policy domain deferred). */
export interface MembershipPolicy {
  id: string
  name?: string | null
  effect: "allow" | "deny"
  actions: string[]
  resource: string
  constraint?: string | null
}

export interface MembershipDescribeRes {
  id: string
  account_id: string
  profile_id?: string | null
  workspace_id: string
  project_id?: string | null
  scope: MembershipScope
  status: MembershipStatus
  version: number
  roles: Role[]
  policies: MembershipPolicy[]
  tags: string[]
  meta: MembershipMeta
  created_at: string
  updated_at?: string | null
}

export interface MembershipListRes {
  memberships: MembershipDescribeRes[]
  metadata: import("./pagination").ListResponseMeta
}

export interface MembershipDeleteRes {
  id: string
}

export interface MembershipDescribeReq {
  id: string
}

/** Optional persona details applied only when a NEW profile is created. */
export interface MembershipProfileCreateReq {
  name?: string
  description?: string
  display_name?: string
  job_title?: string
  timezone?: string
  avatar_url?: string
  tags?: string[]
  meta?: MembershipMeta
}

export interface MembershipCreateReq {
  account_id?: string
  email: string
  profile?: MembershipProfileCreateReq
  scope: MembershipScope
  status?: MembershipStatus
  project_id?: string
  role_ids: string[]
  policy_ids: string[]
  tags: string[]
  meta: MembershipMeta
}

export interface MembershipUpdateReq {
  id: string
  status?: MembershipStatus
  scope?: MembershipScope
  project_id?: string
  role_ids?: string[]
  policy_ids?: string[]
  tags?: string[]
  meta?: MembershipMeta
}

export interface MembershipListReq {
  filter?: import("./pagination").RequestFilterParams<MembershipFilter>
  options?: import("./pagination").RequestListOptions
}

export interface MembershipDeleteReq {
  id: string
}

export interface MembershipFilter {
  id?: Record<string, string>
  account_id?: Record<string, string>
  profile_id?: Record<string, string>
  workspace_id?: Record<string, string>
  scope?: Record<string, string>
  status?: Record<string, string>
  project_id?: Record<string, string>
}

export interface MembershipListParams {
  profile_id?: string
  scope?: MembershipScope
  status?: MembershipStatus
  project_id?: string
}

export interface MembershipFormData {
  email?: string
  profile?: MembershipProfileCreateReq
  scope: MembershipScope
  project_id?: string
  status?: MembershipStatus
  role_ids: string[]
  tags?: string[]
}

export type MembershipFilters = MembershipListParams
