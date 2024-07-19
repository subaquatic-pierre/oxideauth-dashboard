import { Account } from '@/types/account';

import { BaseClient } from './client';
import { DESCRIBE_ACCOUNT, LIST_ACCOUNTS } from './endpoints';

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
}

export const accountClient = new AccountClient();
