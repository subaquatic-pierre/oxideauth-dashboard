import type { ProjectMeta, ProjectConfig } from "./common"

export type Project = ProjectDescribeRes

export interface ProjectDescribeRes {
  id: string
  name: string
  code?: string | null
  description?: string | null
  config: ProjectConfig
  tags: string[]
  meta: ProjectMeta
  created_at: string
  updated_at?: string | null
}

export interface ProjectListRes {
  projects: ProjectDescribeRes[]
  metadata: import("./pagination").ListResponseMeta
}

export interface ProjectDeleteRes {
  id: string
  code?: string | null
  name: string
}

export interface ProjectDescribeReq {
  id?: string
  code?: string
  workspace_id: string
}

export interface ProjectCreateReq {
  workspace_id: string
  name: string
  code?: string
  description?: string
  config: ProjectConfig
  tags: string[]
  meta: ProjectMeta
}

export interface ProjectUpdateReq {
  id?: string
  code?: string
  workspace_id: string
  name?: string
  new_code?: string
  description?: string
  config?: ProjectConfig
  tags?: string[]
  meta?: ProjectMeta
}

export interface ProjectListReq {
  workspace_id: string
  filter?: import("./pagination").RequestFilterParams<ProjectFilter>
  options?: import("./pagination").RequestListOptions
}

export interface ProjectDeleteReq {
  id?: string
  code?: string
  workspace_id: string
}

export interface ProjectFilter {
  id?: Record<string, string>
  name?: Record<string, string>
  code?: Record<string, string>
  description?: Record<string, string>
  workspace_id?: Record<string, string>
}

export interface ProjectFormData {
  name: string
  code?: string
  description?: string
  config?: ProjectConfig
  tags?: string[]
  meta?: ProjectMeta
}
