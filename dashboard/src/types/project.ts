export interface Project {
  id: string
  workspace_id: string
  name: string
  code: string
  description?: string
  config?: Record<string, unknown>
  tags?: string[]
  meta?: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface ProjectFormData {
  name: string
  code: string
  description?: string
  config?: Record<string, unknown>
  tags?: string[]
}
