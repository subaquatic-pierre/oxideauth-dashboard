import { BaseService } from "./base"
import type { AccountResponse, AccountFormData } from "@/types/account"
import type { ListResponseMeta } from "@/types/pagination"
import { isGuestMode } from "@/lib/guest-mode"
import { mockOk } from "@/lib/mock-ok"
import { MOCK_ACCOUNTS } from "@/lib/mock-data"
import { isUuid } from "@/lib/utils"

// Query shape accepted by POST /accounts/list. `filter.fields` carries the
// exact-match account fields (email, name, verified, enabled, ...) and
// `options` carries pagination + ordering, mirroring the API's ListQuery body.
export interface AccountListQuery {
  filter?: {
    tags?: string[]
    fields?: Record<string, unknown>
  }
  options?: {
    limit?: number
    offset?: number
    order_bys?: string
  }
}

// Paginated list payload returned by POST /accounts/list: the accounts array
// lives under the `accounts` key alongside pagination metadata.
export interface AccountListResponse {
  accounts: AccountResponse[]
  metadata: ListResponseMeta
}

export class AccountService extends BaseService {
  list(
    workspaceId: string,
    filters?: AccountListQuery,
  ): Promise<AccountListResponse> {
    if (isGuestMode()) {
      const limit = filters?.options?.limit ?? 10
      const offset = filters?.options?.offset ?? 0
      const items = MOCK_ACCOUNTS.slice(offset, offset + limit)
      return Promise.resolve(
        mockOk({
          accounts: items,
          metadata: {
            total: MOCK_ACCOUNTS.length,
            count: items.length,
            offset,
            limit,
            order_bys: [filters?.options?.order_bys ?? "!created_at"],
          },
        }).data as unknown as AccountListResponse,
      )
    }
    return this.post<AccountListResponse>("/accounts/list", {
      workspace_id: workspaceId,
      ...filters,
    })
  }

  // Accepts either an account UUID `id` or an account `email`.
  describe(workspaceId: string, identifier: string): Promise<AccountResponse> {
    if (isGuestMode()) {
      const account = MOCK_ACCOUNTS.find(
        (a) => a.id === identifier || a.email === identifier,
      )
      return Promise.resolve(
        mockOk(account ?? MOCK_ACCOUNTS[0]).data as unknown as AccountResponse,
      )
    }
    return this.post<AccountResponse>("/accounts/describe", {
      workspace_id: workspaceId,
      ...accountIdentifier(identifier),
    })
  }

  create(workspaceId: string, data: AccountFormData): Promise<AccountResponse> {
    if (isGuestMode()) {
      return Promise.resolve(
        mockOk({ id: "acc-mock-new", ...data }).data as unknown as AccountResponse,
      )
    }
    return this.post<AccountResponse>("/accounts/create", {
      workspace_id: workspaceId,
      tags: [],
      meta: { schema_version: "1" },
      ...data,
    })
  }

  // Accepts either an account UUID `id` or an account `email`.
  update(
    workspaceId: string,
    identifier: string,
    data: Partial<AccountFormData>,
  ): Promise<AccountResponse> {
    if (isGuestMode()) {
      return Promise.resolve(
        mockOk({ id: identifier, ...data }).data as unknown as AccountResponse,
      )
    }
    return this.post<AccountResponse>("/accounts/update", {
      workspace_id: workspaceId,
      ...accountIdentifier(identifier),
      ...data,
    })
  }

  // Accepts either an account UUID `id` or an account `email`.
  delete(workspaceId: string, identifier: string): Promise<void> {
    if (isGuestMode()) {
      return Promise.resolve()
    }
    return this.post<void>("/accounts/delete", {
      workspace_id: workspaceId,
      ...accountIdentifier(identifier),
    })
  }
}

function accountIdentifier(idOrEmail: string): Record<string, string> {
  return isUuid(idOrEmail) ? { id: idOrEmail } : { email: idOrEmail };
}
