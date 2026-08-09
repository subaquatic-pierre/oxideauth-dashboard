import type { PermissionMeta } from "./common"
import type { Workspace } from "./workspace"

export type PermissionResponse = PermissionDescribeRes

export interface PermissionDescribeRes {
  id: string
  name: string
  code?: string | null
  description?: string | null
  tags: string[]
  meta: PermissionMeta
  created_at: string
  updated_at?: string | null
}

export interface Permission {
  id: string
  workspace: Workspace
  name: string
  code?: string | null
  description?: string | null
  tags: string[]
  meta: PermissionMeta
  created_by: string
  created_at: string
  updated_by?: string | null
  updated_at?: string | null
}

export interface PermissionListRes {
  permissions: PermissionDescribeRes[]
  metadata: import("./pagination").ListResponseMeta
}

export interface PermissionDeleteRes {
  id: string
}

export interface PermissionDescribeReq {
  id?: string
  code?: string
}

export interface PermissionCreateReq {
  name: string
  code?: string
  description?: string
  tags: string[]
  meta: PermissionMeta
}

export interface PermissionUpdateReq {
  id: string
  name?: string
  code?: string
  description?: string
  tags?: string[]
  meta?: PermissionMeta
}

export interface PermissionListReq {
  filter?: import("./pagination").RequestFilterParams<PermissionFilter>
  options?: import("./pagination").RequestListOptions
}

export interface PermissionDeleteReq {
  id: string
}

export interface PermissionFilter {
  id?: Record<string, string>
  name?: Record<string, string>
  code?: Record<string, string>
  description?: Record<string, string>
  workspace_id?: Record<string, string>
}

export interface PermissionFormData {
  name: string
  code?: string
  description?: string
  tags?: string[]
}
