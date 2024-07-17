import * as React from 'react';
import type { Metadata } from 'next';

import { config } from '@/config';
import RolesView from '@/components/dashboard/roles/RolesView';

export const metadata = { title: `Integrations | Dashboard | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return <RolesView />;
}
