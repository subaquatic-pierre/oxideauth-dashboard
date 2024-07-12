'use client';

import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';

// material-ui
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Stack from '@mui/material/Stack';
import { Button, DialogContent, IconButton, Input, OutlinedInput, Tooltip, Typography } from '@mui/material';

import { DialogTitle, Dialog, DialogActions } from '@mui/material';

// third-party
import {
  useReactTable,
  getPaginationRowModel,
  ColumnDef,
  HeaderGroup,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  PaginationState
} from '@tanstack/react-table';

// project-import
import ScrollX from 'components/ScrollX';
import MainCard from 'components/MainCard';
import { CSVExport, TablePagination, Filter, DebouncedInput, IndeterminateCheckbox } from 'components/third-party/react-table';

// types
import { TableDataProps } from 'types/table';
import { LabelKeyObject } from 'react-csv/lib/core';
import { createPermissions, deletePermissions, listPermissions } from 'lib/api';
import { DeleteFilled, EditFilled, PlusCircleFilled, PlusCircleOutlined } from '@ant-design/icons';
import { useTheme, useThemeProps } from '@mui/system';
import useSWR from 'swr';
import CircularLoader from 'components/CircularLoader';
import { LIST_PERMISSIONS } from 'lib/endpoints';
import useNotify from 'hooks/useNotify';

// ==============================|| REACT TABLE ||============================== //

interface TableProps {
  data: PermsTableRow[];
  columns: ColumnDef<PermsTableRow>[];
  setCreateOpen: (open: boolean) => void;
  setDeleteOpen: (open: boolean) => void;
  rowSelection: {};
  setRowSelection: Dispatch<SetStateAction<{}>>;
}

const ReactTable: React.FC<TableProps> = ({ data, columns, setDeleteOpen, setCreateOpen, rowSelection, setRowSelection }) => {
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 50 });

  const theme = useTheme();
  const [globalFilter, setGlobalFilter] = useState('');

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize
    }),
    [pageIndex, pageSize]
  );

  const table = useReactTable({
    data: data.slice(pagination.pageIndex * pagination.pageSize, (pagination.pageIndex + 1) * pagination.pageSize),
    pageCount: Math.ceil(data.length / pagination.pageSize),
    state: {
      globalFilter,
      rowSelection,
      pagination
    },
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,

    getRowId: (row) => row.name,
    enableRowSelection: true,
    manualPagination: true,

    debugTable: true
  });

  let headers: LabelKeyObject[] = [];
  table.getAllColumns().map((columns) => {
    if (typeof columns.columnDef.header === 'string') {
      headers.push({
        label: typeof columns.columnDef.header === 'string' ? columns.columnDef.header : '#',
        // @ts-ignore
        key: columns.columnDef.accessorKey
      });
    }
  });

  return (
    <MainCard content={false}>
      <Box p={2}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <DebouncedInput
              value={globalFilter ?? ''}
              onFilterChange={(value) => setGlobalFilter(String(value))}
              placeholder={`Search ${data.length} records...`}
            />
          </Grid>
          <Grid item xs={12} md={6} justifyContent={'flex-end'} display={'flex'}>
            {/* Action Buttons in table heading */}
            {Object.keys(rowSelection).length === 0 ? (
              <Stack spacing={2} direction={{ xs: 'column', md: 'row' }}>
                <Box>
                  <Button size="large" color="success" onClick={() => setCreateOpen(true)} startIcon={<PlusCircleOutlined />}>
                    CREATE
                  </Button>
                </Box>
              </Stack>
            ) : (
              <Stack direction={'row'} alignItems={'center'} spacing={2}>
                <Typography color="text.secondary" variant="body2">
                  Selected: {Object.keys(rowSelection).length}
                </Typography>
                <Box>
                  <Tooltip title="Delete">
                    <IconButton color="error" onClick={() => setDeleteOpen(true)}>
                      <DeleteFilled twoToneColor={theme.palette.error.main} />
                    </IconButton>
                  </Tooltip>
                </Box>
                <CSVExport
                  {...{
                    data:
                      table.getSelectedRowModel().flatRows.map((row) => row.original).length === 0
                        ? table.getRowModel().rows.map((row) => row.original)
                        : table.getSelectedRowModel().flatRows.map((row) => row.original),
                    headers,
                    filename: 'permissions.csv'
                  }}
                />
              </Stack>
            )}
          </Grid>
        </Grid>
      </Box>

      <ScrollX>
        <Stack>
          <TableContainer>
            <Table size="small">
              <TableHead>
                {table.getHeaderGroups().map((headerGroup: HeaderGroup<any>) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableCell sx={{ ...(header.id === 'id' && { width: 20, ml: 0 }) }} key={header.id} {...header.column.columnDef.meta}>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableHead>
              <TableBody
                sx={{
                  '& .MuiTableRow-root:hover': {
                    backgroundColor: 'transparent'
                  }
                }}
              >
                {table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell sx={{ p: 0 }} key={cell.id} {...cell.column.columnDef.meta}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Divider />
          <Box sx={{ p: 2 }}>
            <TablePagination
              {...{
                initialPageSize: pagination.pageSize,
                setPageSize: table.setPageSize,
                setPageIndex: table.setPageIndex,
                getState: table.getState,
                getPageCount: table.getPageCount
              }}
            />
          </Box>
        </Stack>
      </ScrollX>
    </MainCard>
  );
};

// ==============================|| REACT TABLE - PAGINATION ||============================== //

interface PermsTableRow {
  name: string;
}

export default function PermissionsTable() {
  const notify = useNotify();
  const { data: resData, isLoading, error, mutate } = useSWR(LIST_PERMISSIONS, listPermissions);
  const [formData, setFormData] = useState('');
  const [rowSelection, setRowSelection] = useState({});

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  const submitDelete = async () => {
    const permissions = Object.keys(rowSelection).map((el) => el);

    try {
      const removedPermissions = await deletePermissions(permissions);

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
      const updatedData = await createPermissions(permissions);

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
              onChange: table.getToggleAllRowsSelectedHandler()
            }}
          />
        ),
        cell: ({ row }) => (
          <IndeterminateCheckbox
            {...{
              checked: row.getIsSelected(),
              disabled: !row.getCanSelect(),
              indeterminate: row.getIsSomeSelected(),
              onChange: row.getToggleSelectedHandler()
            }}
          />
        )
      },
      {
        id: 'name',
        header: 'Name',
        accessorKey: 'name'
      }
    ],
    []
  );

  const data: PermsTableRow[] = [];

  if (resData) {
    resData.forEach((el) => data.push({ name: el }));
  }

  return (
    <Grid container spacing={3}>
      {isLoading && (
        <Grid item xs={12}>
          <CircularLoader />
        </Grid>
      )}
      {!error && (
        <Grid item xs={12}>
          <ReactTable
            setCreateOpen={setCreateOpen}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
            setDeleteOpen={setDeleteOpen}
            {...{ data, columns }}
          />
        </Grid>
      )}
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
    </Grid>
  );
}
