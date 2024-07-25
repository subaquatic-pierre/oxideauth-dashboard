'use client';

import Link from 'next/link';
import { Button } from '@mui/material';
// material-ui
import Stack from '@mui/material/Stack';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { paths } from 'paths';
import { Role } from 'types/role';

interface TableProps {
  // setDeleteOpen: (open: boolean) => void;
  rowSelection: {};
}

const UsersButtons: React.FC<TableProps> = ({
  // setDeleteOpen,
  rowSelection
}) => {
  return (
    <Stack minHeight={44} direction={'row'} spacing={2}>
      <Button component={Link} href={paths.dashboard.users + '/new'} startIcon={<PlusIcon />} variant="contained">
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

export default UsersButtons;
