'use client';

import { useEffect } from 'react';

// next
import { useRouter } from 'next/navigation';

// project import
import Loader from 'components/Loader';
import { APP_DEFAULT_PATH } from 'config';
import useAuth from 'hooks/useAuth';

// types
import { GuardProps } from 'types/auth';
import { sleep } from 'utils/sleep';

// ==============================|| GUEST GUARD ||============================== //

export default function GuestGuard({ children }: GuardProps) {
  const router = useRouter();
  const { loading, user } = useAuth();

  const fetchData = async () => {
    await sleep(0.5);
    if (user) {
      router.push(APP_DEFAULT_PATH);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  if (loading) return <Loader />;

  return children;
}
