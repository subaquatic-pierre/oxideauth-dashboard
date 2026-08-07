import { BaseService } from "./base"
import { buildListQuery } from "@/lib/query"
import { getActiveWorkspaceId } from "@/lib/workspace"
import type { Credential, CredentialFormData } from "@/types/credential"
import type { ListFilters, PaginatedResponse } from "@/types/common"

/**
 * Workspace-scoped credential management. Credentials are tied to an owning
 * account (`account_id`), which every describe/update/delete call requires.
 *
 * There is NO create method: credentials are produced implicitly by the auth
 * flows server-side (registration creates a password/local credential, OAuth
 * flows create oauth/sso credentials). Secrets are never returned by the API.
 */
export class CredentialService extends BaseService {
  async list(
    workspaceId: string,
    filters?: ListFilters,
  ): Promise<PaginatedResponse<Credential, "credentials">> {
    return this.post("/credentials/list", {
      workspace_id: workspaceId || getActiveWorkspaceId(),
      ...buildListQuery(filters),
    })
  }

  async describe(
    workspaceId: string,
    accountId: string,
    id: string,
  ): Promise<Credential> {
    return this.post("/credentials/describe", {
      workspace_id: workspaceId || getActiveWorkspaceId(),
      account_id: accountId,
      id,
    })
  }

  async update(
    workspaceId: string,
    accountId: string,
    id: string,
    data: CredentialFormData,
  ): Promise<Credential> {
    return this.post("/credentials/update", {
      workspace_id: workspaceId || getActiveWorkspaceId(),
      account_id: accountId,
      id,
      ...data,
    })
  }

  async delete(
    workspaceId: string,
    accountId: string,
    id: string,
  ): Promise<void> {
    return this.post("/credentials/delete", {
      workspace_id: workspaceId || getActiveWorkspaceId(),
      account_id: accountId,
      id,
    })
  }
}
