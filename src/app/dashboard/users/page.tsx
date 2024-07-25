import * as React from 'react';
import type { Metadata } from 'next';

import { config } from '@/config';
import UsersListView from '@/components/dashboard/users/UsersListView';

export const metadata = { title: `Customers | Dashboard | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return <UsersListView />;
}
