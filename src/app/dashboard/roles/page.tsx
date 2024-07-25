import * as React from 'react';
import type { Metadata } from 'next';
import RolesListView from 'components/dashboard/roles/RolesListView';
import { config } from 'config';

export const metadata = { title: `Integrations | Dashboard | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return <RolesListView />;
}
