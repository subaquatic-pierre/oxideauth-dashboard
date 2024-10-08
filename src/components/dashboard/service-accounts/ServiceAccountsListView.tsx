'use client';

import crypto, { generateKey } from 'crypto';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Box, IconButton, Tooltip, Typography, useTheme } from '@mui/material';
// material-ui
import Stack from '@mui/material/Stack';
import { Copy, Download, Pencil, Trash } from '@phosphor-icons/react';
// third-party
import { ColumnDef } from '@tanstack/react-table';
import CircularLoader from 'components/CircularLoader';
// project-import
import { IndeterminateCheckbox } from 'components/third-party/react-table';
// types
import useNotify from 'hooks/useNotify';
import { accountClient } from 'lib/api/account';
import { LIST_ACCOUNTS, LIST_SERVICES } from 'lib/api/endpoints';
import { paths } from 'paths';
import useSWR from 'swr';
import { Account } from 'types/account';

import ServiceAccountsButtons from './ServiceAccountsButtons';
import ServiceAccountsDialog from './ServiceAccountsDialog';
import ServiceAccountsFilter from './ServiceAccountsFilter';
import ServiceAccountsTable from './ServiceAccountsTable';

const ServiceAccountsListView = () => {
  const notify = useNotify();
  const theme = useTheme();
  const { data: allAccounts, isLoading, error, mutate } = useSWR(LIST_ACCOUNTS + '/sa', accountClient.listAccounts);
  const data = allAccounts?.filter((el) => el.type === 'service');

  const [globalFilter, setGlobalFilter] = useState('');

  const [rowSelection, setRowSelection] = useState({});
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleDownloadClick = async (accountName: string, accountId: string) => {
    const { key } = await accountClient.getServiceAccountSecretKey(accountId);

    // const key = crypto.randomBytes(8).toString('hex');
    const jsonData = {
      serviceAccountName: accountName,
      apiKey: key
    };
    // create file in browser
    const fileName = 'credentials';
    const json = JSON.stringify(jsonData, null, 2);
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
        accessorKey: 'name'
      },
      {
        id: 'email',
        header: 'Email',
        accessorKey: 'email'
      },
      {
        id: 'description',
        header: 'Description',
        cell: ({ row }: any) => {
          return <Box>{row.original.description ?? ''}</Box>;
        }
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
              <Tooltip title="Edit Service Account">
                <IconButton LinkComponent={Link} href={`${paths.dashboard.serviceAccounts}/${row.original.id}`}>
                  <Pencil />
                </IconButton>
              </Tooltip>
              <Tooltip title="Download Credentials">
                <IconButton color="error" onClick={() => handleDownloadClick(row.original.name, row.original.id)}>
                  <Download color={theme.palette.secondary.main} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete Service Account">
                <IconButton color="error" onClick={() => handleDeleteClick(row.original.id)}>
                  <Trash color={theme.palette.error.main} />
                </IconButton>
              </Tooltip>
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
          <Typography variant="h4">Service Accounts</Typography>
          <ServiceAccountsButtons rowSelection={rowSelection} />
          <ServiceAccountsFilter length={data?.length ?? 0} globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
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

export default ServiceAccountsListView;
