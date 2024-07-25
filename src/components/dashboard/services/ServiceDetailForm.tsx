'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import { Service } from '@/types/service';
import { paths } from '@/paths';
import { serviceClient } from '@/lib/api/service';
import useNotify from '@/hooks/useNotify';

interface Props {
  initialData: Service;
}

const schema = zod.object({
  name: zod.string().min(1, { message: 'Name is required' }),
  endpoint: zod.string().min(1, { message: 'Endpoint is required' }),
  description: zod.string(),
});

type Values = zod.infer<typeof schema>;

export function ServiceDetailForm({ initialData }: Props): React.JSX.Element {
  const isExistingService = !!initialData.id;
  const notify = useNotify();
  const router = useRouter();
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Values>({ defaultValues: initialData, resolver: zodResolver(schema) });

  const onSubmit = async (formValues: Values) => {
    try {
      if (isExistingService) {
        const res = await serviceClient.updateService({ service: initialData.id, ...formValues });

        console.log(res);

        notify('Successfully updated service', 'success');

        router.push(paths.dashboard.services);
      } else {
        const res = await serviceClient.createService(formValues);

        console.log(res);

        notify('Successfully create new service', 'success');

        router.push(paths.dashboard.services);
      }
    } catch (e: any) {
      const message = e.message;
      notify(message, 'error');
      setError('root', { type: 'server', message: message });

      // router.push(paths.dashboard.services)
    }
  };

  return (
    <>
      <Card>
        <CardHeader
          title={isExistingService ? initialData.name : 'New'}
          subheader={isExistingService ? initialData.id : 'Create a new service'}
        />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid md={6} xs={12}>
              <Controller
                control={control}
                name="name"
                render={({ field }) => (
                  <FormControl fullWidth error={Boolean(errors.name)}>
                    <InputLabel>Service Name</InputLabel>
                    <OutlinedInput {...field} label="Service name" />
                    {errors.name ? <FormHelperText>{errors.name.message}</FormHelperText> : null}
                  </FormControl>
                )}
              />
            </Grid>
            <Grid md={6} xs={12}>
              <Controller
                control={control}
                name="endpoint"
                render={({ field }) => (
                  <FormControl fullWidth error={Boolean(errors.endpoint)}>
                    <InputLabel>Endpoint</InputLabel>
                    <OutlinedInput {...field} label="Endpoint" />
                    {errors.endpoint ? <FormHelperText>{errors.endpoint.message}</FormHelperText> : null}
                  </FormControl>
                )}
              />
            </Grid>
            <Grid xs={12}>
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
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button onClick={handleSubmit(onSubmit)} variant="contained">
            {isExistingService ? 'Save details' : 'Create new'}
          </Button>
          <Button LinkComponent={Link} href={paths.dashboard.services} color="warning" variant="contained">
            Cancel
          </Button>
        </CardActions>
      </Card>
      {errors.root && (
        <Alert severity="error" color="error">
          {errors.root.message}
        </Alert>
      )}
    </>
  );
}
