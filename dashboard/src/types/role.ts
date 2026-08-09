import type { RoleMeta } from "./common"
import type { Permission } from "./permission"
import type { Workspace } from "./workspace"

export type RoleResponse = RoleDescribeRes

export interface RoleDescribeRes {
  id: string
  name: string
  description?: string | null
  permissions: Permission[]
  tags: string[]
  meta: RoleMeta
  created_at: string
  updated_at?: string | null
}

export interface Role {
  id: string
  workspace: Workspace
  name: string
  description?: string | null
  permissions: Permission[]
  tags: string[]
  meta: RoleMeta
  created_by: string
  created_at: string
  updated_by?: string | null
  updated_at?: string | null
}

export interface RoleListRes {
  roles: RoleDescribeRes[]
  metadata: import("./pagination").ListResponseMeta
}

export interface RoleDeleteRes {
  id: string
}

export interface RoleDescribeReq {
  id: string
  workspace_id: string
}

export interface RoleCreateReq {
  workspace_id: string
  name: string
  description?: string
  permission_ids: string[]
  tags: string[]
  meta: RoleMeta
}

export interface RoleUpdateReq {
  id: string
  workspace_id: string
  name?: string
  description?: string
  permission_ids?: string[]
  tags?: string[]
  meta?: RoleMeta
}

export interface RoleListReq {
  workspace_id: string
  filter?: import("./pagination").RequestFilterParams<RoleFilter>
  options?: import("./pagination").RequestListOptions
}

export interface RoleDeleteReq {
  id: string
  workspace_id: string
}

export interface RoleFilter {
  id?: Record<string, string>
  name?: Record<string, string>
  description?: Record<string, string>
  workspace_id?: Record<string, string>
}

export interface RoleFormData {
  name: string
  description?: string
  permission_ids: string[]
  tags?: string[]
}
