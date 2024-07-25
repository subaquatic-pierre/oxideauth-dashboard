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
import { useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import { Account } from '@/types/account';
import { Role } from '@/types/role';
import { Service } from '@/types/service';
import { paths } from '@/paths';
import { accountClient } from '@/lib/api/account';
import { roleClient } from '@/lib/api/role';
// types
import useNotify from '@/hooks/useNotify';
import CircularLoader from '@/components/CircularLoader';
// project-import
import { IndeterminateCheckbox } from '@/components/third-party/react-table';

import ServiceAccountsDetailForm from './ServiceAccountsDetailForm';
import ServiceAccountsDetailFormButtons from './ServiceAccountsDetailFormButtons';
import ServiceAccountsRolesTable from './ServiceAccountsRolesTable';

const blankSa: Account = {
  id: '',
  name: '',
  description: '',
};

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

export type SelectedRoles = { [mapPos: string]: string };

const ServiceAccountsDetailView = () => {
  const { sa: saId } = useParams();
  const isExisting = saId !== 'new';
  const notify = useNotify();
  const router = useRouter();

  const [sa, setSa] = useState<Account>(blankSa);
  const [allRoles, setAllRoles] = useState<Role[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<SelectedRoles>({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const {
    control,
    getValues,
    setValue,
    setError,
    formState: { errors },
  } = useForm<Values>({ defaultValues: blankSa, resolver: zodResolver(schema) });

  const handleSubmit = async () => {
    const formValues = {
      name: getValues('name'),
      description: getValues('description'),
    };

    const selectedRolesIds = Object.values(selectedRoles);

    try {
      if (isExisting) {
        const updatedAccount = await accountClient.updateAccount({ account: saId as string, ...formValues });

        // check if roles changed
        // bind new roles
        if (updatedAccount && updatedAccount.roles) {
          // get roles to be removed
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

          await roleClient.removeRoles({ account: saId as string, roles: toBeRemoved });

          await roleClient.assignRoles({ account: saId as string, roles: toBeAdded });
        }

        notify('Successfully updated service account', 'success');
      } else {
        const email = `${formValues.name.split(' ').join('')}@email.com`;
        const newAccount = await accountClient.createServiceAccount({ ...formValues, email });

        await roleClient.assignRoles({ account: newAccount.id as string, roles: selectedRolesIds });

        notify('Successfully create new service account', 'success');
      }
    } catch (e: any) {
      const message = e.message;
      notify(message, 'error');
      setError('root', { type: 'server', message: message });
    } finally {
      router.push(paths.dashboard.serviceAccounts);
    }
  };

  const handleLoad = async () => {
    if (saId !== 'new') {
      try {
        // get all data
        const sa = await accountClient.describeAccount(saId as string);

        // set all data
        setValue('name', sa.name ?? '');
        setValue('description', sa.description ?? '');
        setSa(sa);
        const currentRoles = sa.roles?.map((el) => el.id) ?? [];

        const selected: SelectedRoles = {};

        for (let i = 0; i < currentRoles.length; i++) {
          selected[i] = currentRoles[i];
        }

        setSelectedRoles(selected);
      } catch (e) {
        setLoadError('There was an error fetching role');
      }
    } else {
      setSa(blankSa);
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
            <IconButton LinkComponent={Link} href={paths.dashboard.serviceAccounts}>
              <SkipBack />
            </IconButton>
          </Tooltip>
        </Box>

        <Typography variant="h4">Service Account Details</Typography>
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
          <ServiceAccountsDetailForm
            control={control}
            errors={errors}
            handleSubmit={handleSubmit}
            getValues={getValues}
          />
          <ServiceAccountsRolesTable
            selectedRoles={selectedRoles}
            setSelectedRoles={setSelectedRoles}
            allRoles={allRoles}
          />
          <ServiceAccountsDetailFormButtons handleSubmit={handleSubmit} />
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

export default ServiceAccountsDetailView;
