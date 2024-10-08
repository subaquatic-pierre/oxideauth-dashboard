'use client';

import { Dispatch, SetStateAction } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
// material-ui
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import { Account } from 'types/account';

interface Props {
  deleteOpen: boolean;
  setDeleteOpen: Dispatch<SetStateAction<boolean>>;
  rowSelection: {};
  submitDelete: () => void;
  allAccounts: Account[];
  cancelDelete: () => void;
}

const UsersDialogs: React.FC<Props> = ({ allAccounts, deleteOpen, setDeleteOpen, submitDelete, rowSelection, cancelDelete }) => {
  return (
    <>
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>Are you sure you want to delete this?</DialogTitle>
        <Divider />
        <DialogContent>
          <Stack>
            {Object.keys(rowSelection).map((item, idx) => (
              <Typography key={idx}>{allAccounts.filter((el) => el.id === item)[0].name}</Typography>
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={submitDelete} variant="contained" color="success">
            Yes
          </Button>
          <Button onClick={cancelDelete} variant="contained" color="error">
            No
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UsersDialogs;
