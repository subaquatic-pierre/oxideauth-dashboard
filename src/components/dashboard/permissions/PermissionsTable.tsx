'use client';

import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { Button, Card, IconButton, Tooltip, Typography } from '@mui/material';
// material-ui
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
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
  useReactTable
} from '@tanstack/react-table';
// types
// project-import
import ScrollX from 'components/ScrollX';
import { TablePagination } from 'components/third-party/react-table';
import { LabelKeyObject } from 'react-csv/lib/core';

import { PermsTableRow } from './PermissionsView';

// ==============================|| REACT TABLE ||============================== //

interface TableProps {
  data: PermsTableRow[];
  columns: ColumnDef<PermsTableRow>[];
  rowSelection: {};
  setRowSelection: Dispatch<SetStateAction<{}>>;
  globalFilter: string;
  setGlobalFilter: Dispatch<SetStateAction<string>>;
}

const PermissionsTable: React.FC<TableProps> = ({ data, columns, globalFilter, setGlobalFilter, rowSelection, setRowSelection }) => {
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 50 });

  const theme = useTheme();

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
    manualPagination: true
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
    <Card>
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
                getPageCount: table.getPageCount
              }}
            />
          </Box>
        </Stack>
      </ScrollX>
    </Card>
  );
};

export default PermissionsTable;
