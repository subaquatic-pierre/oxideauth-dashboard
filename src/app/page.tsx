import * as React from 'react';
import type { Metadata } from 'next';
import { GuestGuard } from 'components/auth/GuestGuard';
import { Layout } from 'components/auth/Layout';
import { SignInForm } from 'components/auth/SignInForm';
import { config } from 'config';
import { IndexPage } from 'components/core/IndexPage';

export const metadata = { title: `OxideAuth | Centralized Auth` } satisfies Metadata;

export default function Page() {
  return (
    <Layout>
      <IndexPage />
    </Layout>
  );
}
