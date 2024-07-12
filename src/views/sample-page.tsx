'use client';
// material-ui
import { Button, Stack } from '@mui/material';
import Typography from '@mui/material/Typography';

// project imports
import MainCard from 'components/MainCard';
import useAuth from 'hooks/useAuth';
import useNotify from 'hooks/useNotify';
import { describeAccount, describeRole, describeService, listAccounts, listPermissions, listRoles, listServices } from 'lib/api';
import { useEffect } from 'react';

// ==============================|| SAMPLE PAGE ||============================== //

export default function SamplePage() {
  const { user } = useAuth();

  console.log(user);
  const notify = useNotify();

  const handleListAccounts = async () => {
    const accounts = await listAccounts();

    console.log({ accounts });
  };

  const handleDescribeAccount = async () => {
    const account = await describeAccount('owner@email.com');

    console.log({ account });
  };

  const handleListRoles = async () => {
    const roles = await listRoles();

    console.log({ roles });
  };

  const handleDescribeRole = async () => {
    const role = await describeRole('viewer');

    console.log({ role });
  };

  const handleListPermissions = async () => {
    const permissions = await listPermissions();

    console.log({ permissions });
  };

  const handleListServices = async () => {
    const services = await listServices();

    console.log({ services });
  };

  const handleDescribeService = async () => {
    const service = await describeService('Auth');

    console.log({ service });
  };

  useEffect(() => {
    // load();
  }, []);

  return (
    <MainCard title="Sample Card">
      <Typography variant="body2">
        Lorem ipsum dolor sit amen, consenter nipissing eli, sed do elusion tempos incident ut laborers et doolie magna alissa. Ut enif ad
        minim venice, quin nostrum exercitation illampu laborings nisi ut liquid ex ea commons construal. Duos aube grue dolor in
        reprehended in voltage veil esse colum doolie eu fujian bulla parian. Exceptive sin ocean cuspidate non president, sunk in culpa qui
        officiate descent molls anim id est labours.
      </Typography>
      <Stack mt={5} direction={{ xs: 'column', md: 'row' }} spacing={2}>
        <Button onClick={() => notify('CHANGE GHTE TTEXT HERER!!!', 'error')} variant="contained">
          NOTIFY
        </Button>
        <Button onClick={handleListAccounts} variant="contained">
          LIST ACCOUNTS
        </Button>
        <Button onClick={handleDescribeAccount} variant="contained">
          DESCRIBE ACCOUNT
        </Button>
        <Button onClick={handleListRoles} variant="contained">
          LIST ROLES
        </Button>
        <Button onClick={handleDescribeRole} variant="contained">
          DESCRIBE ROLE
        </Button>
        <Button onClick={handleListPermissions} variant="contained">
          LIST PERMISSIONS
        </Button>
        <Button onClick={handleListServices} variant="contained">
          LIST SERVICES
        </Button>
        <Button onClick={handleDescribeService} variant="contained">
          DESCRIBE SERVICE
        </Button>
      </Stack>
    </MainCard>
  );
}
