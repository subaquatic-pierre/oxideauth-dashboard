import * as React from 'react';
import type { Metadata } from 'next';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { AccountDetailsForm } from 'components/dashboard/settings/AccountDetailsForm';
import { Notifications } from 'components/dashboard/settings/Notifications';
import SettingsView from 'components/dashboard/settings/SettingsView';
import { config } from 'config';

export const metadata = { title: `Settings | Dashboard | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return <SettingsView />;
}
