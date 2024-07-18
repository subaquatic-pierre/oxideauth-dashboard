'use client';

import { Button } from '@mui/material';
// material-ui
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/system';
import { Trash } from '@phosphor-icons/react';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';

import { PermsTableRow } from './PermissionsView';

interface TableProps {
  setDeleteOpen: (open: boolean) => void;
  setCreateOpen: (open: boolean) => void;
  rowSelection: {};
}

const PermissionsButtons: React.FC<TableProps> = ({ setDeleteOpen, setCreateOpen, rowSelection }) => {
  return (
    <Stack minHeight={44} direction={'row'} spacing={2}>
      <Button onClick={() => setCreateOpen(true)} startIcon={<PlusIcon />} variant="contained">
        New
      </Button>
      {Object.keys(rowSelection).length > 0 && (
        <>
          <Button color="error" onClick={() => setDeleteOpen(true)} startIcon={<Trash />}>
            Delete
          </Button>
          {/* <Button color="inherit" startIcon={<DownloadIcon />}>
            Export
          </Button> */}
        </>
      )}
    </Stack>
  );
};

export default PermissionsButtons;
