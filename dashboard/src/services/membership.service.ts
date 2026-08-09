import { BaseService } from "./base";
import type { PaginatedResponse } from "@/types/pagination";
import type {
  Membership,
  MembershipFormData,
  MembershipListParams,
} from "@/types/membership";
import { isGuestMode } from "@/lib/guest-mode";
import { mockOk } from "@/lib/mock-ok";
import { MOCK_MEMBERSHIPS, filterByWorkspace } from "@/lib/mock-data";

export class MembershipService extends BaseService {
  async list(
    workspaceId: string,
    filters?: MembershipListParams,
  ): Promise<Membership[]> {
    if (isGuestMode()) {
      const items = filterByWorkspace(MOCK_MEMBERSHIPS, workspaceId);
      return mockOk(items).data as unknown as Membership[];
    }
    const res = await this.post<PaginatedResponse<Membership, "memberships">>(
      "/memberships/list",
      {
        workspace_id: workspaceId,
        filter: {
          // tags: [],
          fields: { ...(filters ?? {}) },
        },
        options: {
          limit: 500,
          offset: 0,
          order_bys: "!created_at",
        },
      },
    );
    return (res.memberships as Membership[]) ?? [];
  }

  async describe(workspaceId: string, id: string): Promise<Membership> {
    if (isGuestMode()) {
      const membership = filterByWorkspace(MOCK_MEMBERSHIPS, workspaceId).find(
        (m) => m.id === id,
      );
      return mockOk(membership ?? MOCK_MEMBERSHIPS[0])
        .data as unknown as Membership;
    }
    return this.post<Membership>("/memberships/describe", {
      workspace_id: workspaceId,
      id,
    });
  }

  async create(
    workspaceId: string,
    data: MembershipFormData,
  ): Promise<Membership> {
    if (isGuestMode()) {
      return mockOk({
        id: "mem-mock-new",
        workspace_id: workspaceId,
        ...data,
      }).data as unknown as Membership;
    }
    return this.post<Membership>("/memberships/create", {
      workspace_id: workspaceId,
      status: "active" as const,
      tags: [],
      meta: { schema_version: "1" },
      ...data,
    });
  }

  async update(
    workspaceId: string,
    id: string,
    data: Partial<MembershipFormData>,
  ): Promise<Membership> {
    if (isGuestMode()) {
      return mockOk({ id, ...data }).data as unknown as Membership;
    }
    const { role_ids, ...updateData } = data;
    return this.post<Membership>("/memberships/update", {
      workspace_id: workspaceId,
      id,
      ...updateData,
    });
  }

  async delete(workspaceId: string, id: string): Promise<void> {
    if (isGuestMode()) {
      return Promise.resolve();
    }
    return this.post<void>("/memberships/delete", {
      workspace_id: workspaceId,
      id,
    });
  }
}
