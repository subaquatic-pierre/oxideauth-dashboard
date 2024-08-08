'use client';

import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { paths } from 'paths';
import { Box } from '@mui/material';

export function IndexPage(): React.JSX.Element {
  return (
    <Stack spacing={4}>
      <Stack spacing={1}>
        <Typography variant="h4">Welcome to OxideAuth</Typography>
      </Stack>
      <Typography color="text.secondary" variant="body2">
        OxideAuth provides centralized authentication and insights for your distributed microservices. Our platform ensures secure and
        efficient management of user credentials, roles, and permissions.
      </Typography>
      <Box sx={{ color: 'text.secondary' }}>
        Key features include:
        <ul>
          <li>Robust authentication mechanisms</li>
          <li>Role-based access control</li>
          <li>Comprehensive activity logging and monitoring</li>
          <li>Seamless integration with existing microservices</li>
          <li>High scalability and performance</li>
        </ul>
      </Box>
      <Typography color="text.secondary" variant="body2">
        Whether you are managing a small set of services or a large-scale distributed system, OxideAuth provides the tools you need to
        secure your environment and streamline your operations.
      </Typography>
      <Stack>
        <Button href={paths.auth.signIn} color="primary" variant="contained">
          Sign In
        </Button>
      </Stack>
    </Stack>
  );
}
