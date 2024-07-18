import * as React from 'react';
import type { Metadata } from 'next';

import { config } from '@/config';
import UsersView from '@/components/dashboard/users/UsersView';

export const metadata = { title: `Customers | Dashboard | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return <UsersView />;
}
