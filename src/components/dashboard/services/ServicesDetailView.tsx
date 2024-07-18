'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { Box, IconButton, Tooltip, Typography, useTheme } from '@mui/material';
// material-ui
import Stack from '@mui/material/Stack';
import { Copy, Pencil, Trash } from '@phosphor-icons/react';
// third-party
import { ColumnDef } from '@tanstack/react-table';
import useSWR from 'swr';

import { Account } from '@/types/account';
import { Service } from '@/types/service';
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
  const notify = useNotify();
  const theme = useTheme();
  const [data, setData] = useState(blankService);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [globalFilter, setGlobalFilter] = useState('');

  const [deleteOpen, setDeleteOpen] = useState(false);

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
  const handleEditClick = (name: string) => {
    console.log('hanle edit of', name);
  };

  const handleDeleteClick = (name: string) => {
    setDeleteOpen(true);
  };

  const submitDelete = async () => {
    console.log('submit delete');
  };

  const handleCopyClick = (name: string) => {
    console.log('hanle copy of', name);
  };

  const cancelDelete = () => {
    setDeleteOpen(false);
  };

  useEffect(() => {
    handleLoad();
  }, []);

  return (
    <Stack spacing={3}>
      <Typography variant="h4">Service Details</Typography>
      {loading ? (
        <Stack minHeight="40vh" justifyContent={'center'}>
          <CircularLoader />
        </Stack>
      ) : error ? (
        <></>
      ) : (
        <>
          <ServiceDetailForm initialData={data} />
        </>
      )}
    </Stack>
  );
};

export default ServicesDetailView;
