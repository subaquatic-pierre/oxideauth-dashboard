import * as React from 'react';
import type { Metadata } from 'next';

import { config } from '@/config';
import { GuestGuard } from '@/components/auth/GuestGuard';
import { Layout } from '@/components/auth/Layout';
import LoadingProfile from '@/components/auth/LoadingProfile';

export const metadata = { title: `Sign in | Auth | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
    <GuestGuard>
      <Layout>
        <LoadingProfile />
      </Layout>
    </GuestGuard>
  );
}
