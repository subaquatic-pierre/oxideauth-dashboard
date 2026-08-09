import type { AccountMeta } from "./common"

export type AccountResponse = AccountDescribeRes

export interface AccountDescribeRes {
  id: string
  email: string
  name: string
  description?: string | null
  avatar_url?: string | null
  enabled: boolean
  verified: boolean
  tags: string[]
  meta: AccountMeta
  created_at: string
  updated_at?: string | null
}

export interface Account {
  id: string
  email: string
  name: string
  description?: string | null
  avatar_url?: string | null
  enabled: boolean
  verified: boolean
  tags: string[]
  meta: AccountMeta
  created_by: string
  created_at: string
  updated_by?: string | null
  updated_at?: string | null
}

export interface AccountListRes {
  accounts: Account[]
  metadata: import("./pagination").ListResponseMeta
}

export interface AccountDeleteRes {
  id: string
}

export interface AccountDescribeReq {
  email?: string
  id?: string
  workspace_id: string
}

export interface AccountCreateReq {
  email: string
  password: string
  workspace_id: string
  name: string
  description?: string
  avatar_url?: string
  tags?: string[]
  meta?: AccountMeta
}

export interface AccountUpdateReq {
  email?: string
  id?: string
  workspace_id: string
  name?: string
  description?: string
  avatar_url?: string
  enabled?: boolean
  verified?: boolean
  tags?: string[]
  meta?: AccountMeta
}

export interface AccountListReq {
  workspace_id: string
  filter?: import("./pagination").RequestFilterParams<AccountFilter>
  options?: import("./pagination").RequestListOptions
}

export interface AccountDeleteReq {
  email?: string
  id?: string
  workspace_id: string
}

export interface AccountFilter {
  id?: Record<string, string>
  email?: Record<string, string>
  name?: Record<string, string>
  description?: Record<string, string>
  avatar_url?: Record<string, string>
  verified?: Record<string, unknown>
  enabled?: Record<string, unknown>
  created_by?: Record<string, string>
  created_at?: Record<string, unknown>
  updated_by?: Record<string, string>
  updated_at?: Record<string, unknown>
}

export interface AccountFormData {
  email: string
  name: string
  password?: string
  description?: string
  avatar_url?: string
  enabled?: boolean
  verified?: boolean
  tags?: string[]
  meta?: AccountMeta
}
