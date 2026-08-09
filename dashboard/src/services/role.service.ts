import { BaseService } from "./base"
import type { RoleResponse, RoleFormData } from "@/types/role"
import type { ListFilters } from "@/types/common"
import type { ListResponseMeta } from "@/types/pagination"
import { resolveWorkspaceId } from "@/lib/workspace"
import { isGuestMode } from "@/lib/guest-mode"
import { mockOk } from "@/lib/mock-ok"
import { MOCK_ROLES, filterByWorkspace } from "@/lib/mock-data"
import { buildListQuery } from "@/lib/query"

export interface RoleListResponse {
  roles: RoleResponse[]
  metadata: ListResponseMeta
}

function toRoleList(data: RoleListResponse | RoleResponse[]): RoleResponse[] {
  if (Array.isArray(data)) return data
  return data?.roles ?? []
}

export class RoleService extends BaseService {
  async list(workspaceId?: string, filters: ListFilters = {}): Promise<RoleResponse[]> {
    if (isGuestMode()) {
      const items = filterByWorkspace(MOCK_ROLES, resolveWorkspaceId(workspaceId))
      return mockOk(items).data as unknown as RoleResponse[]
    }
    const wid = resolveWorkspaceId(workspaceId)
    const data = await this.post<RoleListResponse | RoleResponse[]>("/roles/list", {
      workspace_id: wid,
      ...buildListQuery(filters),
    })
    return toRoleList(data)
  }

  async describe(workspaceId: string | undefined, id: string): Promise<RoleResponse> {
    if (isGuestMode()) {
      const role = filterByWorkspace(
        MOCK_ROLES,
        resolveWorkspaceId(workspaceId),
      ).find((r) => r.id === id)
      return mockOk(role ?? MOCK_ROLES[0]).data as unknown as RoleResponse
    }
    const wid = resolveWorkspaceId(workspaceId)
    return this.post<RoleResponse>("/roles/describe", {
      workspace_id: wid,
      id,
    })
  }

  async create(
    workspaceId: string | undefined,
    data: RoleFormData,
  ): Promise<RoleResponse> {
    if (isGuestMode()) {
      return mockOk({
        id: "role-mock-new",
        workspace_id: resolveWorkspaceId(workspaceId),
        ...data,
      }).data as unknown as RoleResponse
    }
    const wid = resolveWorkspaceId(workspaceId)
    return this.post<RoleResponse>("/roles/create", {
      workspace_id: wid,
      tags: [],
      meta: { schema_version: "1" },
      ...data,
    })
  }

  async update(
    workspaceId: string | undefined,
    id: string,
    data: RoleFormData,
  ): Promise<RoleResponse> {
    if (isGuestMode()) {
      return mockOk({ id, ...data }).data as unknown as RoleResponse
    }
    const wid = resolveWorkspaceId(workspaceId)
    return this.post<RoleResponse>("/roles/update", {
      workspace_id: wid,
      id,
      ...data,
    })
  }

  async delete(workspaceId: string | undefined, id: string): Promise<void> {
    if (isGuestMode()) {
      return Promise.resolve()
    }
    const wid = resolveWorkspaceId(workspaceId)
    return this.post<void>("/roles/delete", {
      workspace_id: wid,
      id,
    })
  }
}
