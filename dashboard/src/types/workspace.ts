export interface Workspace {
  id: string
  name: string
  slug: string
  description?: string
  config?: Record<string, unknown>
  tags?: string[]
  meta?: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface WorkspaceFormData {
  name: string
  slug: string
  description?: string
  config?: Record<string, unknown>
  tags?: string[]
  meta?: Record<string, unknown>
}
