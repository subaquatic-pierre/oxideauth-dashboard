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
import { useForm } from 'react-hook-form';
import useSWR from 'swr';
import { z as zod } from 'zod';

import { Account } from '@/types/account';
import { Role } from '@/types/role';
import { Service } from '@/types/service';
import { paths } from '@/paths';
import { accountClient } from '@/lib/api/account';
import { LIST_PERMISSIONS, LIST_SERVICES } from '@/lib/api/endpoints';
import { roleClient } from '@/lib/api/role';
import { serviceClient } from '@/lib/api/service';
// types
import useNotify from '@/hooks/useNotify';
import CircularLoader from '@/components/CircularLoader';
// project-import
import { IndeterminateCheckbox } from '@/components/third-party/react-table';

import { PermsTableRow } from '../permissions/PermissionsView';
import { RolesDetailForm } from './RolesDetailForm';
import RolesDetailsFormButtons from './RolesDetailsFormButtons';
import RolesPermsTable from './RolesPermsTable';

const blankRole: Role = {
  id: '',
  name: '',
  description: '',
  permissions: [],
};

const schema = zod.object({
  name: zod.string().min(1, { message: 'Name is required' }),
  description: zod.string(),
});

export type Values = zod.infer<typeof schema>;

const RolesDetailView = () => {
  const { role: roleId } = useParams();
  const isExisting = roleId !== 'new';
  const notify = useNotify();
  const router = useRouter();

  const [role, setRole] = useState(blankRole);
  const [allPerms, setAllPerms] = useState<PermsTableRow[]>([]);
  const [selectedPerms, setSelectedPerms] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const {
    control,
    getValues,
    setValue,
    setError,
    formState: { errors },
  } = useForm<Values>({ defaultValues: blankRole, resolver: zodResolver(schema) });

  const handleSubmit = async () => {
    const permissions: string[] = Object.keys(selectedPerms);
    const formValues = {
      name: getValues('name'),
      description: getValues('description'),
    };

    try {
      if (isExisting) {
        const updatedRole = await roleClient.updateRole({ role: roleId as string, ...formValues });

        // check if permissions changed
        // bind new permissions

        if (updatedRole) {
          // get perms to be removed
          const toBeRemoved: string[] = [];
          for (const existingPerm of updatedRole.permissions) {
            if (permissions.indexOf(existingPerm) === -1) {
              toBeRemoved.push(existingPerm);
            }
          }

          const toBeAdded: string[] = [];
          for (const perm of permissions) {
            if (role.permissions.indexOf(perm) === -1) {
              toBeAdded.push(perm);
            }
          }

          await roleClient.removePermissions({ role: roleId as string, permissions: toBeRemoved });

          await roleClient.assignPermissions({ role: roleId as string, permissions: toBeAdded });
        }

        notify('Successfully updated role', 'success');
      } else {
        const res = await roleClient.createRole({ ...formValues, permissions });

        notify('Successfully create new role', 'success');
      }
    } catch (e: any) {
      const message = e.message;
      notify(message, 'error');
      setError('root', { type: 'server', message: message });
    } finally {
      router.push(paths.dashboard.roles);
    }
  };

  const handleLoad = async () => {
    if (roleId !== 'new') {
      try {
        // get all data
        const role = await roleClient.describeRole(roleId as string);

        // set all data
        setValue('name', role.name ?? '');
        setValue('description', role.description ?? '');
        setRole(role);

        const selected = role.permissions?.reduce((obj: { [key: string]: boolean }, cur) => {
          obj[cur] = true;
          return obj;
        }, {});

        if (selected) {
          setSelectedPerms(selected);
        }
      } catch (e) {
        setLoadError('There was an error fetching role');
      }
    } else {
      setRole(blankRole);
    }

    try {
      const allPerms = await roleClient.listPermissions();

      const data: PermsTableRow[] = [];

      if (allPerms) {
        allPerms.forEach((el) => data.push({ name: el }));
      }
      setAllPerms(data);
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
            <IconButton LinkComponent={Link} href={paths.dashboard.roles}>
              <SkipBack />
            </IconButton>
          </Tooltip>
        </Box>

        <Typography variant="h4">Role Details</Typography>
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
          <RolesDetailForm control={control} errors={errors} handleSubmit={handleSubmit} getValues={getValues} />
          <RolesPermsTable selectedPerms={selectedPerms} setSelectedPerms={setSelectedPerms} allPerms={allPerms} />
          <RolesDetailsFormButtons handleSubmit={handleSubmit} />
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

export default RolesDetailView;
