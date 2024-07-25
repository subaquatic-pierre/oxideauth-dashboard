'use client';

import Link from 'next/link';
import { Button } from '@mui/material';
// material-ui
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/system';
import { Trash } from '@phosphor-icons/react';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { paths } from 'paths';
import { Role } from 'types/role';

interface TableProps {
  setDeleteOpen: (open: boolean) => void;
  rowSelection: {};
}

const RolesButtons: React.FC<TableProps> = ({ setDeleteOpen, rowSelection }) => {
  return (
    <Stack minHeight={44} direction={'row'} spacing={2}>
      <Button component={Link} href={paths.dashboard.roles + '/new'} startIcon={<PlusIcon />} variant="contained">
        New
      </Button>
      {Object.keys(rowSelection).length > 0 && (
        <>
          {/* <Button color="error" onClick={() => setDeleteOpen(true)} startIcon={<Trash />}>
            Delete
          </Button> */}
          {/* <Button color="inherit" startIcon={<DownloadIcon />}>
            Export
          </Button> */}
        </>
      )}
    </Stack>
  );
};

export default RolesButtons;
