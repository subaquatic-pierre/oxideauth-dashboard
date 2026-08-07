import { BaseService } from "./base"
import type { PaginatedResponse } from "@/types/common"
import type {
  Membership,
  MembershipFormData,
  MembershipFilters,
} from "@/types/membership"

export class MembershipService extends BaseService {
  async list(
    workspaceId: string,
    filters?: MembershipFilters,
  ): Promise<Membership[]> {
    const res = await this.post<
      PaginatedResponse<Membership, "memberships">
    >("/memberships/list", {
      workspace_id: workspaceId,
      filter: {
        tags: [],
        fields: { ...(filters ?? {}) },
      },
      options: {
        limit: 500,
        offset: 0,
        order_bys: "!created_at",
      },
    })
    return (res.memberships as Membership[]) ?? []
  }

  async describe(workspaceId: string, id: string): Promise<Membership> {
    return this.post<Membership>("/memberships/describe", {
      workspace_id: workspaceId,
      id,
    })
  }

  async create(
    workspaceId: string,
    data: MembershipFormData,
  ): Promise<Membership> {
    return this.post<Membership>("/memberships/create", {
      workspace_id: workspaceId,
      ...data,
    })
  }

  async update(
    workspaceId: string,
    id: string,
    data: Partial<MembershipFormData>,
  ): Promise<Membership> {
    return this.post<Membership>("/memberships/update", {
      workspace_id: workspaceId,
      id,
      ...data,
    })
  }

  async delete(workspaceId: string, id: string): Promise<void> {
    return this.post<void>("/memberships/delete", {
      workspace_id: workspaceId,
      id,
    })
  }
}
