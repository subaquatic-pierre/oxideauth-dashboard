import * as React from 'react';
import type { Metadata } from 'next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';
import dayjs from 'dayjs';

import { config } from '@/config';
import { IntegrationCard } from '@/components/dashboard/integrations/integrationsCards';
import type { Integration } from '@/components/dashboard/integrations/integrationsCards';
import { CompaniesFilters } from '@/components/dashboard/integrations/integrationsFilters';
import ServicesView from '@/components/dashboard/services/ServicesView';

export const metadata = { title: `Integrations | Dashboard | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return <ServicesView />;
}
