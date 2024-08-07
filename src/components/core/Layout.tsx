import * as React from 'react';
import RouterLink from 'next/link';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { DynamicLogo } from 'components/core/Logo';
import { paths } from 'paths';

export interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps): React.JSX.Element {
  return (
    <Box
      sx={{
        minHeight: '100%'
      }}
    >
      <Box sx={{ p: 3 }}>
        <Box component={RouterLink} href={paths.home} sx={{ display: 'inline-block', fontSize: 0 }}>
          <DynamicLogo colorDark="light" colorLight="dark" height={32} width={122} />
        </Box>
      </Box>
      <Box>{children}</Box>
      <Box
        sx={{
          alignItems: 'center',
          background: 'radial-gradient(50% 50% at 50% 50%, #122647 0%, #090E23 100%)',
          color: 'var(--mui-palette-common-white)',
          display: { xs: 'none', lg: 'flex' },
          justifyContent: 'center',
          p: 3
        }}
      >
        <Stack>
          {/* <Typography align="center" variant="subtitle1" color="text.secondary">
            Centralized Authentication and Insights for Distributed Microservices
          </Typography> */}
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box component="img" alt="Widgets" src="/brand/logoIconText.png" sx={{ height: 'auto', width: '100%', maxWidth: '100px' }} />
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}
