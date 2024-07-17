import { Account } from '@/types/account';

import { BaseClient } from './client';
import { DESCRIBE_ACCOUNT, LIST_ACCOUNTS } from './endpoints';

class AccountClient extends BaseClient {
  async listAccounts(): Promise<Account[]> {
    const data = await this.req<{ accounts: Account[] }>({ endpoint: LIST_ACCOUNTS });
    return data.accounts;
  }

  async describeAccount(id_or_name: string): Promise<Account> {
    const data = await this.req<{ account: Account }>({
      endpoint: DESCRIBE_ACCOUNT,
      method: 'POST',
      data: { account: id_or_name },
    });
    return data.account;
  }
}

export const accountClient = new AccountClient();
