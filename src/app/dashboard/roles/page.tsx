import * as React from 'react';
import type { Metadata } from 'next';

import { config } from '@/config';
import RolesListView from '@/components/dashboard/roles/RolesListView';

export const metadata = { title: `Integrations | Dashboard | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return <RolesListView />;
}
