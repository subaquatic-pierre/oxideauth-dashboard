import { Account } from '@/types/account';
import type { User } from '@/types/user';

import { BaseClient } from './client';
import { DESCRIBE_SELF, LOGIN, REGISTER } from './endpoints';

function generateToken(): string {
  const arr = new Uint8Array(12);
  window.crypto.getRandomValues(arr);
  return Array.from(arr, (v) => v.toString(16).padStart(2, '0')).join('');
}

export interface SignUpParams {
  name: string;
  email: string;
  password: string;
}

export interface SignInWithPasswordParams {
  email: string;
  password: string;
}

export interface ResetPasswordParams {
  email: string;
}

class AuthClient extends BaseClient {
  constructor() {
    super();
  }

  async signUp(params: SignUpParams): Promise<{ token: string; account: Account }> {
    const { name, email, password } = params;

    const data = await super.req<{ token: string; user: Account }>({
      endpoint: REGISTER,
      method: 'POST',
      data: { name, email, password },
    });

    localStorage.setItem('token', data.token);

    return { token: data.token, account: data.user };
  }

  async signInWithPassword(params: SignInWithPasswordParams): Promise<{ token: string }> {
    const { email, password } = params;

    const data = await super.req<{ token: string }>({ endpoint: LOGIN, method: 'POST', data: { email, password } });

    localStorage.setItem('token', data.token);

    return { token: data.token };
  }

  async resetPassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Password reset not implemented' };
  }

  async updatePassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Update reset not implemented' };
  }

  async getUser(): Promise<Account> {
    const data = await super.req<{ account: Account }>({
      endpoint: DESCRIBE_SELF,
      auth: true,
    });

    return data.account;
  }

  async signOut(): Promise<{}> {
    localStorage.removeItem('token');

    return {};
  }
}

export const authClient = new AuthClient();
