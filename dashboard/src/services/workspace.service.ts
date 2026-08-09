import { BaseService } from "./base";
import type { WorkspaceResponse, WorkspaceFormData } from "@/types/workspace";
import type { ListFilters } from "@/types/common";
import type { PaginatedResponse } from "@/types/pagination";
import { isGuestMode } from "@/lib/guest-mode";
import { mockOk } from "@/lib/mock-ok";
import { MOCK_WORKSPACES } from "@/lib/mock-data";
import { isUuid } from "@/lib/utils";

export class WorkspaceService extends BaseService {
  list(
    filters?: ListFilters,
  ): Promise<PaginatedResponse<WorkspaceResponse, "workspaces">> {
    if (isGuestMode()) {
      const limit = filters?.limit ?? 10;
      const offset = filters?.offset ?? 0;
      const items = MOCK_WORKSPACES.slice(offset, offset + limit);
      return Promise.resolve(
        mockOk({
          workspaces: items,
          metadata: {
            total: MOCK_WORKSPACES.length,
            count: items.length,
            offset,
            limit,
            order_bys: ["!created_at"],
          },
        }).data as unknown as PaginatedResponse<WorkspaceResponse, "workspaces">,
      );
    }
    return this.post<PaginatedResponse<WorkspaceResponse, "workspaces">>(
      "/workspace/list",
      {
        filter: {
          // tags: filters?.tags ?? [],
          fields: filters?.fields ?? {},
        },
        options: {
          limit: filters?.limit ?? 10,
          offset: filters?.offset ?? 0,
          order_bys: filters?.order_bys?.join(",") ?? "!created_at",
        },
      },
    );
  }

  describe(identifier: string): Promise<WorkspaceResponse> {
    if (isGuestMode()) {
      const ws = MOCK_WORKSPACES.find(
        (w) => w.id === identifier || w.slug === identifier,
      );
      return Promise.resolve(
        mockOk(ws ?? MOCK_WORKSPACES[0]).data as unknown as WorkspaceResponse,
      );
    }
    return this.post<WorkspaceResponse>("/workspace/describe", workspaceIdentifier(identifier));
  }

  create(data: WorkspaceFormData): Promise<WorkspaceResponse> {
    if (isGuestMode()) {
      return Promise.resolve(
        mockOk({ ...data, id: "ws-mock-new" }).data as unknown as WorkspaceResponse,
      );
    }
    return this.post<WorkspaceResponse>("/workspace/create", {
      config: { schema_version: "1" },
      tags: [],
      meta: { schema_version: "1" },
      ...data,
    });
  }

  update(
    identifier: string,
    data: Partial<WorkspaceFormData>,
  ): Promise<WorkspaceResponse> {
    if (isGuestMode()) {
      return Promise.resolve(
        mockOk({ id: identifier, ...data }).data as unknown as WorkspaceResponse,
      );
    }
    return this.post<WorkspaceResponse>("/workspace/update", {
      ...workspaceIdentifier(identifier),
      ...data,
    });
  }

  delete(identifier: string): Promise<void> {
    if (isGuestMode()) {
      return Promise.resolve();
    }
    return this.post<void>("/workspace/delete", workspaceIdentifier(identifier));
  }
}

function workspaceIdentifier(idOrSlug: string): Record<string, string> {
  return isUuid(idOrSlug) ? { id: idOrSlug } : { slug: idOrSlug };
}
