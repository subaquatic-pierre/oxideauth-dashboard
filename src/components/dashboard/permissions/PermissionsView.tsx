'use client';

import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { DeleteFilled, EditFilled, PlusCircleFilled, PlusCircleOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  OutlinedInput,
  Typography,
} from '@mui/material';
// material-ui
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';
// third-party
import { ColumnDef } from '@tanstack/react-table';
import useSWR from 'swr';

import { LIST_PERMISSIONS } from '@/lib/api/endpoints';
// types
import { roleClient } from '@/lib/api/role';
import useNotify from '@/hooks/useNotify';
import CircularLoader from '@/components/CircularLoader';
// project-import
import { IndeterminateCheckbox } from '@/components/third-party/react-table';

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
      notify('New permissions created', 'success');
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
      notify('New permissions created', 'success');
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

  return (
    <Stack spacing={3}>
      {isLoading && (
        <Stack minHeight="40vh" justifyContent={'center'}>
          <CircularLoader />
        </Stack>
      )}
      {!error && (
        <>
          <Stack direction="row" spacing={3}>
            <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
              <Typography variant="h4">Permissions</Typography>
            </Stack>
            <div>
              <Button
                onClick={() => setCreateOpen(true)}
                startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />}
                variant="contained"
              >
                Add
              </Button>
            </div>
          </Stack>
          <PermissionsTable
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
            setDeleteOpen={setDeleteOpen}
            {...{ data, columns }}
          />
        </>
      )}

      {/* Dialogs */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>Are you sure you want to delete this?</DialogTitle>
        <Divider />
        <DialogContent>
          <Stack>
            {Object.keys(rowSelection).map((item, idx) => (
              <Typography key={idx}>{item}</Typography>
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={submitDelete} variant="contained" color="success">
            Yes
          </Button>
          <Button onClick={() => setDeleteOpen(false)} variant="contained" color="error">
            No
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={createOpen} onClose={() => setCreateOpen(false)}>
        <DialogTitle>Create new permissions</DialogTitle>
        <Divider />
        <DialogContent>
          <Stack spacing={2}>
            <Typography>Enter new permissions, enter multiple permissions on new line</Typography>
            <OutlinedInput multiline rows={10} value={formData} onChange={(e) => setFormData(e.target.value)} />
            {Object.keys(rowSelection).map((item, idx) => (
              <Typography key={idx}>{item}</Typography>
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={submitCreate} variant="contained" color="success">
            Create
          </Button>
          <Button
            onClick={() => {
              setFormData('');
              setCreateOpen(false);
            }}
            variant="contained"
            color="error"
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
