import { BaseService } from "./base"
import type { PermissionResponse, PermissionFormData } from "@/types/permission"
import type { ListFilters } from "@/types/common"
import type { ListResponseMeta } from "@/types/pagination"
import { getActiveWorkspaceId } from "@/lib/workspace"
import { isGuestMode } from "@/lib/guest-mode"
import { mockOk } from "@/lib/mock-ok"
import { MOCK_PERMISSIONS, filterByWorkspace } from "@/lib/mock-data"
import { buildListQuery } from "@/lib/query"
import { isUuid } from "@/lib/utils"

export interface PermissionListResponse {
  permissions: PermissionResponse[]
  metadata: ListResponseMeta
}

function toPermissionList(data: PermissionListResponse | PermissionResponse[]): PermissionResponse[] {
  if (Array.isArray(data)) return data
  return data?.permissions ?? []
}

export class PermissionService extends BaseService {
  async list(filters: ListFilters = {}): Promise<PermissionResponse[]> {
    if (isGuestMode()) {
      const items = filterByWorkspace(
        MOCK_PERMISSIONS,
        getActiveWorkspaceId(),
      )
      return mockOk(items).data as unknown as PermissionResponse[]
    }
    const data = await this.post<PermissionListResponse | PermissionResponse[]>(
      "/permissions/list",
      {
        ...buildListQuery(filters),
      },
    )
    return toPermissionList(data)
  }

  async describe(idOrCode: string): Promise<PermissionResponse> {
    if (isGuestMode()) {
      const permission = filterByWorkspace(
        MOCK_PERMISSIONS,
        getActiveWorkspaceId(),
      ).find((p) => p.id === idOrCode || p.code === idOrCode)
      return mockOk(permission ?? MOCK_PERMISSIONS[0]).data as unknown as PermissionResponse
    }
    return this.post<PermissionResponse>("/permissions/describe", {
      ...permissionDescribeIdentifier(idOrCode),
    })
  }

  async create(data: PermissionFormData): Promise<PermissionResponse> {
    if (isGuestMode()) {
      return mockOk({
        id: "perm-mock-new",
        workspace_id: getActiveWorkspaceId(),
        ...data,
      }).data as unknown as PermissionResponse
    }
    return this.post<PermissionResponse>("/permissions/create", {
      tags: [],
      meta: { schema_version: "1" },
      ...data,
    })
  }

  async update(
    idOrCode: string,
    data: PermissionFormData,
  ): Promise<PermissionResponse> {
    if (isGuestMode()) {
      return mockOk({ id: idOrCode, ...data }).data as unknown as PermissionResponse
    }
    return this.post<PermissionResponse>("/permissions/update", {
      id: idOrCode,
      ...data,
    })
  }

  async delete(idOrCode: string): Promise<void> {
    if (isGuestMode()) {
      return Promise.resolve()
    }
    return this.post<void>("/permissions/delete", {
      id: idOrCode,
    })
  }
}

function permissionDescribeIdentifier(idOrCode: string): Record<string, string> {
  return isUuid(idOrCode) ? { id: idOrCode } : { code: idOrCode };
}
