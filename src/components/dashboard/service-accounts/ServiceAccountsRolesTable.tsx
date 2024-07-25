'use client';

import { Dispatch, SetStateAction, useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Autocomplete, Box, FormHelperText, MenuItem, Select, Stack, TextField } from '@mui/material';
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
import { Plus } from '@phosphor-icons/react';
import { Minus, Trash } from '@phosphor-icons/react/dist/ssr';
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
import { SelectedRoles } from './ServiceAccountsDetailView';

interface SelectProps {
  allRoles: Role[];
  addRole: (mapPos: string, roleId: string) => void;
  removeRole: (roleId: string) => void;
  mapPos: string;
  selectedRoles: SelectedRoles;
  roleId: string;
  handleAutoCompleteBlur: (e: any, mapPos: string, roleId: string) => void;
}

const RoleSelect: React.FC<SelectProps> = ({ allRoles, mapPos, selectedRoles, addRole, removeRole, roleId, handleAutoCompleteBlur }) => {
  const [value, setValue] = useState<Role | null>(allRoles.filter((el) => el.id === roleId)[0] || null);

  useEffect(() => {
    setValue(allRoles.filter((el) => el.id === roleId)[0] || null);
  }, [selectedRoles]);

  useEffect(() => {
    if (value) {
      addRole(mapPos, value.id);
    }
  }, [value]);

  return (
    <Stack alignItems={'center'} direction={'row'} spacing={2}>
      <Autocomplete
        fullWidth
        value={value}
        onChange={(_: any, newValue: Role | null) => {
          setValue(newValue as Role);
        }}
        options={allRoles}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        getOptionLabel={(option: Role) => option.name as string}
        getOptionDisabled={(option) => Object.values(selectedRoles).indexOf(option.id) !== -1}
        renderInput={(params: any) => (
          <TextField {...params} autoFocus={roleId === ''} onBlur={(e) => handleAutoCompleteBlur(e, mapPos, roleId)} label="Role" />
        )}
      />
      <Box minWidth={200}>
        <Button color="error" startIcon={<Trash />} onClick={() => removeRole(mapPos)}>
          Remove Role
        </Button>
      </Box>
    </Stack>
  );
};

interface Props {
  selectedRoles: SelectedRoles;
  setSelectedRoles: Dispatch<SetStateAction<SelectedRoles>>;
  allRoles: Role[];
}

const ServiceAccountsRolesTable: React.FC<Props> = ({ setSelectedRoles, selectedRoles, allRoles }: Props) => {
  const { sa: saId } = useParams();
  const isExisting = saId !== 'new';

  const addRole = (mapPos: string, newRoleId: string) => {
    const updated = { ...selectedRoles };

    updated[mapPos] = newRoleId;
    setSelectedRoles(updated);
  };

  const addRoleButton = () => {
    const newPos = Object.keys(selectedRoles).length;
    const updated: SelectedRoles = {};
    for (let i = 0; i < newPos; i++) {
      updated[i] = selectedRoles[i];
    }
    updated[newPos] = '';

    setSelectedRoles(updated);
  };

  const removeRole = (mapPos: string) => {
    const copy = { ...selectedRoles };
    delete copy[mapPos];

    const updated: SelectedRoles = {};

    // update new until reached mapPos
    let i = 0;
    for (const roleId of Object.values(copy)) {
      updated[i] = roleId;
      i++;
    }

    setSelectedRoles(updated);
  };

  const handleAutoCompleteBlur = (e: any, mapPos: string) => {
    if (e.target.value === '') {
      removeRole(mapPos);
    }
  };

  return (
    <Card>
      <CardHeader title={'Roles'} subheader={'Add Roles'} />
      <Divider />
      <CardContent>
        <Stack spacing={2}>
          {Object.entries(selectedRoles).map(([mapPos, roleId], idx) => (
            <RoleSelect
              key={idx}
              allRoles={allRoles}
              selectedRoles={selectedRoles}
              addRole={addRole}
              removeRole={removeRole}
              mapPos={mapPos}
              roleId={roleId}
              handleAutoCompleteBlur={handleAutoCompleteBlur}
            />
          ))}
          {Object.values(selectedRoles).indexOf('') === -1 && (
            <Box>
              <Button startIcon={<Plus />} onClick={() => addRoleButton()}>
                Add Role
              </Button>
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ServiceAccountsRolesTable;
