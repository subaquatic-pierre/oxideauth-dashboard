import { BaseService } from "./base"
import type { PermissionResponse, PermissionFormData } from "@/types/permission"
import type { ListFilters } from "@/types/common"
import type { ListResponseMeta } from "@/types/pagination"
import { resolveWorkspaceId } from "@/lib/workspace"
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
  async list(
    workspaceId?: string,
    filters: ListFilters = {},
  ): Promise<PermissionResponse[]> {
    if (isGuestMode()) {
      const items = filterByWorkspace(
        MOCK_PERMISSIONS,
        resolveWorkspaceId(workspaceId),
      )
      return mockOk(items).data as unknown as PermissionResponse[]
    }
    const wid = resolveWorkspaceId(workspaceId)
    const data = await this.post<PermissionListResponse | PermissionResponse[]>(
      "/permissions/list",
      {
        workspace_id: wid,
        ...buildListQuery(filters),
      },
    )
    return toPermissionList(data)
  }

  async describe(
    workspaceId: string | undefined,
    idOrCode: string,
  ): Promise<PermissionResponse> {
    if (isGuestMode()) {
      const permission = filterByWorkspace(
        MOCK_PERMISSIONS,
        resolveWorkspaceId(workspaceId),
      ).find((p) => p.id === idOrCode || p.code === idOrCode)
      return mockOk(permission ?? MOCK_PERMISSIONS[0]).data as unknown as PermissionResponse
    }
    const wid = resolveWorkspaceId(workspaceId)
    return this.post<PermissionResponse>("/permissions/describe", {
      workspace_id: wid,
      ...permissionDescribeIdentifier(idOrCode),
    })
  }

  async create(
    workspaceId: string | undefined,
    data: PermissionFormData,
  ): Promise<PermissionResponse> {
    if (isGuestMode()) {
      return mockOk({
        id: "perm-mock-new",
        workspace_id: resolveWorkspaceId(workspaceId),
        ...data,
      }).data as unknown as PermissionResponse
    }
    const wid = resolveWorkspaceId(workspaceId)
    return this.post<PermissionResponse>("/permissions/create", {
      workspace_id: wid,
      tags: [],
      meta: { schema_version: "1" },
      ...data,
    })
  }

  async update(
    workspaceId: string | undefined,
    idOrCode: string,
    data: PermissionFormData,
  ): Promise<PermissionResponse> {
    if (isGuestMode()) {
      return mockOk({ id: idOrCode, ...data }).data as unknown as PermissionResponse
    }
    const wid = resolveWorkspaceId(workspaceId)
    return this.post<PermissionResponse>("/permissions/update", {
      workspace_id: wid,
      id: idOrCode,
      ...data,
    })
  }

  async delete(
    workspaceId: string | undefined,
    idOrCode: string,
  ): Promise<void> {
    if (isGuestMode()) {
      return Promise.resolve()
    }
    const wid = resolveWorkspaceId(workspaceId)
    return this.post<void>("/permissions/delete", {
      workspace_id: wid,
      id: idOrCode,
    })
  }
}

function permissionDescribeIdentifier(idOrCode: string): Record<string, string> {
  return isUuid(idOrCode) ? { id: idOrCode } : { code: idOrCode };
}
