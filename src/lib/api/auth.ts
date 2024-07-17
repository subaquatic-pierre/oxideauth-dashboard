import { Account } from '@/types/account';
import type { User } from '@/types/user';

import { BaseClient } from './client';
import { DESCRIBE_SELF, LOGIN } from './endpoints';

function generateToken(): string {
  const arr = new Uint8Array(12);
  window.crypto.getRandomValues(arr);
  return Array.from(arr, (v) => v.toString(16).padStart(2, '0')).join('');
}

const user = {
  id: 'USR-000',
  avatar: '/assets/avatar.png',
  firstName: 'Sofia',
  lastName: 'Rivers',
  email: 'sofia@devias.io',
} satisfies User;

export interface SignUpParams {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface SignInWithOAuthParams {
  provider: 'google' | 'discord';
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

  async signUp(_: SignUpParams): Promise<{ error?: string }> {
    // Make API request

    // We do not handle the API, so we'll just generate a token and store it in localStorage.
    const token = generateToken();
    localStorage.setItem('custom-auth-token', token);

    return {};
  }

  async signInWithOAuth(_: SignInWithOAuthParams): Promise<{ error?: string }> {
    return { error: 'Social authentication not implemented' };
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
