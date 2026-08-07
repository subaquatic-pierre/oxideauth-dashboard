import { BaseService } from "./base"
import type { Permission, PermissionFormData } from "@/types/permission"
import type { ListFilters, PaginationMetadata } from "@/types/common"
import { resolveWorkspaceId } from "@/lib/workspace"

export interface PermissionListResponse {
  permissions: Permission[]
  metadata: PaginationMetadata
}

function toPermissionList(data: PermissionListResponse | Permission[]): Permission[] {
  if (Array.isArray(data)) return data
  return data?.permissions ?? []
}

export class PermissionService extends BaseService {
  async list(
    workspaceId?: string,
    filters: ListFilters = {},
  ): Promise<Permission[]> {
    const wid = resolveWorkspaceId(workspaceId)
    const data = await this.post<PermissionListResponse | Permission[]>(
      "/permissions/list",
      {
        workspace_id: wid,
        ...filters,
      },
    )
    return toPermissionList(data)
  }

  async describe(
    workspaceId: string | undefined,
    idOrCode: string,
  ): Promise<Permission> {
    const wid = resolveWorkspaceId(workspaceId)
    return this.post<Permission>("/permissions/describe", {
      workspace_id: wid,
      id: idOrCode,
    })
  }

  async create(
    workspaceId: string | undefined,
    data: PermissionFormData,
  ): Promise<Permission> {
    const wid = resolveWorkspaceId(workspaceId)
    return this.post<Permission>("/permissions/create", {
      workspace_id: wid,
      ...data,
    })
  }

  async update(
    workspaceId: string | undefined,
    idOrCode: string,
    data: PermissionFormData,
  ): Promise<Permission> {
    const wid = resolveWorkspaceId(workspaceId)
    return this.post<Permission>("/permissions/update", {
      workspace_id: wid,
      id: idOrCode,
      ...data,
    })
  }

  async delete(
    workspaceId: string | undefined,
    idOrCode: string,
  ): Promise<void> {
    const wid = resolveWorkspaceId(workspaceId)
    return this.post<void>("/permissions/delete", {
      workspace_id: wid,
      id: idOrCode,
    })
  }
}
