'use client';

import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Box, FormHelperText, Stack } from '@mui/material';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Grid from '@mui/material/Unstable_Grid2';
import { ColumnDef } from '@tanstack/react-table';
import useNotify from 'hooks/useNotify';
import { roleClient } from 'lib/api/role';
import { buildPermissionTableColumns } from 'lib/tables';
import { paths } from 'paths';
import { Controller, useForm } from 'react-hook-form';
import { Role } from 'types/role';
import { Service } from 'types/service';
import { z as zod } from 'zod';

import PermissionsFilter from '../permissions/PermissionsFilter';
import PermissionsTable from '../permissions/PermissionsTable';
import { PermsTableRow } from '../permissions/PermissionsView';

interface Props {
  allPerms: PermsTableRow[];
  selectedPerms: { [name: string]: boolean };
  setSelectedPerms: Dispatch<SetStateAction<{ [name: string]: boolean }>>;
}

const RolesPermsTable = ({ allPerms, selectedPerms, setSelectedPerms }: Props) => {
  const { role: roleId } = useParams();
  const [globalFilter, setGlobalFilter] = useState('');

  const isExisting = roleId !== 'new';

  const columns = useMemo<ColumnDef<PermsTableRow>[]>(buildPermissionTableColumns, []);

  return (
    <Card>
      <CardHeader title={'Permissions'} subheader={'Select permissions'} />
      <Divider />
      <Stack>
        <PermissionsFilter
          rowSelection={selectedPerms}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          length={allPerms.length}
        />
        <PermissionsTable
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          rowSelection={selectedPerms}
          setRowSelection={setSelectedPerms}
          data={allPerms}
          columns={columns}
        />
      </Stack>
      {/* <Divider />
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button onClick={() => handleSubmit()} variant="contained">
          {isExisting ? 'Save details' : 'Create new'}
        </Button>
      </CardActions> */}
    </Card>
  );
};

export default RolesPermsTable;
