import { BaseService } from "./base"
import type { Role, RoleFormData } from "@/types/role"
import type { ListFilters, PaginationMetadata } from "@/types/common"
import { resolveWorkspaceId } from "@/lib/workspace"

export interface RoleListResponse {
  roles: Role[]
  metadata: PaginationMetadata
}

function toRoleList(data: RoleListResponse | Role[]): Role[] {
  if (Array.isArray(data)) return data
  return data?.roles ?? []
}

export class RoleService extends BaseService {
  async list(workspaceId?: string, filters: ListFilters = {}): Promise<Role[]> {
    const wid = resolveWorkspaceId(workspaceId)
    const data = await this.post<RoleListResponse | Role[]>("/roles/list", {
      workspace_id: wid,
      ...filters,
    })
    return toRoleList(data)
  }

  async describe(workspaceId: string | undefined, id: string): Promise<Role> {
    const wid = resolveWorkspaceId(workspaceId)
    return this.post<Role>("/roles/describe", {
      workspace_id: wid,
      id,
    })
  }

  async create(
    workspaceId: string | undefined,
    data: RoleFormData,
  ): Promise<Role> {
    const wid = resolveWorkspaceId(workspaceId)
    return this.post<Role>("/roles/create", {
      workspace_id: wid,
      ...data,
    })
  }

  async update(
    workspaceId: string | undefined,
    id: string,
    data: RoleFormData,
  ): Promise<Role> {
    const wid = resolveWorkspaceId(workspaceId)
    return this.post<Role>("/roles/update", {
      workspace_id: wid,
      id,
      ...data,
    })
  }

  async delete(workspaceId: string | undefined, id: string): Promise<void> {
    const wid = resolveWorkspaceId(workspaceId)
    return this.post<void>("/roles/delete", {
      workspace_id: wid,
      id,
    })
  }
}
