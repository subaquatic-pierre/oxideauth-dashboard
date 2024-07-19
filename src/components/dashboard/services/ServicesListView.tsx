'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Box, IconButton, Tooltip, Typography, useTheme } from '@mui/material';
// material-ui
import Stack from '@mui/material/Stack';
import { Copy, Pencil, Trash } from '@phosphor-icons/react';
// third-party
import { ColumnDef } from '@tanstack/react-table';
import useSWR from 'swr';

import { Account } from '@/types/account';
import { paths } from '@/paths';
import { LIST_SERVICES } from '@/lib/api/endpoints';
import { serviceClient } from '@/lib/api/service';
// types
import useNotify from '@/hooks/useNotify';
import CircularLoader from '@/components/CircularLoader';

// project-import

import ServicesButtons from './ServicesButtons';
import ServicesDialog from './ServicesDialogs';
import ServicesFilter from './ServicesFilter';
import ServicesTable from './ServicesTable';

const ServicesListView = () => {
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

  const columns = useMemo<ColumnDef<Account>[]>(
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
        accessorKey: 'name',
      },
      {
        id: 'description',
        header: 'Description',
        cell: ({ row }: any) => {
          return <Box>{row.original.description ?? ''}</Box>;
        },
      },
      {
        id: 'endpoint',
        header: 'Endpoint',
        accessorKey: 'endpoint',
      },
      {
        id: 'actions',
        header: 'Actions',
        meta: {
          width: 10,
        } as any,
        accessorKey: 'id',
        cell: ({ row }: any) => {
          return (
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={0}>
              <Tooltip title="Edit Service">
                <IconButton LinkComponent={Link} href={`${paths.dashboard.services}/${row.original.id}`}>
                  <Pencil />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete Service">
                <IconButton color="error" onClick={() => handleDeleteClick(row.original.name)}>
                  <Trash color={theme.palette.error.main} />
                </IconButton>
              </Tooltip>
            </Stack>
          );
        },
      },
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
