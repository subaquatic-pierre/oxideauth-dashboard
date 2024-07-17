'use client';

import { createContext, SyntheticEvent, useState } from 'react';
// project import

// assets
import CloseOutlined from '@ant-design/icons/CloseOutlined';
import { IconButton } from '@mui/material';
// material-ui
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Fade from '@mui/material/Fade';
import Grow from '@mui/material/Grow';
import Slide, { SlideProps } from '@mui/material/Slide';
import MuiSnackbar from '@mui/material/Snackbar';

// types
import { KeyedObject } from '@/types/root';
import { SnackbarProps } from '@/types/snackbar';

// animation function
function TransitionSlideLeft(props: SlideProps) {
  return <Slide {...props} direction="left" />;
}

function TransitionSlideUp(props: SlideProps) {
  return <Slide {...props} direction="up" />;
}

function TransitionSlideRight(props: SlideProps) {
  return <Slide {...props} direction="right" />;
}

function TransitionSlideDown(props: SlideProps) {
  return <Slide {...props} direction="down" />;
}

function GrowTransition(props: SlideProps) {
  return <Grow {...props} />;
}

// animation options
const animation: KeyedObject = {
  SlideLeft: TransitionSlideLeft,
  SlideUp: TransitionSlideUp,
  SlideRight: TransitionSlideRight,
  SlideDown: TransitionSlideDown,
  Grow: GrowTransition,
  Fade,
};

interface SnackbarState {
  snackbar: SnackbarProps;
  setSnackbar: (state: any) => void;
}

export const initialState: SnackbarProps = {
  action: false,
  open: false,
  message: 'Note archived',
  anchorOrigin: {
    vertical: 'bottom',
    horizontal: 'right',
  },
  variant: 'default',
  alert: {
    color: 'success',
    variant: 'filled',
    severity: 'success',
  },
  transition: 'Fade',
  close: false,
  actionButton: false,
  maxStack: 3,
  dense: false,
  iconVariant: 'usedefault',
};

export const NotificationContext = createContext({ snackbar: initialState, setSnackbar: (state: any) => {} });

// ==============================|| SNACKBAR ||============================== //

export default function NotificationContextProvider({ children }: React.PropsWithChildren) {
  const [snackbar, setSnackbar] = useState<SnackbarProps>(initialState);

  const handleClose = (event: SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar((old) => ({ ...old, open: false }));
  };

  return (
    <NotificationContext.Provider value={{ snackbar, setSnackbar }}>
      {/* default snackbar */}
      {snackbar.variant === 'default' && (
        <MuiSnackbar
          anchorOrigin={snackbar.anchorOrigin}
          open={snackbar.open}
          autoHideDuration={1500}
          onClose={handleClose}
          message={snackbar.message}
          TransitionComponent={animation[snackbar.transition]}
          action={
            <>
              <Button color="secondary" size="small" onClick={handleClose}>
                UNDO
              </Button>
              <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose} sx={{ mt: 0.25 }}>
                <CloseOutlined />
              </IconButton>
            </>
          }
        />
      )}

      {/* alert snackbar */}
      {snackbar.variant === 'alert' && (
        <MuiSnackbar
          TransitionComponent={animation[snackbar.transition]}
          anchorOrigin={snackbar.anchorOrigin}
          open={snackbar.open}
          autoHideDuration={1500}
          onClose={handleClose}
        >
          <Alert
            severity={snackbar.alert.severity}
            variant={snackbar.alert.variant}
            // color={snackbar.alert.color}
            action={
              <>
                {snackbar.actionButton !== false && (
                  <Button color={snackbar.alert.color} size="small" onClick={handleClose}>
                    UNDO
                  </Button>
                )}
                {snackbar.close && (
                  <IconButton
                    sx={{ mt: 0.25 }}
                    size="small"
                    aria-label="close"
                    color={snackbar.alert.color}
                    onClick={handleClose}
                  >
                    <CloseOutlined />
                  </IconButton>
                )}
              </>
            }
            sx={{
              ...(snackbar.alert.variant === 'outlined' && {
                bgcolor: 'grey.0',
              }),
            }}
          >
            {snackbar.message}
          </Alert>
        </MuiSnackbar>
      )}
      {children}
    </NotificationContext.Provider>
  );
}
