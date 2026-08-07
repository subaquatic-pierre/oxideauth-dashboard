import { BaseService } from "./base"
import { buildListQuery } from "@/lib/query"
import { getActiveWorkspaceId } from "@/lib/workspace"
import { isUuid } from "@/lib/utils"
import type { Project, ProjectFormData } from "@/types/project"
import type { ListFilters, PaginatedResponse } from "@/types/common"

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
    return this.post("/projects/list", {
      workspace_id: workspaceId || getActiveWorkspaceId(),
      ...buildListQuery(filters),
    })
  }

  async describe(workspaceId: string, idOrCode: string): Promise<Project> {
    return this.post("/projects/describe", {
      workspace_id: workspaceId || getActiveWorkspaceId(),
      ...projectIdentifier(idOrCode),
    })
  }

  async create(workspaceId: string, data: ProjectFormData): Promise<Project> {
    return this.post("/projects/create", {
      workspace_id: workspaceId || getActiveWorkspaceId(),
      ...data,
    })
  }

  async update(
    workspaceId: string,
    idOrCode: string,
    data: ProjectFormData,
  ): Promise<Project> {
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
    return this.post("/projects/delete", {
      workspace_id: workspaceId || getActiveWorkspaceId(),
      ...projectIdentifier(idOrCode),
    })
  }
}

function projectIdentifier(idOrCode: string): Record<string, string> {
  return isUuid(idOrCode) ? { id: idOrCode } : { code: idOrCode }
}
