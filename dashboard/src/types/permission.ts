import type { ListFilters } from "./common"

export interface Permission {
  id: string
  workspace_id: string
  name: string
  code: string
  description?: string
  tags?: string[]
  meta?: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface PermissionFormData {
  name: string
  code: string
  description?: string
  tags?: string[]
}

export type PermissionListFilters = ListFilters
