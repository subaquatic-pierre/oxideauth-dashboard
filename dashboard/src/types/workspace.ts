import type { WorkspaceMeta, WorkspaceConfig } from "./common";

export type WorkspaceResponse = WorkspaceDescribeRes;

export interface WorkspaceDescribeRes {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  config: WorkspaceConfig;
  tags: string[];
  meta: WorkspaceMeta;
  created_at: string;
  updated_at?: string | null;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  config: WorkspaceConfig;
  tags: string[];
  meta: WorkspaceMeta;
  created_by: string;
  created_at: string;
  updated_by?: string | null;
  updated_at?: string | null;
}

export interface WorkspaceListRes {
  workspaces: WorkspaceDescribeRes[];
  metadata: import("./pagination").ListResponseMeta;
}

export interface WorkspaceDeleteRes {
  id: string;
  slug: string;
  name: string;
}

export interface WorkspaceDescribeReq {
  id?: string;
  slug?: string;
}

export interface WorkspaceCreateReq {
  name: string;
  slug: string;
  description?: string;
  config: WorkspaceConfig;
  tags: string[];
  meta: WorkspaceMeta;
}

export interface WorkspaceUpdateReq {
  id?: string;
  slug?: string;
  name?: string;
  description?: string;
  config?: WorkspaceConfig;
  tags?: string[];
  meta?: WorkspaceMeta;
}

export interface WorkspaceListReq {
  filter?: import("./pagination").RequestFilterParams<WorkspaceFilter>;
  options?: import("./pagination").RequestListOptions;
}

export interface WorkspaceDeleteReq {
  id?: string;
  slug?: string;
}

export interface WorkspaceFilter {
  id?: Record<string, string>;
  name?: Record<string, string>;
  slug?: Record<string, string>;
  description?: Record<string, string>;
}

export interface WorkspaceFormData {
  name: string;
  slug: string;
  description?: string;
  config?: WorkspaceConfig;
  tags?: string[];
  meta?: WorkspaceMeta;
}
