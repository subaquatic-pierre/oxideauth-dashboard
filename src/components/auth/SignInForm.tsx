'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Divider } from '@mui/material';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import Link from '@mui/material/Link';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { GoogleLogo } from '@phosphor-icons/react';
import { Eye as EyeIcon } from '@phosphor-icons/react/dist/ssr/Eye';
import { EyeSlash as EyeSlashIcon } from '@phosphor-icons/react/dist/ssr/EyeSlash';
import { useAuth } from 'hooks/useAuth';
import useNotify from 'hooks/useNotify';
import { authClient, SignInWithPasswordParams } from 'lib/api/auth';
import { getGoogleUrl } from 'lib/getGoogleUrl';
import { paths } from 'paths';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';

const schema = zod.object({
  email: zod.string().min(1, { message: 'Email is required' }).email(),
  password: zod.string().min(1, { message: 'Password is required' })
});

type Values = zod.infer<typeof schema>;

const defaultValues = { email: 'viewer@email.com', password: 'password' } as Values;

export function SignInForm(): React.JSX.Element {
  const params: any = useSearchParams();
  const email = params.get('email');
  const router = useRouter();
  const { checkSession } = useAuth();
  const notify = useNotify();

  const [showPassword, setShowPassword] = React.useState<boolean>();

  const [isPending, setIsPending] = React.useState<boolean>(false);

  if (email) {
    defaultValues.email = email;
  }

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });

  const onSubmit = async (values: Values): Promise<void> => {
    try {
      const { token, account } = await authClient.signInWithPassword(values as SignInWithPasswordParams);

      if (account.verified) {
        localStorage.setItem('token', token);
        checkSession();
      } else {
        router.push(`${paths.auth.confirmAccount}?email=${account.email}`);
      }
    } catch (e: any) {
      notify(e.message, 'error');
      setError('root', { type: 'server', message: e.message });
      setIsPending(false);
    }
  };

  const message = params.get('message');

  return (
    <Stack spacing={4}>
      <Stack spacing={1}>
        <Typography variant="h4">Sign in</Typography>
        <Typography color="text.secondary" variant="body2">
          Don&apos;t have an account?{' '}
          <Link component={RouterLink} href={paths.auth.signUp} underline="hover" variant="subtitle2">
            Sign up
          </Link>
        </Typography>
      </Stack>
      {message && <Alert color="success">{message}</Alert>}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <FormControl error={Boolean(errors.email)}>
                <InputLabel>Email address</InputLabel>
                <OutlinedInput {...field} label="Email address" type="email" />
                {errors.email ? <FormHelperText>{errors.email.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <FormControl error={Boolean(errors.password)}>
                <InputLabel>Password</InputLabel>
                <OutlinedInput
                  {...field}
                  endAdornment={
                    showPassword ? (
                      <EyeIcon
                        cursor="pointer"
                        fontSize="var(--icon-fontSize-md)"
                        onClick={(): void => {
                          setShowPassword(false);
                        }}
                      />
                    ) : (
                      <EyeSlashIcon
                        cursor="pointer"
                        fontSize="var(--icon-fontSize-md)"
                        onClick={(): void => {
                          setShowPassword(true);
                        }}
                      />
                    )
                  }
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                />
                {errors.password ? <FormHelperText>{errors.password.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <div>
            <Link component={RouterLink} href={paths.auth.resetPassword} variant="subtitle2">
              Forgot password?
            </Link>
          </div>
          {errors.root ? <Alert color="error">{errors.root.message}</Alert> : null}
          <Button disabled={isPending} type="submit" variant="contained">
            Sign in
          </Button>
        </Stack>
      </form>
      {/* OAuth Buttons */}
      {/* <Alert color="warning">
        Use{' '}
        <Typography component="span" sx={{ fontWeight: 700 }} variant="inherit">
          sofia@devias.io
        </Typography>{' '}
        with password{' '}
        <Typography component="span" sx={{ fontWeight: 700 }} variant="inherit">
          Secret1
        </Typography>
      </Alert> */}
      <Typography color="text.secondary" variant="body2">
        Sign in with
      </Typography>
      <Stack>
        <Button href={getGoogleUrl()} startIcon={<GoogleLogo />} disabled={isPending} type="submit" color="secondary" variant="contained">
          Google
        </Button>
      </Stack>
    </Stack>
  );
}
