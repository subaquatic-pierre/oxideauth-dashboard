// import { AlertColor, AlertProps } from '@mui/material';
// import { openSnackbar, initialState } from 'state/snackbar';

export default function useNotify() {
  return (message: string, color: string) => console.log({ message, color });
  // openSnackbar({
  //   open: true,
  //   message: message,
  //   variant: 'alert',
  //   alert: {
  //     variant: 'filled',
  //     severity: color
  //   }
  // });
}
