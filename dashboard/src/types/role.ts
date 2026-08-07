import type { ListFilters } from "./common"
import type { Permission } from "./permission"

export interface Role {
  id: string
  workspace_id: string
  name: string
  description?: string
  permission_ids: string[]
  permissions?: Permission[] // populated on describe
  tags?: string[]
  meta?: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface RoleFormData {
  name: string
  description?: string
  permission_ids: string[]
  tags?: string[]
}

export type RoleListFilters = ListFilters
