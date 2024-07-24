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
import { Eye as EyeIcon } from '@phosphor-icons/react/dist/ssr/Eye';
import { EyeSlash as EyeSlashIcon } from '@phosphor-icons/react/dist/ssr/EyeSlash';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import { paths } from '@/paths';
import { authClient } from '@/lib/api/auth';
import { sleep } from '@/lib/sleep';
import { useAuth } from '@/hooks/useAuth';
import useNotify from '@/hooks/useNotify';

export default function LoadingProfile(): React.JSX.Element {
  const { checkSession } = useAuth();
  const notify = useNotify();
  const params = useSearchParams();
  const router = useRouter();

  const loadToken = async () => {
    await sleep(0.5);

    const token = params.get('token');

    if (!token) {
      notify('Unable to get token', 'error');
      // router.push(paths.auth.signIn);
      return;
    }

    window.localStorage.setItem('token', token);

    checkSession();
  };

  React.useEffect(() => {
    loadToken();
  }, []);

  return (
    <Stack spacing={4} justifyContent={'center'} alignItems={'center'}>
      <Stack spacing={1} textAlign={'center'}>
        <Typography variant="h4">Loading Profile</Typography>
        {/* <Typography color="text.secondary" variant="body2">
          Don&apos;t have an account?{' '}
          <Link component={RouterLink} href={paths.auth.signUp} underline="hover" variant="subtitle2">
            Sign up
          </Link>
        </Typography> */}
      </Stack>
      <Stack direction={'row'} justifyContent={'center'}>
        <CircularProgress />
      </Stack>
    </Stack>
  );
}
