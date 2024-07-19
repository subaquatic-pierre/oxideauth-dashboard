import { Account } from '@/types/account';

import { BaseClient } from './client';
import { CREATE_SERVICE_ACCOUNT, DELETE_ACCOUNT, DESCRIBE_ACCOUNT, LIST_ACCOUNTS, UPDATE_ACCOUNT } from './endpoints';

interface CreateServiceAccountParams {
  email: string;
  name: string;
  description: string;
}

interface UpdateAccountParams {
  account: string;
  name?: string;
  description?: string;
}

class AccountClient extends BaseClient {
  async listAccounts(): Promise<Account[]> {
    const data = await super.req<{ accounts: Account[] }>({ endpoint: LIST_ACCOUNTS });
    return data.accounts;
  }

  async describeAccount(idOrName: string): Promise<Account> {
    const data = await super.req<{ account: Account }>({
      endpoint: DESCRIBE_ACCOUNT,
      method: 'POST',
      data: { account: idOrName },
    });
    return data.account;
  }

  async updateAccount(updateParams: UpdateAccountParams): Promise<Account> {
    const data = await super.req<{ account: Account }>({
      endpoint: UPDATE_ACCOUNT,
      method: 'POST',
      data: updateParams,
      auth: true,
    });
    return data.account;
  }

  async deleteAccount(idOrName: string): Promise<boolean> {
    const data = await super.req<{ deleted: boolean }>({
      endpoint: DELETE_ACCOUNT,
      method: 'POST',
      data: { account: idOrName },
      auth: true,
    });

    return data.deleted;
  }

  async createServiceAccount(updateParams: CreateServiceAccountParams): Promise<Account> {
    const data = await super.req<{ account: Account }>({
      endpoint: CREATE_SERVICE_ACCOUNT,
      method: 'POST',
      data: updateParams,
      auth: true,
    });
    return data.account;
  }
}

export const accountClient = new AccountClient();
