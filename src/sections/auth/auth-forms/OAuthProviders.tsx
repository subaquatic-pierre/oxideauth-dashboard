'use client';

import React, { useState, FocusEvent, SyntheticEvent, useEffect } from 'react';

// next
import Image from 'next/legacy/image';

// material-ui
import { Theme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { getGoogleUrl } from 'utils/getGoogleUrl';

const Google = '/assets/images/icons/google.svg';

const OAuthProviders = () => {
  const [from, setFrom] = useState('');
  const downSM = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

  useEffect(() => {
    if (window) {
      setFrom(window.location.href);
    }
  }, []);

  return (
    <Stack
      direction="row"
      spacing={{ xs: 1, sm: 2 }}
      justifyContent={{ xs: 'space-around', sm: 'space-between' }}
      sx={{ mt: 3, '& .MuiButton-startIcon': { mr: { xs: 0, sm: 1 }, ml: { xs: 0, sm: -0.5 } } }}
    >
      <Box sx={{ width: '100%' }}>
        <Divider sx={{ mt: 2 }}>
          <Typography variant="caption"> Continue with</Typography>
        </Divider>
        <Button
          variant="outlined"
          color="secondary"
          fullWidth={!downSM}
          startIcon={<Image src={Google} alt="Twitter" width={16} height={16} />}
          href={getGoogleUrl(from)}
        >
          {!downSM && 'Google'}
        </Button>
      </Box>
    </Stack>
  );
};

export default OAuthProviders;
