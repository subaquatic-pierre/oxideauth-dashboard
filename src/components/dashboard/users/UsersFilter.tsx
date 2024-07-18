'use client';

import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { Button, Card } from '@mui/material';
// material-ui
import Grid from '@mui/material/Grid';

// types
// project-import
import ScrollX from '@/components/ScrollX';
import { DebouncedInput } from '@/components/third-party/react-table';

interface TableProps {
  length: number;
  globalFilter: string;
  setGlobalFilter: Dispatch<SetStateAction<string>>;
}

const UsersFilter: React.FC<TableProps> = ({ length, globalFilter, setGlobalFilter }) => {
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
      </Grid>
    </Card>
  );
};

export default UsersFilter;
