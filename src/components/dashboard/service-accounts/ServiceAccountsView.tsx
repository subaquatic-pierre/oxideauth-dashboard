'use client';

import crypto, { generateKey } from 'crypto';

import { useMemo, useState } from 'react';
import { Box, IconButton, Tooltip, Typography, useTheme } from '@mui/material';
// material-ui
import Stack from '@mui/material/Stack';
import { Copy, Download, Pencil, Trash } from '@phosphor-icons/react';
// third-party
import { ColumnDef } from '@tanstack/react-table';
import useSWR from 'swr';

import { Account } from '@/types/account';
import { accountClient } from '@/lib/api/account';
import { LIST_ACCOUNTS, LIST_SERVICES } from '@/lib/api/endpoints';
// types
import useNotify from '@/hooks/useNotify';
import CircularLoader from '@/components/CircularLoader';
// project-import
import { IndeterminateCheckbox } from '@/components/third-party/react-table';

import ServiceAccountsButtons from './ServiceAccountsButtons';
import ServiceAccountsDialog from './ServiceAccountsDialog';
import ServiceAccountsFilter from './ServiceAccountsFilter';
import ServiceAccountsTable from './ServiceAccountsTable';

const ServiceAccountsView = () => {
  const notify = useNotify();
  const theme = useTheme();
  const { data, isLoading, error, mutate } = useSWR(LIST_ACCOUNTS + '/sa', accountClient.listAccounts);
  const [globalFilter, setGlobalFilter] = useState('');

  const [rowSelection, setRowSelection] = useState({});
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleEditClick = (name: string) => {
    console.log('hanle edit of', name);
  };

  const handleDownloadClick = (name: string) => {
    const key = crypto.randomBytes(8).toString('hex');
    const data = {
      serviceAccountName: name,
      apiKey: key,
    };
    // create file in browser
    const fileName = 'credentials';
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const href = URL.createObjectURL(blob);

    // create "a" HTLM element with href to file
    const link = document.createElement('a');
    link.href = href;
    link.download = fileName + '.json';
    document.body.appendChild(link);
    link.click();

    // clean up "a" element & remove ObjectURL
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  };

  const handleDeleteClick = (name: string) => {
    setRowSelection({ [name]: true });
    setDeleteOpen(true);
  };

  const submitDelete = async () => {
    console.log('submit delete');
  };

  const handleCopyClick = (name: string) => {
    console.log('hanle copy of', name);
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
      {
        id: 'description',
        header: 'Description',
        cell: ({ row }: any) => {
          return <Box>{row.original.description ?? ''}</Box>;
        },
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
              <Tooltip title="Edit Role">
                <IconButton onClick={() => handleEditClick(row.original.name)}>
                  <Pencil />
                </IconButton>
              </Tooltip>
              <Tooltip title="Download Credentials">
                <IconButton color="error" onClick={() => handleDownloadClick(row.original.name)}>
                  <Download color={theme.palette.secondary.main} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete Role">
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
          <Typography variant="h4">Service Accounts</Typography>
          <ServiceAccountsButtons rowSelection={rowSelection} />
          <ServiceAccountsFilter
            length={data?.length ?? 0}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
          />
          <ServiceAccountsTable
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
            data={data?.filter((el) => el.type === 'service') ?? []}
            // data={data?.filter((el) => el.type === 'service') ?? []}
            columns={columns}
          />
        </>
      )}
      <ServiceAccountsDialog
        cancelDelete={cancelDelete}
        setDeleteOpen={setDeleteOpen}
        deleteOpen={deleteOpen}
        submitDelete={submitDelete}
        rowSelection={rowSelection}
      />
    </Stack>
  );
};

export default ServiceAccountsView;
