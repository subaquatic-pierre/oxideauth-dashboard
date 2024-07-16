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
import { Button, IconButton, Tooltip, Typography } from '@mui/material';

// third-party
import {
  useReactTable,
  getPaginationRowModel,
  ColumnDef,
  HeaderGroup,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedMinMaxValues,
  getFacetedUniqueValues,
  PaginationState
} from '@tanstack/react-table';

// project-import
import ScrollX from 'components/ScrollX';
import MainCard from 'components/MainCard';
import { CSVExport, TablePagination, Filter, DebouncedInput, IndeterminateCheckbox } from 'components/third-party/react-table';

// types
import { LabelKeyObject } from 'react-csv/lib/core';
import { listPermissions, listRoles } from 'lib/api';
import { CopyOutlined, DeleteFilled, EditFilled, PlusCircleOutlined } from '@ant-design/icons';
import { useTheme, useThemeProps } from '@mui/system';
import { Role } from 'types/role';

// ==============================|| REACT TABLE ||============================== //

interface TableProps {
  data: Role[];
  columns: ColumnDef<Role>[];
  setDeleteOpen: (open: boolean) => void;
  rowSelection: {};
  setRowSelection: Dispatch<SetStateAction<{}>>;
  handleCopyClick: () => void;
  top?: boolean;
}

const ReactTable: React.FC<TableProps> = ({ data, columns, top, setDeleteOpen, handleCopyClick, setRowSelection, rowSelection }) => {
  const theme = useTheme();
  const [globalFilter, setGlobalFilter] = useState('');
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 50 });

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
      rowSelection
    },
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,

    getRowId: (row) => row.id,
    enableRowSelection: true,
    manualPagination: true
  });

  let headers: LabelKeyObject[] = [];
  table.getAllColumns().map((columns) => {
    headers.push({
      label: typeof columns.columnDef.header === 'string' ? columns.columnDef.header : '#',
      // @ts-ignore
      key: columns.columnDef.accessorKey
    });
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
            {Object.keys(rowSelection).length === 1 ? (
              <Stack spacing={2} direction={{ xs: 'column', md: 'row' }}>
                <Box>
                  <Button size="large" color="success" onClick={handleCopyClick} startIcon={<CopyOutlined />}>
                    CREATE FROM SELECTED
                  </Button>
                </Box>
              </Stack>
            ) : Object.keys(rowSelection).length > 1 ? (
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
                    filename: 'roles.csv'
                  }}
                />
              </Stack>
            ) : (
              <Stack spacing={2} direction={{ xs: 'column', md: 'row' }}>
                <Box>
                  <Button size="large" color="success" onClick={handleCopyClick} startIcon={<PlusCircleOutlined />}>
                    CREATE
                  </Button>
                </Box>
              </Stack>
            )}
          </Grid>
        </Grid>
      </Box>

      <ScrollX>
        <Stack>
          <TableContainer>
            <Table>
              <TableHead>
                {table.getHeaderGroups().map((headerGroup: HeaderGroup<any>) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableCell sx={{ ...(header.id === 'id' && { width: 20 }) }} key={header.id} {...header.column.columnDef.meta}>
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
                    {row.getVisibleCells().map((cell) => {
                      if (Object.keys(rowSelection).length > 0 && cell.column.id === 'actions') {
                        return <TableCell key={cell.id}></TableCell>;
                      }
                      return (
                        <TableCell key={cell.id} {...cell.column.columnDef.meta}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      );
                    })}
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

export default function RolesTable() {
  const theme = useTheme();
  const [data, setData] = useState<Role[]>([]);
  const [rowSelection, setRowSelection] = useState({});

  const [deleteOpen, setDeleteOpen] = useState(false);

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
        ),
        accessorKey: 'id'
      },
      {
        id: 'name',
        header: 'Name',
        accessorKey: 'name'
      },
      {
        id: 'description',
        header: 'Description',
        accessorKey: 'id',
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
        }
      }
    ],
    []
  );

  const handleLoad = async () => {
    const roles = await listRoles();

    setData(roles);
  };

  const handleCopyClick = () => {};

  useEffect(() => {
    handleLoad();
  }, []);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <ReactTable
          handleCopyClick={handleCopyClick}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
          setDeleteOpen={setDeleteOpen}
          {...{ data, columns }}
        />
      </Grid>
    </Grid>
  );
}
