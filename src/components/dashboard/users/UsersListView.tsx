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
import { accountClient } from '@/lib/api/account';
import { LIST_ACCOUNTS, LIST_SERVICES } from '@/lib/api/endpoints';
// types
import useNotify from '@/hooks/useNotify';
import CircularLoader from '@/components/CircularLoader';
// project-import
import { IndeterminateCheckbox } from '@/components/third-party/react-table';

import UsersButtons from './UsersButtons';
import UsersDialog from './UsersDialogs';
import UsersFilter from './UsersFilter';
import UsersTable from './UsersTable';

const UsersListView = () => {
  const notify = useNotify();
  const theme = useTheme();
  const { data: allAccounts, isLoading, error, mutate } = useSWR(LIST_ACCOUNTS, accountClient.listAccounts);
  const data = allAccounts?.filter((el) => el.type === 'user');
  const [globalFilter, setGlobalFilter] = useState('');

  const [rowSelection, setRowSelection] = useState({});
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleDeleteClick = (name: string) => {
    setRowSelection({ [name]: true });
    setDeleteOpen(true);
  };

  const submitDelete = async () => {
    try {
      const accountId = Object.keys(rowSelection)[0];
      const accountName = data?.filter((el) => el.id === accountId)[0].name;
      const _ = await accountClient.deleteAccount(accountId);

      notify(`Successfully deleted ${accountName} account`, 'success');

      const updated = data?.filter((el) => el.name !== accountName);

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
        id: 'email',
        header: 'Email',
        accessorKey: 'email',
      },
      // {
      //   id: 'description',
      //   header: 'Description',
      //   cell: ({ row }: any) => {
      //     return <Box>{row.original.description ?? ''}</Box>;
      //   },
      // },
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
              <Tooltip title="Edit User">
                <IconButton LinkComponent={Link} href={`${paths.dashboard.users}/${row.original.id}`}>
                  <Pencil />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete User Account">
                <IconButton color="error" onClick={() => handleDeleteClick(row.original.id)}>
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
          <Typography variant="h4">User Accounts</Typography>
          <UsersButtons rowSelection={rowSelection} />
          <UsersFilter length={data?.length ?? 0} globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
          <UsersTable
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
            data={data ?? []}
            columns={columns}
          />
        </>
      )}
      <UsersDialog
        allAccounts={data ?? []}
        cancelDelete={cancelDelete}
        setDeleteOpen={setDeleteOpen}
        deleteOpen={deleteOpen}
        submitDelete={submitDelete}
        rowSelection={rowSelection}
      />
    </Stack>
  );
};

export default UsersListView;
