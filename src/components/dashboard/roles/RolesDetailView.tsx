'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { Alert, Box, IconButton, Tooltip, Typography, useTheme } from '@mui/material';
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
import { roleClient } from '@/lib/api/role';
import { serviceClient } from '@/lib/api/service';
// types
import useNotify from '@/hooks/useNotify';
import CircularLoader from '@/components/CircularLoader';
// project-import
import { IndeterminateCheckbox } from '@/components/third-party/react-table';

import { RolesDetailForm } from './RolesDetailForm';

const blankService: Service = {
  id: '',
  name: '',
  description: '',
  endpoint: '',
};

const RolesDetailView = () => {
  const { role: roleId } = useParams();
  const [data, setData] = useState(blankService);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const handleLoad = async () => {
    if (roleId !== 'new') {
      try {
        const data = await roleClient.describeRole(roleId as string);
        setData(data);
      } catch (e) {
        setError('There was an error fetching role');
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    handleLoad();
  }, []);

  return (
    <Stack spacing={3}>
      <Typography variant="h4">Role Details</Typography>
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
          <RolesDetailForm initialData={data} />
        </>
      )}
    </Stack>
  );
};

export default RolesDetailView;
