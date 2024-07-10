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

// ==============================|| GUEST GUARD ||============================== //

export default function GuestGuard({ children }: GuardProps) {
  const router = useRouter();
  const { loading, user } = useAuth();

  const fetchData = async () => {
    console.log(user);
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
