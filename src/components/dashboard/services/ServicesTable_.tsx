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

import { Service } from '@/types/service';
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

interface TableProps {
  handleDeleteClick: (names: string[]) => void;
  data: Service[];
  columns: ColumnDef<Service>[];
}

const ServicesTable: React.FC<TableProps> = ({ data, columns, handleDeleteClick }) => {
  const theme = useTheme();
  const [globalFilter, setGlobalFilter] = useState('');
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    state: {
      globalFilter,
      rowSelection,
    },
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,

    getRowId: (row) => row.id,
    enableRowSelection: true,

    debugTable: true,
  });

  let headers: LabelKeyObject[] = [];
  table.getAllColumns().map((columns) => {
    headers.push({
      label: typeof columns.columnDef.header === 'string' ? columns.columnDef.header : '#',
      // @ts-ignore
      key: columns.columnDef.accessorKey,
    });
  });

  useEffect(() => {
    console.log(rowSelection);
  }, [rowSelection]);

  return (
    <Stack spacing={3}>
      <Card>
        <ScrollX>
          <Stack>
            <TableContainer>
              <Table>
                <TableHead>
                  {table.getHeaderGroups().map((headerGroup: HeaderGroup<any>) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableCell
                          sx={{ ...(header.id === 'id' && { width: 20 }) }}
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
                        <TableCell key={cell.id} {...cell.column.columnDef.meta}>
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

export default ServicesTable;
