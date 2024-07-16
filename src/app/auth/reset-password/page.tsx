import * as React from 'react';
import type { Metadata } from 'next';

import { config } from '@/config';
import { GuestGuard } from '@/components/auth/guestGuard';
import { Layout } from '@/components/auth/layout';
import { ResetPasswordForm } from '@/components/auth/resetPasswordForm';

export const metadata = { title: `Reset password | Auth | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
    <Layout>
      <GuestGuard>
        <ResetPasswordForm />
      </GuestGuard>
    </Layout>
  );
}
