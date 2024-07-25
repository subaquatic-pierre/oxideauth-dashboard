// import { AlertColor, AlertProps } from '@mui/material';
// import { openSnackbar, initialState } from 'state/snackbar';

import { useContext } from 'react';
import { AlertColor } from '@mui/material';
import { NotificationContext } from 'contexts/NotificationContext';
import { SnackbarProps } from 'types/snackbar';

export default function useNotify() {
  const { setSnackbar } = useContext(NotificationContext);
  return (message: string, color: AlertColor) =>
    setSnackbar((old: SnackbarProps) => ({
      ...old,
      open: true,
      variant: 'alert',
      message,
      alert: { ...old.alert, color, severity: color }
    }));
}
