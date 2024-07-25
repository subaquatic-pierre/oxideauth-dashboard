import * as React from 'react';
import type { Metadata } from 'next';
import ConfirmAccount from 'components/auth/ConfirmAccount';
import { GuestGuard } from 'components/auth/GuestGuard';
import { Layout } from 'components/auth/Layout';
import { config } from 'config';

export const metadata = { title: `Sign in | Auth | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
    <GuestGuard>
      <Layout>
        <ConfirmAccount />
      </Layout>
    </GuestGuard>
  );
}
