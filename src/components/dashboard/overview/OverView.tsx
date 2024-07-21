'use client';

import { useEffect, useState } from 'react';
import type { Metadata } from 'next';
import { useTheme } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { PlugsConnected } from '@phosphor-icons/react';
import { AppWindow, ChartPolar, HardHat, Target, Users } from '@phosphor-icons/react/dist/ssr';
import dayjs from 'dayjs';

import { Account } from '@/types/account';
import { Role } from '@/types/role';
import { Service } from '@/types/service';
import { config } from '@/config';
import { paths } from '@/paths';
import { checkIsAdmin } from '@/lib/adminUtils';
import { accountClient } from '@/lib/api/account';
import { roleClient } from '@/lib/api/role';
import { serviceClient } from '@/lib/api/service';
import { useAuth } from '@/hooks/useAuth';
import useNotify from '@/hooks/useNotify';
import { Budget } from '@/components/dashboard/overview/budget';
import { LatestProducts } from '@/components/dashboard/overview/latestProducts';
import { Sales } from '@/components/dashboard/overview/sales';
import ServicesList from '@/components/dashboard/overview/ServicesList';
import { TasksProgress } from '@/components/dashboard/overview/tasksProgress';
import { TotalCustomers } from '@/components/dashboard/overview/totalCustomers';
import { TotalProfit } from '@/components/dashboard/overview/totalProfit';
import { Traffic } from '@/components/dashboard/overview/traffic';

import InfoCard from './InfoCard';

const OverView = () => {
  const notify = useNotify();
  const { user } = useAuth();
  const theme = useTheme();
  const [services, setServices] = useState<Service[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);

  const handleLoad = async () => {
    const isAdmin = checkIsAdmin(user);

    try {
      const services = await serviceClient.listServices();
      setServices(services);
    } catch (e: any) {
      notify(e.message, 'error');
    }

    if (isAdmin) {
      try {
        const roles = await roleClient.listRoles();
        const accounts = await accountClient.listAccounts();
        setAccounts(accounts);
        setRoles(roles);
      } catch (e: any) {
        notify(e.message, 'error');
      }
    }
  };
  useEffect(() => {
    handleLoad();
  }, []);

  return (
    <Grid container spacing={3}>
      {checkIsAdmin(user) && (
        <>
          <Grid lg={3} sm={6} xs={12}>
            <InfoCard
              heading={'Total Services'}
              icon={<PlugsConnected />}
              value={`${services.length}`}
              color={theme.palette.info.main}
              link={paths.dashboard.services}
            />
          </Grid>
          <Grid lg={3} sm={6} xs={12}>
            <InfoCard
              heading={'Total Users'}
              icon={<Users />}
              value={`${accounts.filter((el) => el.type === 'user').length}`}
              color={theme.palette.success.main}
              link={paths.dashboard.users}
            />
          </Grid>
          <Grid lg={3} sm={6} xs={12}>
            <InfoCard
              heading={'Total Service Accounts'}
              icon={<HardHat />}
              value={`${accounts.filter((el) => el.type === 'service').length}`}
              color={theme.palette.warning.main}
              link={paths.dashboard.serviceAccounts}
            />
          </Grid>
          <Grid lg={3} sm={6} xs={12}>
            <InfoCard
              heading={'Total Roles'}
              icon={<ChartPolar />}
              value={`${roles.length}`}
              color={theme.palette.error.main}
              link={paths.dashboard.roles}
            />
          </Grid>
        </>
      )}
      <Grid md={12} xs={12}>
        <ServicesList services={services} sx={{ height: '100%' }} />
      </Grid>
    </Grid>
  );
};

export default OverView;
