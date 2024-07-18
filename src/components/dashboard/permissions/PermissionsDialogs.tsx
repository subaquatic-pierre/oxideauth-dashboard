'use client';

import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import {
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  OutlinedInput,
  Typography,
} from '@mui/material';
// material-ui
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';

interface Props {
  deleteOpen: boolean;
  setDeleteOpen: Dispatch<SetStateAction<boolean>>;
  createOpen: boolean;
  setCreateOpen: Dispatch<SetStateAction<boolean>>;
  rowSelection: {};
  submitDelete: () => void;
  submitCreate: () => void;
  formData: any;
  setFormData: (dataL: any) => void;
}

const PermissionsDialogs: React.FC<Props> = ({
  deleteOpen,
  setDeleteOpen,
  createOpen,
  setCreateOpen,
  submitCreate,
  submitDelete,
  rowSelection,
  formData,
  setFormData,
}) => {
  return (
    <>
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>Are you sure you want to delete this?</DialogTitle>
        <Divider />
        <DialogContent>
          <Stack>
            {Object.keys(rowSelection).map((item, idx) => (
              <Typography key={idx}>{item}</Typography>
            ))}
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
      <Dialog open={createOpen} onClose={() => setCreateOpen(false)}>
        <DialogTitle>Create new permissions</DialogTitle>
        <Divider />
        <DialogContent>
          <Stack spacing={2}>
            <Typography>Enter new permissions, enter multiple permissions on new line</Typography>
            <OutlinedInput multiline rows={10} value={formData} onChange={(e) => setFormData(e.target.value)} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={submitCreate} variant="contained" color="success">
            Create
          </Button>
          <Button
            onClick={() => {
              setFormData('');
              setCreateOpen(false);
            }}
            variant="contained"
            color="error"
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>{' '}
    </>
  );
};

export default PermissionsDialogs;
