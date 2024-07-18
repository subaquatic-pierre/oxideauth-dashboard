'use client';

import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { Box, IconButton, Tooltip, Typography, useTheme } from '@mui/material';
// material-ui
import Stack from '@mui/material/Stack';
import { Copy, Pencil, Trash } from '@phosphor-icons/react';
import { ColumnDef } from '@tanstack/react-table';
import useSWR from 'swr';

import { Role } from '@/types/role';
import { LIST_ROLES } from '@/lib/api/endpoints';
// types
import { roleClient } from '@/lib/api/role';
import CircularLoader from '@/components/CircularLoader';

import RolesButtons from './RolesButtons';
import RolesDialogs from './RolesDialogs';
import RowFilter from './RolesFilter';
import RolesTable from './RolesTable';

const RolesView = () => {
  const theme = useTheme();
  const { data, isLoading, error, mutate } = useSWR(LIST_ROLES, roleClient.listRoles);

  const [rowSelection, setRowSelection] = useState({});
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [globalFilter, setGlobalFilter] = useState('');

  const handleEditClick = (name: string) => {
    console.log('hanle edit of', name);
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

  const columns = useMemo<ColumnDef<Role>[]>(
    () => [
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
              <Tooltip title="Copy Role">
                <IconButton color="error" onClick={() => handleCopyClick(row.original.name)}>
                  <Copy color={theme.palette.secondary.main} />
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
          <Typography variant="h4">Roles</Typography>
          <RolesButtons rowSelection={rowSelection} setDeleteOpen={setDeleteOpen} />
          <RowFilter globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} length={data?.length ?? 0} />
          <RolesTable
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
            data={data ?? []}
            handleCopyClick={handleCopyClick}
            columns={columns}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
          />
        </>
      )}
      <RolesDialogs
        cancelDelete={cancelDelete}
        setDeleteOpen={setDeleteOpen}
        deleteOpen={deleteOpen}
        submitDelete={submitDelete}
        rowSelection={rowSelection}
      />
    </Stack>
  );
};

export default RolesView;
