'use client';

import { useEffect, useMemo, useState } from 'react';

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
import { IconButton, Tooltip, Typography } from '@mui/material';

// third-party
import {
  useReactTable,
  getPaginationRowModel,
  ColumnDef,
  HeaderGroup,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel
} from '@tanstack/react-table';

// project-import
import ScrollX from 'components/ScrollX';
import MainCard from 'components/MainCard';
import { CSVExport, TablePagination, Filter, DebouncedInput, IndeterminateCheckbox } from 'components/third-party/react-table';

// types
import { LabelKeyObject } from 'react-csv/lib/core';
import { listPermissions, listServices } from 'lib/api';
import { DeleteFilled, EditFilled } from '@ant-design/icons';
import { useTheme, useThemeProps } from '@mui/system';
import { Service } from 'types/service';

// ==============================|| REACT TABLE ||============================== //

interface TableProps {
  handleDeleteClick: (names: string[]) => void;
  data: Service[];
  columns: ColumnDef<Service>[];
  top?: boolean;
}

const ReactTable: React.FC<TableProps> = ({ data, columns, top, handleDeleteClick }) => {
  const theme = useTheme();
  const [globalFilter, setGlobalFilter] = useState('');
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    state: {
      globalFilter,
      rowSelection
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

    debugTable: true
  });

  let headers: LabelKeyObject[] = [];
  table.getAllColumns().map((columns) => {
    headers.push({
      label: typeof columns.columnDef.header === 'string' ? columns.columnDef.header : '#',
      // @ts-ignore
      key: columns.columnDef.accessorKey
    });
  });

  useEffect(() => {
    console.log(rowSelection);
  }, [rowSelection]);

  return (
    <MainCard content={false}>
      <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" sx={{ padding: 2 }}>
        <DebouncedInput
          value={globalFilter ?? ''}
          onFilterChange={(value) => setGlobalFilter(String(value))}
          placeholder={`Search ${data.length} records...`}
        />
        {/* Action Buttons in table heading */}
        <Box>
          {Object.keys(rowSelection).length === 0 ? (
            <Stack direction={'row'} alignItems={'center'}>
              CREATE BUTTON
            </Stack>
          ) : (
            <Stack direction="row" alignItems={'center'} spacing={2}>
              <Typography color="text.secondary" variant="body2">
                Selected: {Object.keys(rowSelection).length}
              </Typography>
              <Box>
                <Tooltip title="Delete">
                  <IconButton color="error" onClick={() => handleDeleteClick(Object.keys(rowSelection).map((el) => el))}>
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
                  filename: 'services.csv'
                }}
              />
            </Stack>
          )}
        </Box>
      </Stack>
      <ScrollX>
        <Stack>
          {top && (
            <Box sx={{ p: 2 }}>
              <TablePagination
                {...{
                  setPageSize: table.setPageSize,
                  setPageIndex: table.setPageIndex,
                  getState: table.getState,
                  getPageCount: table.getPageCount
                }}
              />
            </Box>
          )}

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

          {!top && (
            <>
              <Divider />
              <Box sx={{ p: 2 }}>
                <TablePagination
                  {...{
                    setPageSize: table.setPageSize,
                    setPageIndex: table.setPageIndex,
                    getState: table.getState,
                    getPageCount: table.getPageCount
                  }}
                />
              </Box>
            </>
          )}
        </Stack>
      </ScrollX>
    </MainCard>
  );
};

// ==============================|| REACT TABLE - PAGINATION ||============================== //

export default function ServicesTable() {
  const theme = useTheme();
  const [data, setData] = useState<Service[]>([]);

  const handleEditClick = (name: string) => {
    console.log('hanle edit of', name);
  };

  const handleDeleteClick = (name: string[]) => {
    console.log('hanle delete of', name);
  };

  const columns = useMemo<ColumnDef<Service>[]>(
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
        id: 'endpoint',
        header: 'Endpoint',
        accessorKey: 'endpoint'
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
    const services = await listServices();

    setData(services);
  };

  useEffect(() => {
    handleLoad();
  }, []);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <ReactTable handleDeleteClick={handleDeleteClick} {...{ data, columns }} />
      </Grid>
    </Grid>
  );
}
