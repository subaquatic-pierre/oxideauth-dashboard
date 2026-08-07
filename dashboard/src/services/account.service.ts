import { BaseService } from "./base"
import type { Account, AccountFormData } from "@/types/account"
import type { PaginationMetadata } from "@/types/common"

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
  accounts: Account[]
  metadata: PaginationMetadata
}

export class AccountService extends BaseService {
  list(
    workspaceId: string,
    filters?: AccountListQuery,
  ): Promise<AccountListResponse> {
    return this.post<AccountListResponse>("/accounts/list", {
      workspace_id: workspaceId,
      ...filters,
    })
  }

  // Accepts either an account UUID `id` or an account `email`.
  describe(workspaceId: string, identifier: string): Promise<Account> {
    return this.post<Account>("/accounts/describe", {
      workspace_id: workspaceId,
      id: identifier,
    })
  }

  create(workspaceId: string, data: AccountFormData): Promise<Account> {
    return this.post<Account>("/accounts/create", {
      workspace_id: workspaceId,
      ...data,
    })
  }

  // Accepts either an account UUID `id` or an account `email`.
  update(
    workspaceId: string,
    identifier: string,
    data: Partial<AccountFormData>,
  ): Promise<Account> {
    return this.post<Account>("/accounts/update", {
      workspace_id: workspaceId,
      id: identifier,
      ...data,
    })
  }

  // Accepts either an account UUID `id` or an account `email`.
  delete(workspaceId: string, identifier: string): Promise<void> {
    return this.post<void>("/accounts/delete", {
      workspace_id: workspaceId,
      id: identifier,
    })
  }
}

export const accountService = new AccountService()
