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
// types
import useNotify from 'hooks/useNotify';
import { accountClient } from 'lib/api/account';
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

import { PermsTableRow } from '../permissions/PermissionsView';
import UsersDetailForm from './UsersDetailForm';
import UsersDetailFormButtons from './UsersDetailFormButtons';
import UsersDetailRoleTable from './UsersDetailRolesTable';

const blankAccount: Account = {
  id: '',
  name: '',
  email: '',
  verified: false,
  enabled: true
};

const schema = zod
  .object({
    name: zod.string().min(1, { message: 'Name is required' }),
    email: zod.string().min(1, { message: 'Email is required' }),
    password: zod.string().min(6, { message: 'Password should be at least 6 characters' }),
    confirmPassword: zod.string().min(6, { message: 'Password should be at least 6 characters' })
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'The passwords did not match',
        path: ['confirmPassword']
      });
    }
  });

export type UsersDetailFormSchema = zod.infer<typeof schema>;

export type SelectedRoles = { [mapPos: string]: string };

const UsersDetailView = () => {
  const { user: accountId } = useParams();
  const isExisting = accountId !== 'new';
  const notify = useNotify();
  const router = useRouter();

  const [allRoles, setAllRoles] = useState<Role[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<SelectedRoles>({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const {
    control,
    getValues,
    setValue,
    setError,
    trigger,
    formState: { errors, isValid }
  } = useForm<UsersDetailFormSchema>({
    defaultValues: { ...blankAccount, password: '', confirmPassword: '' },
    resolver: zodResolver(schema)
  });

  const handleSubmit = async () => {
    trigger();
    if (!isValid && !isExisting) {
      return;
    }
    // const permissions: string[] = Object.keys(selectedPerms);
    const formValues = {
      name: getValues('name'),
      email: getValues('email'),
      password: getValues('password'),
      confirmPassword: getValues('confirmPassword')
    };

    const selectedRolesIds = Object.values(selectedRoles);

    try {
      if (isExisting) {
        const updatedAccount = await accountClient.updateAccount({ account: accountId as string, ...formValues });

        // check if permissions changed
        // bind new permissions

        if (updatedAccount && updatedAccount.roles) {
          // get perms to be removed
          const toBeRemoved: string[] = [];
          for (const existingPerm of updatedAccount.roles) {
            if (selectedRolesIds.indexOf(existingPerm.id) === -1) {
              toBeRemoved.push(existingPerm.id);
            }
          }

          const toBeAdded: string[] = [];
          for (const roleId of selectedRolesIds) {
            if (updatedAccount.roles.findIndex((el) => el.id === roleId) === -1) {
              toBeAdded.push(roleId);
            }
          }

          await roleClient.removeRoles({ account: accountId as string, roles: toBeRemoved });

          await roleClient.assignRoles({ account: accountId as string, roles: toBeAdded });
        }

        notify('Successfully updated user account', 'success');
      } else {
        const newAccount = await accountClient.createUserAccount({ ...formValues });

        await roleClient.assignRoles({ account: newAccount.id as string, roles: selectedRolesIds });

        notify('Successfully create new user account', 'success');
      }
    } catch (e: any) {
      const message = e.message;
      notify(message, 'error');
      setError('root', { type: 'server', message: message });
    } finally {
      router.push(paths.dashboard.users);
    }
  };

  const handleLoad = async () => {
    if (accountId !== 'new') {
      try {
        // get all data
        const account = await accountClient.describeAccount(accountId as string);

        // set all data
        setValue('name', account.name ?? '');
        setValue('email', account.email ?? '');
        const currentRoles = account.roles?.map((el) => el.id) ?? [];

        const selected: SelectedRoles = {};

        for (let i = 0; i < currentRoles.length; i++) {
          selected[i] = currentRoles[i];
        }

        setSelectedRoles(selected);
      } catch (e) {
        setLoadError('There was an error fetching account');
      }
    }

    try {
      const allRoles = await roleClient.listRoles();

      setAllRoles(allRoles);
    } catch (e: any) {
      notify(e.message, 'error');
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
            <IconButton LinkComponent={Link} href={paths.dashboard.users}>
              <SkipBack />
            </IconButton>
          </Tooltip>
        </Box>

        <Typography variant="h4">User Account Details</Typography>
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
          <UsersDetailForm control={control} errors={errors} getValues={getValues} />
          <UsersDetailRoleTable selectedRoles={selectedRoles} setSelectedRoles={setSelectedRoles} allRoles={allRoles} />
          <UsersDetailFormButtons handleSubmit={handleSubmit} />
          {!isExisting && errors.root && (
            <Alert severity="error" color="error">
              {errors.root.message}
            </Alert>
          )}
        </>
      )}
    </Stack>
  );
};

export default UsersDetailView;
