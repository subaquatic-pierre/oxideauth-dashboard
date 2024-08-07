'use client';

import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { Button, Card, Dialog, DialogActions, DialogContent, DialogTitle, OutlinedInput, Typography } from '@mui/material';
// material-ui
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';

interface Props {
  deleteOpen: boolean;
  setDeleteOpen: Dispatch<SetStateAction<boolean>>;
  submitDelete: () => void;
}

const SettingsDialog: React.FC<Props> = ({ deleteOpen, setDeleteOpen, submitDelete }) => {
  return (
    <>
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>Are you sure you want to delete your account?</DialogTitle>
        <Divider />
        <DialogContent>
          <Stack>
            <Typography>This action can not be reversed!</Typography>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={submitDelete} variant="contained" color="success">
            Yes
          </Button>
          <Button onClick={() => setDeleteOpen(false)} variant="contained" color="error">
            No
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SettingsDialog;
