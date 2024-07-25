import * as React from 'react';
import type { Metadata } from 'next';
import { GuestGuard } from 'components/auth/GuestGuard';
import { Layout } from 'components/auth/Layout';
import { ResetPasswordForm } from 'components/auth/ResetPasswordForm';
import { config } from 'config';

export const metadata = { title: `Reset password | Auth | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
    <Layout>
      <ResetPasswordForm />
    </Layout>
  );
}
