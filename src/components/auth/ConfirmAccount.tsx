'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { CircularProgress } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import Link from '@mui/material/Link';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ArrowRight } from '@phosphor-icons/react';
import { ArrowLeft } from '@phosphor-icons/react/dist/ssr';
import { Eye as EyeIcon } from '@phosphor-icons/react/dist/ssr/Eye';
import { EyeSlash as EyeSlashIcon } from '@phosphor-icons/react/dist/ssr/EyeSlash';
import { useAuth } from 'hooks/useAuth';
import useNotify from 'hooks/useNotify';
import { authClient } from 'lib/api/auth';
import { sleep } from 'lib/sleep';
import { paths } from 'paths';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';

export default function ConfirmAccount(): React.JSX.Element {
  const params = useSearchParams();
  const notify = useNotify();

  const [hideResend, setHideResend] = React.useState(false);
  const handleResendLink = async () => {
    const email = params.get('email');
    if (email) {
      try {
        await authClient.resendLink({ email });
        setHideResend(true);
      } catch (e: any) {
        notify(e.message, 'error');
      }
    } else {
      const message = 'No email';
      notify(message, 'error');
    }
    setHideResend(true);
  };

  return (
    <Box component="main" sx={{ alignItems: 'center', display: 'flex', justifyContent: 'center', minHeight: '100%' }}>
      <Stack spacing={3} sx={{ alignItems: 'center', maxWidth: 'md' }}>
        <Box>
          <Box
            component="img"
            alt="Login"
            src="/assets/auth-widgets.png"
            sx={{ display: 'inline-block', height: 'auto', maxWidth: '100%', width: '400px' }}
          />
        </Box>
        <Typography variant="h3" sx={{ textAlign: 'center' }}>
          Confirm Your Account
        </Typography>
        <Typography color="text.secondary" variant="body1" sx={{ textAlign: 'center' }}>
          Please check your inbox to confirm your account
        </Typography>
        <Stack direction={'row'} spacing={2}>
          <Button component={RouterLink} href={paths.home} startIcon={<ArrowLeft />} variant="contained">
            Go back to home
          </Button>
          {!hideResend && (
            <Button onClick={handleResendLink} startIcon={<ArrowRight />}>
              Resend Link
            </Button>
          )}
        </Stack>
      </Stack>
    </Box>
  );
}
