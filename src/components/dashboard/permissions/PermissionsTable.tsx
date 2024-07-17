'use client';

import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { DeleteFilled, EditFilled, PlusCircleFilled, PlusCircleOutlined } from '@ant-design/icons';
import { Button, Card, IconButton, Tooltip, Typography } from '@mui/material';
// material-ui
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useTheme, useThemeProps } from '@mui/system';
// third-party
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  HeaderGroup,
  PaginationState,
  useReactTable,
} from '@tanstack/react-table';
import { LabelKeyObject } from 'react-csv/lib/core';

// types
// project-import
import ScrollX from '@/components/ScrollX';
import {
  CSVExport,
  DebouncedInput,
  Filter,
  IndeterminateCheckbox,
  TablePagination,
} from '@/components/third-party/react-table';

import { PermsTableRow } from './PermissionsView';

// ==============================|| REACT TABLE ||============================== //

interface TableProps {
  data: PermsTableRow[];
  columns: ColumnDef<PermsTableRow>[];
  setDeleteOpen: (open: boolean) => void;
  rowSelection: {};
  setRowSelection: Dispatch<SetStateAction<{}>>;
}

const PermissionsTable: React.FC<TableProps> = ({ data, columns, setDeleteOpen, rowSelection, setRowSelection }) => {
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 50 });

  const theme = useTheme();
  const [globalFilter, setGlobalFilter] = useState('');

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );

  const table = useReactTable({
    data: data.slice(pagination.pageIndex * pagination.pageSize, (pagination.pageIndex + 1) * pagination.pageSize),
    pageCount: Math.ceil(data.length / pagination.pageSize),
    state: {
      globalFilter,
      rowSelection,
      pagination,
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
  });

  let headers: LabelKeyObject[] = [];
  table.getAllColumns().map((columns) => {
    if (typeof columns.columnDef.header === 'string') {
      headers.push({
        label: typeof columns.columnDef.header === 'string' ? columns.columnDef.header : '#',
        // @ts-ignore
        key: columns.columnDef.accessorKey,
      });
    }
  });

  return (
    <Stack spacing={3}>
      <Card sx={{ p: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <DebouncedInput
              value={globalFilter ?? ''}
              onFilterChange={(value) => setGlobalFilter(String(value))}
              placeholder={`Search ${data.length} records...`}
            />
          </Grid>
          {Object.keys(rowSelection).length !== 0 && (
            <Grid item xs={12} md={6} justifyContent={'flex-end'} display={'flex'}>
              {/* Action Buttons in table heading */}
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
                    filename: 'permissions.csv',
                  }}
                />
              </Stack>
            </Grid>
          )}
        </Grid>
      </Card>

      <Card>
        <ScrollX>
          <Stack>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  {table.getHeaderGroups().map((headerGroup: HeaderGroup<any>) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableCell
                          sx={{ ...(header.id === 'id' && { width: 20, ml: 0 }) }}
                          key={header.id}
                          {...header.column.columnDef.meta}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableHead>
                <TableBody
                  sx={{
                    '& .MuiTableRow-root:hover': {
                      backgroundColor: 'transparent',
                    },
                  }}
                >
                  {table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell sx={{ py: 0 }} key={cell.id} {...cell.column.columnDef.meta}>
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
                  getPageCount: table.getPageCount,
                }}
              />
            </Box>
          </Stack>
        </ScrollX>
      </Card>
    </Stack>
  );
};

export default PermissionsTable;
