import { BaseService } from "./base";
import type { PaginatedResponse } from "@/types/pagination";
import type {
  Membership,
  MembershipFormData,
  MembershipListParams,
} from "@/types/membership";
import { getActiveWorkspaceId } from "@/lib/workspace";
import { isGuestMode } from "@/lib/guest-mode";
import { mockOk } from "@/lib/mock-ok";
import { MOCK_MEMBERSHIPS, filterByWorkspace } from "@/lib/mock-data";

export class MembershipService extends BaseService {
  async list(
    filters?: MembershipListParams,
  ): Promise<Membership[]> {
    if (isGuestMode()) {
      const items = filterByWorkspace(MOCK_MEMBERSHIPS, getActiveWorkspaceId());
      return mockOk(items).data as unknown as Membership[];
    }
    const res = await this.post<PaginatedResponse<Membership, "memberships">>(
      "/memberships/list",
      {
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

  async describe(id: string): Promise<Membership> {
    if (isGuestMode()) {
      const membership = filterByWorkspace(
        MOCK_MEMBERSHIPS,
        getActiveWorkspaceId(),
      ).find((m) => m.id === id);
      return mockOk(membership ?? MOCK_MEMBERSHIPS[0])
        .data as unknown as Membership;
    }
    return this.post<Membership>("/memberships/describe", {
      id,
    });
  }

  async create(data: MembershipFormData): Promise<Membership> {
    if (isGuestMode()) {
      return mockOk({
        id: "mem-mock-new",
        workspace_id: getActiveWorkspaceId(),
        ...data,
      }).data as unknown as Membership;
    }
    return this.post<Membership>("/memberships/create", {
      status: "active" as const,
      tags: [],
      meta: { schema_version: "1" },
      ...data,
    });
  }

  async update(
    id: string,
    data: Partial<MembershipFormData>,
  ): Promise<Membership> {
    if (isGuestMode()) {
      return mockOk({ id, ...data }).data as unknown as Membership;
    }
    const { role_ids, ...updateData } = data;
    return this.post<Membership>("/memberships/update", {
      id,
      ...updateData,
    });
  }

  async delete(id: string): Promise<void> {
    if (isGuestMode()) {
      return Promise.resolve();
    }
    return this.post<void>("/memberships/delete", {
      id,
    });
  }
}
