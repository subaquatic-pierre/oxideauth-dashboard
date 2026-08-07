export interface Account {
  id: string
  email: string
  name: string
  password?: string
  verified: boolean
  enabled: boolean
  description?: string
  avatar_url?: string
  tags?: string[]
  meta?: Record<string, unknown>
  created_by?: string
  updated_by?: string
  created_at: string
  updated_at: string
}

export interface AccountFormData {
  email: string
  name: string
  password?: string  // only for create
  description?: string
  avatar_url?: string
  enabled?: boolean
  verified?: boolean
  tags?: string[]
  meta?: Record<string, unknown>
}
