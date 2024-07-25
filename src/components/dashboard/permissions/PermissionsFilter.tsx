'use client';

import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { Button, Card, IconButton, Stack, Tooltip, Typography } from '@mui/material';
// material-ui
import Grid from '@mui/material/Grid';
// types
// project-import
import ScrollX from 'components/ScrollX';
import { DebouncedInput } from 'components/third-party/react-table';

interface TableProps {
  length: number;
  globalFilter: string;
  setGlobalFilter: Dispatch<SetStateAction<string>>;
  rowSelection: {};
}

const PermissionsFilter: React.FC<TableProps> = ({ length, globalFilter, setGlobalFilter, rowSelection }) => {
  return (
    <Card sx={{ p: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <DebouncedInput
            value={globalFilter ?? ''}
            onFilterChange={(value) => setGlobalFilter(String(value))}
            placeholder={`Search ${length} records...`}
          />
        </Grid>
        {Object.keys(rowSelection).length > 0 && (
          <Grid item xs={12} md={6}>
            <Stack alignItems="flex-end" height="100%" justifyContent={'center'}>
              <Typography color="text.secondary" variant="body2">
                {Object.keys(rowSelection).length} selected items
              </Typography>
            </Stack>
          </Grid>
        )}
      </Grid>
    </Card>
  );
};

export default PermissionsFilter;
