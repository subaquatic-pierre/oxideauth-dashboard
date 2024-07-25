'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { Alert, FormHelperText } from '@mui/material';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Grid from '@mui/material/Unstable_Grid2';
import { Eye as EyeIcon } from '@phosphor-icons/react/dist/ssr/Eye';
import { EyeSlash as EyeSlashIcon } from '@phosphor-icons/react/dist/ssr/EyeSlash';
import { Control, Controller, useForm } from 'react-hook-form';

import { UsersDetailFormSchema } from './UsersDetailView';

interface Props {
  control: Control<UsersDetailFormSchema>;
  getValues: (a: any) => any;
  errors: any;
}

const UsersDetailForm: React.FC<Props> = ({ control, errors, getValues }) => {
  const { user: userId } = useParams();
  const isExisting = userId !== 'new';
  const [showPassword, setShowPassword] = React.useState<boolean>();

  return (
    <>
      <Card>
        <CardHeader
          title={isExisting ? getValues('name') : 'New'}
          subheader={isExisting ? (userId as string) : 'Create a new user account'}
        />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid xs={12} md={6}>
              <Controller
                control={control}
                name="name"
                render={({ field }) => (
                  <FormControl fullWidth error={Boolean(errors.name)}>
                    <InputLabel>Full name</InputLabel>
                    <OutlinedInput {...field} autoFocus label="Full name" />
                    {errors.name ? <FormHelperText>{errors.name.message}</FormHelperText> : null}
                  </FormControl>
                )}
              />
            </Grid>
            <Grid md={6} xs={12}>
              <Controller
                control={control}
                name="email"
                render={({ field }) => (
                  <FormControl fullWidth disabled={isExisting} error={Boolean(errors.email)}>
                    <InputLabel>Email</InputLabel>
                    <OutlinedInput {...field} label="Email" />
                    {errors.email ? <FormHelperText>{errors.email.message}</FormHelperText> : null}
                  </FormControl>
                )}
              />
            </Grid>
            {!isExisting && (
              <>
                <Grid md={6} xs={12}>
                  <Controller
                    control={control}
                    name="password"
                    render={({ field }) => (
                      <FormControl fullWidth error={Boolean(errors.password)}>
                        <InputLabel>Password</InputLabel>
                        <OutlinedInput
                          {...field}
                          label="Password"
                          type={showPassword ? 'text' : 'password'}
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
                        />
                        {errors.password ? <FormHelperText>{errors.password.message}</FormHelperText> : null}
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid md={6} xs={12}>
                  <Controller
                    control={control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormControl fullWidth error={Boolean(errors.confirmPassword)}>
                        <InputLabel>Confirm Password</InputLabel>
                        <OutlinedInput
                          {...field}
                          label="Confirm Password"
                          type={showPassword ? 'text' : 'password'}
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
                        />
                        {errors.confirmPassword ? (
                          <FormHelperText>{errors.confirmPassword.message}</FormHelperText>
                        ) : null}
                      </FormControl>
                    )}
                  />
                </Grid>
              </>
            )}
          </Grid>
        </CardContent>
      </Card>
    </>
  );
};

export default UsersDetailForm;
