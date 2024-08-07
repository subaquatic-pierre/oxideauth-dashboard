'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Box, IconButton, Tooltip, Typography, useTheme } from '@mui/material';
// material-ui
import Stack from '@mui/material/Stack';
import { Copy, Pencil, SkipBack, Trash } from '@phosphor-icons/react';
// third-party
import { ColumnDef } from '@tanstack/react-table';
import CircularLoader from 'components/CircularLoader';
// project-import
import { IndeterminateCheckbox } from 'components/third-party/react-table';
import { useAuth } from 'hooks/useAuth';
// types
import useNotify from 'hooks/useNotify';
import { accountClient } from 'lib/api/account';
import { authClient } from 'lib/api/auth';
import { LIST_PERMISSIONS, LIST_SERVICES } from 'lib/api/endpoints';
import { roleClient } from 'lib/api/role';
import { serviceClient } from 'lib/api/service';
import { paths } from 'paths';
import { useForm } from 'react-hook-form';
import useSWR from 'swr';
import { Account } from 'types/account';
import { Role } from 'types/role';
import { Service } from 'types/service';
import { z as zod } from 'zod';

import SettingsForm from './SettingsForm';
import SettingsFormButtons from './SettingsFormButtons';
import SettingsRolesTable from './SettingsRolesTable';
import SettingsDialog from './SettingsDialog';

const schema = zod.object({
  name: zod.string().min(1, { message: 'Name is required' }),
  email: zod.string().min(1, { message: 'Email is required' })
});

export type SettingsFormSchema = zod.infer<typeof schema>;

const SettingsView = () => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { user: account, checkSession } = useAuth();
  const notify = useNotify();
  const router = useRouter();

  const [activeRoles, setActiveRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const {
    control,
    getValues,
    setValue,
    setError,
    trigger,
    formState: { errors, isValid }
  } = useForm<SettingsFormSchema>({
    defaultValues: { ...account },
    resolver: zodResolver(schema)
  });

  const handleDeleteSelf = async () => {
    await accountClient.deleteSelf();
    checkSession();
  };

  const handleSubmit = async () => {
    trigger();
    if (!isValid) {
      return;
    }
    const formValues = {
      name: getValues('name')
    };

    try {
      await accountClient.updateSelf(formValues);
      notify('Update success', 'success');
      checkSession();
    } catch (e: any) {
      const message = e.message;
      notify(message, 'error');
      setError('root', { type: 'server', message: message });
    } finally {
      router.refresh();
    }
  };

  const handleLoad = async () => {
    try {
      const account = await authClient.getUser();
      setValue('name', account?.name ?? '');
      setValue('email', account?.email ?? '');

      setActiveRoles(account.roles ?? []);
    } catch (e) {
      setLoadError('There was an error fetching account');
    }

    setLoading(false);
  };

  useEffect(() => {
    handleLoad();
  }, []);

  return (
    <Stack spacing={3}>
      <Stack direction={'row'} alignItems={'center'} spacing={1}>
        <Typography variant="h4">Settings</Typography>
      </Stack>
      {loading ? (
        <Stack minHeight="40vh" justifyContent={'center'}>
          <CircularLoader />
        </Stack>
      ) : loadError ? (
        <Alert severity="error" color="error">
          {loadError}
        </Alert>
      ) : (
        <>
          <SettingsForm control={control} errors={errors} getValues={getValues} />
          <SettingsRolesTable selectedRoles={activeRoles} />
          <SettingsFormButtons handleSubmit={handleSubmit} openDeleteDialog={() => setDeleteDialogOpen(true)} />
          {errors.root && (
            <Alert severity="error" color="error">
              {errors.root.message}
            </Alert>
          )}
          <SettingsDialog setDeleteOpen={setDeleteDialogOpen} deleteOpen={deleteDialogOpen} submitDelete={handleDeleteSelf} />
        </>
      )}
    </Stack>
  );
};

export default SettingsView;
