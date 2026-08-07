import { BaseService } from "./base"
import { buildListQuery } from "@/lib/query"
import { getActiveWorkspaceId } from "@/lib/workspace"
import type { BlacklistedToken } from "@/types/token"
import type { ListFilters, PaginatedResponse } from "@/types/common"

/**
 * Blacklisted-token (revoked JWT audit) management. Tokens are scoped to a
 * workspace, so the service injects the active workspace id from localStorage
 * ("active_workspace_id") into every request body; callers pass no workspace
 * argument.
 *
 * There is NO create or update method: blacklist entries are written by the
 * auth lifecycle. The only dashboard action is delete (un-revoke).
 */
export class TokenService extends BaseService {
  async list(
    filters?: ListFilters,
  ): Promise<PaginatedResponse<BlacklistedToken, "tokens">> {
    return this.post("/tokens/list", {
      workspace_id: getActiveWorkspaceId(),
      ...buildListQuery(filters),
    })
  }

  async describe(id: string): Promise<BlacklistedToken> {
    return this.post("/tokens/describe", {
      workspace_id: getActiveWorkspaceId(),
      id,
    })
  }

  async delete(id: string): Promise<void> {
    return this.post("/tokens/delete", {
      workspace_id: getActiveWorkspaceId(),
      id,
    })
  }
}
