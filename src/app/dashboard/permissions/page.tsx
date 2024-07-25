import * as React from 'react';
import type { Metadata } from 'next';

import { config } from '@/config';
import PermissionsView from '@/components/dashboard/permissions/PermissionsView';

export const metadata = { title: `Settings | Dashboard | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return <PermissionsView />;
}
