import { Account } from 'types/account';
import type { User } from 'types/user';

import { BaseClient } from './client';
import { DESCRIBE_SELF, LOGIN, REGISTER, RESEND_CONFIRM_LINK, RESET_PASSWORD, UPDATE_PASSWORD } from './endpoints';

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

export interface UpdatePasswordParams {
  password: string;
  token: string;
}

export interface ResendLinkParams {
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
      auth: false,
      method: 'POST',
      data: { name, email, password }
    });

    return { token: data.token, account: data.user };
  }

  async signInWithPassword(params: SignInWithPasswordParams): Promise<{ account: Account; token: string }> {
    const { email, password } = params;

    const data = await super.req<{ token: string; account: Account }>({
      endpoint: LOGIN,
      auth: false,
      method: 'POST',
      data: { email, password }
    });

    return { token: data.token, account: data.account };
  }

  async resetPassword(params: ResetPasswordParams): Promise<{ success: boolean }> {
    const { email } = params;

    // TODO: update redirect url which is sent in email to user
    // will need to be public url
    const redirectUrl = `${process.env.NEXT_PUBLIC_CLIENT_ENDPOINT}/auth/update-password`;

    const data = await super.req<{ success: boolean }>({
      endpoint: RESET_PASSWORD,
      auth: false,
      method: 'POST',
      data: { email, redirectUrl }
    });

    return { success: data.success };
  }

  async updatePassword(params: UpdatePasswordParams): Promise<{ account: Account }> {
    const { password, token } = params;

    // TODO: update redirect url which is sent in email to user
    // will need to be public url

    const data = await super.req<{ account: Account }>({
      endpoint: UPDATE_PASSWORD,
      method: 'POST',
      auth: false,
      data: { password, token }
    });
    return { account: data.account };
  }

  async getUser(): Promise<Account> {
    const data = await super.req<{ account: Account }>({
      endpoint: DESCRIBE_SELF
    });

    return data.account;
  }

  async resendLink(params: ResendLinkParams): Promise<{ success: boolean }> {
    const { email } = params;
    const data = await super.req<{ success: boolean }>({
      endpoint: RESEND_CONFIRM_LINK,
      auth: false,
      method: 'POST',
      data: { email }
    });

    return { success: data.success };
  }

  async signOut(): Promise<{}> {
    localStorage.removeItem('token');

    return {};
  }
}

export const authClient = new AuthClient();
