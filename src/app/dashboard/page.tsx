import * as React from 'react';
import type { Metadata } from 'next';
import Grid from '@mui/material/Unstable_Grid2';
import OverView from 'components/dashboard/overview/OverView';
import { config } from 'config';
import dayjs from 'dayjs';

export const metadata = { title: `Overview | Dashboard | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return <OverView />;
}
