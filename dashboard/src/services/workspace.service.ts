import { BaseService } from "./base"
import type { Workspace, WorkspaceFormData } from "@/types/workspace"
import type { ListFilters, PaginatedResponse } from "@/types/common"

export class WorkspaceService extends BaseService {
  list(filters?: ListFilters): Promise<PaginatedResponse<Workspace, "workspaces">> {
    return this.post<PaginatedResponse<Workspace, "workspaces">>("/workspace/list", {
      filter: {
        tags: filters?.tags ?? [],
        fields: filters?.fields ?? {},
      },
      options: {
        limit: filters?.limit ?? 10,
        offset: filters?.offset ?? 0,
        order_bys: filters?.order_bys?.join(",") ?? "!created_at",
      },
    })
  }

  describe(identifier: string): Promise<Workspace> {
    // The API accepts either a UUID id or a unique slug as the identifier.
    return this.post<Workspace>("/workspace/describe", { id: identifier })
  }

  create(data: WorkspaceFormData): Promise<Workspace> {
    return this.post<Workspace>("/workspace/create", data)
  }

  update(identifier: string, data: Partial<WorkspaceFormData>): Promise<Workspace> {
    return this.post<Workspace>("/workspace/update", { id: identifier, ...data })
  }

  delete(identifier: string): Promise<void> {
    return this.post<void>("/workspace/delete", { id: identifier })
  }
}

export const workspaceService = new WorkspaceService()
