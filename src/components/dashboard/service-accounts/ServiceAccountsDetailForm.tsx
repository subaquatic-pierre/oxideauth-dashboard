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
import { Control, Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';

interface Props {
  control: Control<Values>;
  handleSubmit: () => void;
  getValues: (a: any) => any;
  errors: any;
}

const schema = zod.object({
  name: zod.string().min(1, { message: 'Name is required' }),
  description: zod.string()
});

type Values = zod.infer<typeof schema>;

const ServiceAccountsDetailForm: React.FC<Props> = ({ control, handleSubmit, errors, getValues }) => {
  const { sa: saId } = useParams();
  const isExisting = saId !== 'new';

  return (
    <>
      <Card>
        <CardHeader
          title={isExisting ? getValues('name') : 'New'}
          subheader={isExisting ? (saId as string) : 'Create a new service account'}
        />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid xs={12}>
              <Controller
                control={control}
                name="name"
                render={({ field }) => (
                  <FormControl fullWidth error={Boolean(errors.name)}>
                    <InputLabel>Service Account Name</InputLabel>
                    <OutlinedInput {...field} autoFocus label="Service Account name" />
                    {errors.name ? <FormHelperText>{errors.name.message}</FormHelperText> : null}
                  </FormControl>
                )}
              />
            </Grid>
            <Grid md={12} xs={12}>
              <Controller
                control={control}
                name="description"
                render={({ field }) => (
                  <FormControl fullWidth error={Boolean(errors.description)}>
                    <InputLabel>Description</InputLabel>
                    <OutlinedInput multiline rows={2} {...field} label="Description" />
                    {errors.description ? <FormHelperText>{errors.description.message}</FormHelperText> : null}
                  </FormControl>
                )}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  );
};

export default ServiceAccountsDetailForm;
