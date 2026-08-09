import { BaseService } from "./base"
import { buildListQuery } from "@/lib/query"
import { getActiveWorkspaceId } from "@/lib/workspace"
import type { Credential, CredentialFormData } from "@/types/credential"
import type { ListFilters } from "@/types/common"
import type { PaginatedResponse } from "@/types/pagination"
import { isGuestMode } from "@/lib/guest-mode"
import { mockOk } from "@/lib/mock-ok"
import { MOCK_CREDENTIALS, filterByWorkspace } from "@/lib/mock-data"

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
    filters?: ListFilters,
  ): Promise<PaginatedResponse<Credential, "credentials">> {
    if (isGuestMode()) {
      const items = filterByWorkspace(
        MOCK_CREDENTIALS,
        getActiveWorkspaceId(),
      )
      const limit = filters?.limit ?? 10
      const offset = filters?.offset ?? 0
      const page = items.slice(offset, offset + limit)
      return mockOk({
        credentials: page,
        metadata: {
          total: items.length,
          count: page.length,
          offset,
          limit,
          order_bys: filters?.order_bys ?? ["!created_at"],
        },
      }).data as unknown as PaginatedResponse<Credential, "credentials">
    }
    return this.post("/credentials/list", {
      ...buildListQuery(filters),
    })
  }

  async describe(
    accountId: string,
    id: string,
  ): Promise<Credential> {
    if (isGuestMode()) {
      const credential = filterByWorkspace(
        MOCK_CREDENTIALS,
        getActiveWorkspaceId(),
      ).find((c) => c.id === id && c.account_id === accountId)
      return mockOk(credential ?? MOCK_CREDENTIALS[0]).data as unknown as Credential
    }
    return this.post("/credentials/describe", {
      account_id: accountId,
      id,
    })
  }

  async update(
    accountId: string,
    id: string,
    data: CredentialFormData,
  ): Promise<Credential> {
    if (isGuestMode()) {
      return mockOk({ id, account_id: accountId, ...data }).data as unknown as Credential
    }
    return this.post("/credentials/update", {
      account_id: accountId,
      id,
      ...data,
    })
  }

  async delete(accountId: string, id: string): Promise<void> {
    if (isGuestMode()) {
      return Promise.resolve()
    }
    return this.post("/credentials/delete", {
      account_id: accountId,
      id,
    })
  }
}
