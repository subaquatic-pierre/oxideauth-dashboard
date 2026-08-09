import { BaseService } from "./base"
import { buildListQuery } from "@/lib/query"
import { getActiveWorkspaceId } from "@/lib/workspace"
import { isUuid } from "@/lib/utils"
import type { Project, ProjectFormData } from "@/types/project"
import type { ListFilters } from "@/types/common"
import type { PaginatedResponse } from "@/types/pagination"
import { isGuestMode } from "@/lib/guest-mode"
import { mockOk } from "@/lib/mock-ok"
import { MOCK_PROJECTS, filterByWorkspace } from "@/lib/mock-data"

/**
 * Workspace-scoped project management. `describe`/`update`/`delete` accept
 * either a project UUID `id` or the project's unique `code` (unique per
 * workspace). When the active workspace is not passed explicitly it is read
 * from localStorage ("active_workspace_id").
 */
export class ProjectService extends BaseService {
  async list(
    workspaceId: string,
    filters?: ListFilters,
  ): Promise<PaginatedResponse<Project, "projects">> {
    if (isGuestMode()) {
      const items = filterByWorkspace(
        MOCK_PROJECTS,
        workspaceId || getActiveWorkspaceId(),
      )
      const limit = filters?.limit ?? 10
      const offset = filters?.offset ?? 0
      const page = items.slice(offset, offset + limit)
      return mockOk({
        projects: page,
        metadata: {
          total: items.length,
          count: page.length,
          offset,
          limit,
          order_bys: filters?.order_bys ?? ["!created_at"],
        },
      }).data as unknown as PaginatedResponse<Project, "projects">
    }
    return this.post("/projects/list", {
      workspace_id: workspaceId || getActiveWorkspaceId(),
      ...buildListQuery(filters),
    })
  }

  async describe(workspaceId: string, idOrCode: string): Promise<Project> {
    if (isGuestMode()) {
      const project = filterByWorkspace(
        MOCK_PROJECTS,
        workspaceId || getActiveWorkspaceId(),
      ).find((p) => p.id === idOrCode || p.code === idOrCode)
      return mockOk(project ?? MOCK_PROJECTS[0]).data as unknown as Project
    }
    return this.post("/projects/describe", {
      workspace_id: workspaceId || getActiveWorkspaceId(),
      ...projectIdentifier(idOrCode),
    })
  }

  async create(workspaceId: string, data: ProjectFormData): Promise<Project> {
    if (isGuestMode()) {
      return mockOk({
        id: "proj-mock-new",
        workspace_id: workspaceId || getActiveWorkspaceId(),
        ...data,
      }).data as unknown as Project
    }
    return this.post("/projects/create", {
      workspace_id: workspaceId || getActiveWorkspaceId(),
      config: { schema_version: "1" },
      tags: [],
      meta: { schema_version: "1" },
      ...data,
    })
  }

  async update(
    workspaceId: string,
    idOrCode: string,
    data: ProjectFormData,
  ): Promise<Project> {
    if (isGuestMode()) {
      return mockOk({ id: idOrCode, ...data }).data as unknown as Project
    }
    const payload: Record<string, unknown> = { ...data }

    if (isUuid(idOrCode)) {
      // Identified by id: a changed `code` is expressed via the API's
      // `new_code` field (renaming the code).
      if (payload.code !== undefined) {
        payload.new_code = payload.code
        delete payload.code
      }
    } else {
      // Identified by code: the code is the identifier itself and cannot be
      // renamed from the same body.
      delete payload.code
    }

    return this.post("/projects/update", {
      workspace_id: workspaceId || getActiveWorkspaceId(),
      ...projectIdentifier(idOrCode),
      ...payload,
    })
  }

  async delete(workspaceId: string, idOrCode: string): Promise<void> {
    if (isGuestMode()) {
      return Promise.resolve()
    }
    return this.post("/projects/delete", {
      workspace_id: workspaceId || getActiveWorkspaceId(),
      ...projectIdentifier(idOrCode),
    })
  }
}

function projectIdentifier(idOrCode: string): Record<string, string> {
  return isUuid(idOrCode) ? { id: idOrCode } : { code: idOrCode }
}
