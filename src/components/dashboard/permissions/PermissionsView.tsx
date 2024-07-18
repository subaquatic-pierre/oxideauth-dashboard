'use client';

import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { Typography } from '@mui/material';
// material-ui
import Stack from '@mui/material/Stack';
import { ColumnDef } from '@tanstack/react-table';
import useSWR from 'swr';

import { LIST_PERMISSIONS } from '@/lib/api/endpoints';
// types
import { roleClient } from '@/lib/api/role';
import useNotify from '@/hooks/useNotify';
import CircularLoader from '@/components/CircularLoader';
// project-import
import { IndeterminateCheckbox } from '@/components/third-party/react-table';

import PermissionsButtons from './PermissionsButtons';
import PermissionsDialogs from './PermissionsDialogs';
import PermissionsFilter from './PermissionsFilter';
import PermissionsTable from './PermissionsTable';

export interface PermsTableRow {
  name: string;
}

export default function PermissionsView() {
  const notify = useNotify();
  const { data: resData, isLoading, error, mutate } = useSWR(LIST_PERMISSIONS, roleClient.listPermissions);

  const [formData, setFormData] = useState('');
  const [rowSelection, setRowSelection] = useState({});
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [globalFilter, setGlobalFilter] = useState('');

  const submitDelete = async () => {
    const permissions = Object.keys(rowSelection).map((el) => el);

    try {
      const removedPermissions = await roleClient.deletePermissions(permissions);

      mutate();
      if (removedPermissions && resData) {
        const updated = [...resData];
        for (const removed of removedPermissions) {
          updated.splice(updated.indexOf(removed), 1);
        }
      } else {
        notify(`There was an error ${error}`, 'error');
      }
      notify('Permissions deleted', 'success');
    } catch (e: any) {
      console.log(e);
      notify(e?.data?.message ?? 'There was an error', 'error');
    }

    setDeleteOpen(false);
    setRowSelection({});

    try {
    } catch (e: any) {
      console.log(e);
      notify(e?.data?.message ?? `There was an error, ${error}`, 'error');
    }
  };

  const submitCreate = async () => {
    // TODO: validate form string format and new line formats
    const permissions = formData.split('\n').filter((el) => el.length > 0);

    try {
      const updatedData = await roleClient.createPermissions(permissions);

      if (updatedData && resData) {
        mutate([...resData, ...updatedData]);
      } else {
        notify(`There was an error ${error}`, 'error');
      }
      notify('Permissions created', 'success');
    } catch (e: any) {
      console.log(e);
      notify(e?.data?.message ?? 'There was an error', 'error');
    }

    setFormData('');
    setCreateOpen(false);
  };

  const columns = useMemo<ColumnDef<PermsTableRow>[]>(
    () => [
      {
        id: 'id',
        header: ({ table }) => (
          <IndeterminateCheckbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler(),
            }}
          />
        ),
        cell: ({ row }) => (
          <IndeterminateCheckbox
            {...{
              checked: row.getIsSelected(),
              disabled: !row.getCanSelect(),
              indeterminate: row.getIsSomeSelected(),
              onChange: row.getToggleSelectedHandler(),
            }}
          />
        ),
      },
      {
        id: 'name',
        header: 'Name',
        accessorKey: 'name',
      },
    ],
    []
  );

  const data: PermsTableRow[] = [];

  if (resData) {
    resData.forEach((el) => data.push({ name: el }));
  }

  useEffect(() => {
    // if (error) {
    //   notify(error.message, 'error');
    // }
  }, [error, data, isLoading]);

  return (
    <Stack spacing={3}>
      {isLoading ? (
        <Stack minHeight="40vh" justifyContent={'center'}>
          <CircularLoader />
        </Stack>
      ) : (
        <>
          <Typography variant="h4">Permissions</Typography>
          <PermissionsButtons setCreateOpen={setCreateOpen} rowSelection={rowSelection} setDeleteOpen={setDeleteOpen} />
          <PermissionsFilter
            rowSelection={rowSelection}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
            length={data.length}
          />
          <PermissionsTable
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
            data={data}
            columns={columns}
          />
        </>
      )}

      {/* Dialogs */}
      <PermissionsDialogs
        rowSelection={rowSelection}
        formData={formData}
        setFormData={setFormData}
        createOpen={createOpen}
        setCreateOpen={setCreateOpen}
        deleteOpen={deleteOpen}
        setDeleteOpen={setDeleteOpen}
        submitCreate={submitCreate}
        submitDelete={submitDelete}
      />
    </Stack>
  );
}
