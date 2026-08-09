import { BaseService } from "./base"
import type { RoleResponse, RoleFormData } from "@/types/role"
import type { ListFilters } from "@/types/common"
import type { ListResponseMeta } from "@/types/pagination"
import { getActiveWorkspaceId } from "@/lib/workspace"
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
  async list(filters: ListFilters = {}): Promise<RoleResponse[]> {
    if (isGuestMode()) {
      const items = filterByWorkspace(MOCK_ROLES, getActiveWorkspaceId())
      return mockOk(items).data as unknown as RoleResponse[]
    }
    const data = await this.post<RoleListResponse | RoleResponse[]>("/roles/list", {
      ...buildListQuery(filters),
    })
    return toRoleList(data)
  }

  async describe(id: string): Promise<RoleResponse> {
    if (isGuestMode()) {
      const role = filterByWorkspace(
        MOCK_ROLES,
        getActiveWorkspaceId(),
      ).find((r) => r.id === id)
      return mockOk(role ?? MOCK_ROLES[0]).data as unknown as RoleResponse
    }
    return this.post<RoleResponse>("/roles/describe", {
      id,
    })
  }

  async create(data: RoleFormData): Promise<RoleResponse> {
    if (isGuestMode()) {
      return mockOk({
        id: "role-mock-new",
        workspace_id: getActiveWorkspaceId(),
        ...data,
      }).data as unknown as RoleResponse
    }
    return this.post<RoleResponse>("/roles/create", {
      tags: [],
      meta: { schema_version: "1" },
      ...data,
    })
  }

  async update(
    id: string,
    data: RoleFormData,
  ): Promise<RoleResponse> {
    if (isGuestMode()) {
      return mockOk({ id, ...data }).data as unknown as RoleResponse
    }
    return this.post<RoleResponse>("/roles/update", {
      id,
      ...data,
    })
  }

  async delete(id: string): Promise<void> {
    if (isGuestMode()) {
      return Promise.resolve()
    }
    return this.post<void>("/roles/delete", {
      id,
    })
  }
}
