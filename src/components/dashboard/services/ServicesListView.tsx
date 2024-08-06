'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Box, IconButton, Tooltip, Typography, useTheme } from '@mui/material';
// material-ui
import Stack from '@mui/material/Stack';
import { Copy, Pencil, Trash } from '@phosphor-icons/react';
// third-party
import { ColumnDef } from '@tanstack/react-table';
import CircularLoader from 'components/CircularLoader';
// types
import useNotify from 'hooks/useNotify';
import { LIST_SERVICES } from 'lib/api/endpoints';
import { serviceClient } from 'lib/api/service';
import { paths } from 'paths';
import useSWR from 'swr';
import { Account } from 'types/account';

// project-import

import ServicesButtons from './ServicesButtons';
import ServicesDialog from './ServicesDialogs';
import ServicesFilter from './ServicesFilter';
import ServicesTable from './ServicesTable';
import { Service } from 'types/service';
import { useAuth } from 'hooks/useAuth';
import { hasPerms } from 'lib/accountPerms';

const ServicesListView = () => {
  const { user } = useAuth();
  const notify = useNotify();
  const theme = useTheme();
  const { data, isLoading, error, mutate } = useSWR(LIST_SERVICES, serviceClient.listServices);
  const [globalFilter, setGlobalFilter] = useState('');

  const [rowSelection, setRowSelection] = useState({});
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleDeleteClick = (name: string) => {
    setRowSelection({ [name]: true });
    setDeleteOpen(true);
  };

  const submitDelete = async () => {
    try {
      const serviceName = Object.keys(rowSelection)[0];
      const _ = await serviceClient.deleteService(serviceName);

      notify(`Successfully deleted ${serviceName} service`, 'success');

      const updated = data?.filter((el) => el.name !== serviceName);
      mutate(updated);
    } catch (e: any) {
      notify(e.message, 'error');
    } finally {
      setRowSelection({});
      setDeleteOpen(false);
    }
  };

  const cancelDelete = () => {
    setRowSelection({});
    setDeleteOpen(false);
  };

  const columns = useMemo<ColumnDef<Service>[]>(
    () => [
      // {
      //   id: 'id',
      //   header: ({ table }) => (
      //     <IndeterminateCheckbox
      //       {...{
      //         checked: table.getIsAllRowsSelected(),
      //         indeterminate: table.getIsSomeRowsSelected(),
      //         onChange: table.getToggleAllRowsSelectedHandler(),
      //       }}
      //     />
      //   ),
      //   cell: ({ row }) => (
      //     <IndeterminateCheckbox
      //       {...{
      //         checked: row.getIsSelected(),
      //         disabled: !row.getCanSelect(),
      //         indeterminate: row.getIsSomeSelected(),
      //         onChange: row.getToggleSelectedHandler(),
      //       }}
      //     />
      //   ),
      //   accessorKey: 'id',
      // },
      {
        id: 'name',
        header: 'Name',
        accessorKey: 'name'
      },
      {
        id: 'description',
        header: 'Description',
        cell: ({ row }: any) => {
          return <Box>{row.original.description ?? ''}</Box>;
        }
      },
      {
        id: 'endpoint',
        header: 'Endpoint',
        accessorKey: 'endpoint'
      },
      {
        id: 'actions',
        header: 'Actions',
        meta: {
          width: 10
        } as any,
        accessorKey: 'id',
        cell: ({ row }: any) => {
          return (
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={0}>
              {hasPerms(user, 'auth.services.update') && (
                <Tooltip title="Edit Service">
                  <IconButton LinkComponent={Link} href={`${paths.dashboard.services}/${row.original.id}`}>
                    <Pencil />
                  </IconButton>
                </Tooltip>
              )}
              {hasPerms(user, 'auth.services.delete') && (
                <Tooltip title="Delete Service">
                  <IconButton color="error" onClick={() => handleDeleteClick(row.original.name)}>
                    <Trash color={theme.palette.error.main} />
                  </IconButton>
                </Tooltip>
              )}
            </Stack>
          );
        }
      }
    ],
    []
  );

  return (
    <Stack spacing={3}>
      {isLoading ? (
        <Stack minHeight="40vh" justifyContent={'center'}>
          <CircularLoader />
        </Stack>
      ) : (
        <>
          <Typography variant="h4">Services</Typography>
          <ServicesButtons rowSelection={rowSelection} />
          <ServicesFilter length={data?.length ?? 0} globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
          <ServicesTable
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
            data={data ?? []}
            columns={columns}
          />
        </>
      )}
      <ServicesDialog
        cancelDelete={cancelDelete}
        setDeleteOpen={setDeleteOpen}
        deleteOpen={deleteOpen}
        submitDelete={submitDelete}
        rowSelection={rowSelection}
      />
    </Stack>
  );
};

export default ServicesListView;
