'use client';

import { Dispatch, SetStateAction, useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Autocomplete, Box, FormHelperText, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import { Check } from '@phosphor-icons/react/dist/ssr';
import { Role } from 'types/role';

interface Props {
  selectedRoles: Role[];
}

const SettingsRolesTable: React.FC<Props> = ({ selectedRoles }: Props) => {
  const { sa: saId } = useParams();
  const isExisting = saId !== 'new';

  return (
    <Card>
      <CardHeader title={'Roles'} subheader={'Account Roles'} />
      <Divider />
      <CardContent>
        <Stack spacing={2}>
          {selectedRoles.map((role, idx) => (
            <Stack direction={'row'} spacing={2} key={idx} alignItems={'center'}>
              <Check />
              <Typography variant="h6" color="text.secondary">
                {role.name}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default SettingsRolesTable;
