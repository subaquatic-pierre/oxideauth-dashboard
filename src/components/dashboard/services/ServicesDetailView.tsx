'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Alert, Box, IconButton, Tooltip, Typography, useTheme } from '@mui/material';
// material-ui
import Stack from '@mui/material/Stack';
import { Copy, Pencil, Trash } from '@phosphor-icons/react';
import { SkipBack } from '@phosphor-icons/react/dist/ssr';
// third-party
import { ColumnDef } from '@tanstack/react-table';
import useSWR from 'swr';

import { Account } from '@/types/account';
import { Service } from '@/types/service';
import { paths } from '@/paths';
import { accountClient } from '@/lib/api/account';
import { LIST_SERVICES } from '@/lib/api/endpoints';
import { serviceClient } from '@/lib/api/service';
// types
import useNotify from '@/hooks/useNotify';
import CircularLoader from '@/components/CircularLoader';
// project-import
import { IndeterminateCheckbox } from '@/components/third-party/react-table';

import { ServiceDetailForm } from './ServiceDetailForm';
import ServicesButtons from './ServicesButtons';
import ServicesDialog from './ServicesDialogs';
import ServicesFilter from './ServicesFilter';
import ServicesTable from './ServicesTable';

const blankService: Service = {
  id: '',
  name: '',
  description: '',
  endpoint: '',
};

const ServicesDetailView = () => {
  const { service: serviceId } = useParams();
  const [data, setData] = useState(blankService);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const handleLoad = async () => {
    if (serviceId !== 'new') {
      try {
        const data = await serviceClient.describeService(serviceId as string);
        setData(data);
      } catch (e) {
        setError('There was an error fetching service');
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    handleLoad();
  }, []);

  return (
    <Stack spacing={3}>
      <Stack direction={'row'} alignItems={'center'} spacing={1}>
        <Box>
          <Tooltip title="Back">
            <IconButton LinkComponent={Link} href={paths.dashboard.services}>
              <SkipBack />
            </IconButton>
          </Tooltip>
        </Box>

        <Typography variant="h4">Service Details</Typography>
      </Stack>
      {loading ? (
        <Stack minHeight="40vh" justifyContent={'center'}>
          <CircularLoader />
        </Stack>
      ) : error ? (
        <Alert severity="error" color="error">
          {error}
        </Alert>
      ) : (
        <>
          <ServiceDetailForm initialData={data} />
        </>
      )}
    </Stack>
  );
};

export default ServicesDetailView;
