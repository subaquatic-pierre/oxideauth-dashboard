'use client';
import Image from 'next/image';
import NextLink from 'next/link';
import { signIn } from 'next-auth/react';

// material-ui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project import
import { APP_DEFAULT_PATH } from 'config';
import CircularLoader from 'components/CircularLoader';
import { useEffect } from 'react';
import axios from 'axios';
import { useSearchParams, useRouter } from 'next/navigation';

// assets
const construction = '/assets/images/maintenance/under-construction.svg';

// ==============================--|| UNDER CONSTRUCTION - MAIN ||--============================== //

export default function LoadingProfile() {
  const router = useRouter();
  const params = useSearchParams();
  const handleLoad = async () => {
    const server = process.env.NEXT_PUBLIC_SERVER_ENDPOINT;
    const getUserEndpoint = `${server}/accounts/describe-self`;

    const token = params.get('token');

    console.log({ token });
    let res = await axios.get(getUserEndpoint, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log({ res });

    // router.push(APP_DEFAULT_PATH);
  };

  useEffect(() => {
    handleLoad();
  }, []);

  return (
    <Grid container spacing={4} direction="column" alignItems="center" justifyContent="center" sx={{ minHeight: '100vh', py: 2 }}>
      <Grid item xs={12}>
        <Box sx={{ position: 'relative', width: { xs: 300, sm: 480 }, height: { xs: 265, sm: 430 } }}>
          <Image src={construction} alt="mantis" fill sizes="100vw" />
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Stack spacing={2} justifyContent="center" alignItems="center">
          <Typography variant="h1" align="center">
            Loading Profile
          </Typography>
          <Typography color="text.secondary" align="center" sx={{ width: { xs: '73%', sm: '82%' } }}>
            Profile is loading ...
          </Typography>
          <CircularLoader />
          {/* <NextLink href={APP_DEFAULT_PATH} passHref legacyBehavior>
            <Button variant="contained">Back To Home</Button>
          </NextLink> */}
        </Stack>
      </Grid>
    </Grid>
  );
}
