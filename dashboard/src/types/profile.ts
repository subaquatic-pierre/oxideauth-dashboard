import type { ProfileMeta } from "./common"
import type {
  ListResponseMeta,
  RequestFilterParams,
  RequestListOptions,
} from "./pagination"

export type Profile = ProfileDescribeRes

/**
 * Workspace-facing profile (the "dashboard user"). Note: this surface must
 * never include `account_id` — the account identity stays opaque to workspaces.
 */
export interface ProfileDescribeRes {
  id: string
  workspace_id: string
  email: string
  name: string
  description?: string | null
  display_name?: string | null
  job_title?: string | null
  timezone?: string | null
  avatar_url?: string | null
  version: number
  tags: string[]
  meta: ProfileMeta
  created_at: string
  updated_at?: string | null
}

export interface ProfileListRes {
  profiles: ProfileDescribeRes[]
  metadata: ListResponseMeta
}

export interface ProfileDeleteRes {
  id: string
}

export interface ProfileDescribeReq {
  id?: string
  email?: string
}

export interface ProfileUpdateReq {
  id: string
  email?: string
  name?: string
  description?: string
  display_name?: string
  job_title?: string
  timezone?: string
  avatar_url?: string
  tags?: string[]
  meta?: ProfileMeta
}

export interface ProfileListReq {
  filter?: RequestFilterParams<ProfileFilter>
  options?: RequestListOptions
}

export interface ProfileDeleteReq {
  id: string
}

export interface ProfileFilter {
  id?: Record<string, string>
  email?: Record<string, string>
  name?: Record<string, string>
  workspace_id?: Record<string, string>
}

/** Fields accepted by the profile list filters on the list page. */
export interface ProfileListParams {
  email?: string
  name?: string
}

/** Edit-form payload (patch semantics — only supplied fields change). */
export interface ProfileFormData {
  email?: string
  name?: string
  description?: string
  display_name?: string
  job_title?: string
  timezone?: string
  avatar_url?: string
  tags?: string[]
  meta?: ProfileMeta
}
