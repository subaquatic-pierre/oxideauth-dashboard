'use client';

import { useEffect } from 'react';

// next
import { useRouter } from 'next/navigation';

// project-import
import Loader from 'components/Loader';

// types
import { GuardProps } from 'types/auth';
import useAuth from 'hooks/useAuth';

// ==============================|| AUTH GUARD ||============================== //

export default function AuthGuard({ children }: GuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  const fetchData = async () => {
    if (!user && !loading) {
      router.push('/login');
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  if (loading) return <Loader />;

  return children;
}
