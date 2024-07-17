'use client';

import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { DeleteFilled, EditFilled, PlusCircleFilled, PlusCircleOutlined } from '@ant-design/icons';
import {
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  OutlinedInput,
  Tooltip,
  Typography,
  useTheme,
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

import { Role } from '@/types/role';
import { Service } from '@/types/service';
import { LIST_PERMISSIONS, LIST_ROLES, LIST_SERVICES } from '@/lib/api/endpoints';
// types
import { roleClient } from '@/lib/api/role';
import useNotify from '@/hooks/useNotify';
import CircularLoader from '@/components/CircularLoader';
// project-import
import { IndeterminateCheckbox } from '@/components/third-party/react-table';

import ServicesTable from '../services/ServicesTable';

const RolesView = () => {
  const theme = useTheme();
  const { data, isLoading, error, mutate } = useSWR(LIST_ROLES, roleClient.listRoles);

  const [formData, setFormData] = useState('');
  const [rowSelection, setRowSelection] = useState({});
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  const handleEditClick = (name: string) => {
    console.log('hanle edit of', name);
  };

  const handleDeleteClick = (name: string[]) => {
    console.log('hanle delete of', name);
  };

  const columns = useMemo<ColumnDef<Role>[]>(
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
        accessorKey: 'id',
      },
      {
        id: 'name',
        header: 'Name',
        accessorKey: 'name',
      },
      {
        id: 'description',
        header: 'Description',
        accessorKey: 'id',
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
              <Tooltip title="Edit">
                <IconButton onClick={() => handleEditClick(row.original.name)}>
                  <EditFilled twoToneColor={theme.palette.error.main} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton color="error" onClick={() => handleDeleteClick(row.original.name)}>
                  <DeleteFilled twoToneColor={theme.palette.error.main} />
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
      {isLoading && (
        <Stack minHeight="40vh" justifyContent={'center'}>
          <CircularLoader />
        </Stack>
      )}
      {!error && (
        <>
          <Stack direction="row" spacing={3}>
            <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
              <Typography variant="h4">Roles</Typography>
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
          <ServicesTable
            handleDeleteClick={() => {}}
            // rowSelection={rowSelection}
            // setRowSelection={setRowSelection}
            // setDeleteOpen={setDeleteOpen}
            data={data ?? []}
            columns={columns}
          />
        </>
      )}
    </Stack>
  );
};

export default RolesView;
