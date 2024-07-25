import * as React from 'react';
import type { Metadata } from 'next';
import { GuestGuard } from 'components/auth/GuestGuard';
import { Layout } from 'components/auth/Layout';
import { SignUpForm } from 'components/auth/SignUpForm';
import { config } from 'config';

export const metadata = { title: `Sign up | Auth | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
    <Layout>
      <GuestGuard>
        <SignUpForm />
      </GuestGuard>
    </Layout>
  );
}
