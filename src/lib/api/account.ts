import { Account } from 'types/account';

import { BaseClient } from './client';
import {
  CREATE_ACCOUNT,
  CREATE_SERVICE_ACCOUNT,
  DELETE_ACCOUNT,
  DESCRIBE_ACCOUNT,
  GET_SERVICE_ACCOUNT_SECRET_KEY,
  LIST_ACCOUNTS,
  UPDATE_ACCOUNT,
  UPDATE_SELF,
  DELETE_SELF
} from './endpoints';

interface UpdateSelfParams {
  name: string;
}

interface CreateServiceAccountParams {
  email: string;
  name: string;
  description: string;
}

export interface CreateUserAccountParams {
  name: string;
  email: string;
  password: string;
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
      data: { account: idOrName }
    });
    return data.account;
  }

  async updateAccount(updateParams: UpdateAccountParams): Promise<Account> {
    const data = await super.req<{ account: Account }>({
      endpoint: UPDATE_ACCOUNT,
      method: 'POST',
      data: updateParams
    });
    return data.account;
  }

  async updateSelf(updateParams: UpdateSelfParams): Promise<Account> {
    const data = await super.req<{ account: Account }>({
      endpoint: UPDATE_SELF,
      method: 'POST',
      data: updateParams
    });

    return data.account;
  }

  async deleteSelf(): Promise<{ deleted: boolean }> {
    const data = await super.req<{ deleted: boolean }>({
      endpoint: DELETE_SELF,
      method: 'DELETE'
    });

    return data;
  }

  async deleteAccount(idOrName: string): Promise<boolean> {
    const data = await super.req<{ deleted: boolean }>({
      endpoint: DELETE_ACCOUNT,
      method: 'POST',
      data: { account: idOrName }
    });

    return data.deleted;
  }

  async createServiceAccount(updateParams: CreateServiceAccountParams): Promise<Account> {
    const data = await super.req<{ account: Account }>({
      endpoint: CREATE_SERVICE_ACCOUNT,
      method: 'POST',
      data: updateParams
    });
    return data.account;
  }

  async createUserAccount(createAccountParams: CreateUserAccountParams): Promise<Account> {
    const data = await super.req<{ account: Account }>({
      endpoint: CREATE_ACCOUNT,
      method: 'POST',
      data: createAccountParams
    });
    return data.account;
  }

  async getServiceAccountSecretKey(accountId: string): Promise<{ key: string }> {
    const data = await super.req<{ key: string }>({
      endpoint: GET_SERVICE_ACCOUNT_SECRET_KEY,
      method: 'POST',
      data: { account: accountId }
    });
    return data;
  }
}

export const accountClient = new AccountClient();
