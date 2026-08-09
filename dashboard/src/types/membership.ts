import type { MembershipMeta } from "./common"
import type { Role } from "./role"

export type Membership = MembershipDescribeRes

export type MembershipScope = "workspace" | "project"
export type MembershipStatus = "invited" | "active" | "suspended"

export interface MembershipDescribeRes {
  id: string
  account_id: string
  workspace_id: string
  project_id?: string | null
  scope: MembershipScope
  status: MembershipStatus
  roles: Role[]
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
  workspace_id: string
}

export interface MembershipCreateReq {
  account_id: string
  workspace_id: string
  scope: MembershipScope
  status: MembershipStatus
  project_id?: string
  role_ids: string[]
  tags: string[]
  meta: MembershipMeta
}

export interface MembershipUpdateReq {
  id: string
  workspace_id: string
  status?: MembershipStatus
  scope?: MembershipScope
  project_id?: string
  tags?: string[]
  meta?: MembershipMeta
}

export interface MembershipListReq {
  workspace_id: string
  filter?: import("./pagination").RequestFilterParams<MembershipFilter>
  options?: import("./pagination").RequestListOptions
}

export interface MembershipDeleteReq {
  id: string
  workspace_id: string
}

export interface MembershipFilter {
  id?: Record<string, string>
  account_id?: Record<string, string>
  workspace_id?: Record<string, string>
  scope?: Record<string, string>
  status?: Record<string, string>
  project_id?: Record<string, string>
}

export interface MembershipListParams {
  account_id?: string
  scope?: MembershipScope
  status?: MembershipStatus
  project_id?: string
}

export interface MembershipFormData {
  account_id: string
  scope: MembershipScope
  project_id?: string
  status?: MembershipStatus
  role_ids: string[]
  tags?: string[]
}

export type MembershipFilters = MembershipListParams
