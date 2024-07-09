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
  const { loading } = useAuth();

  if (loading) return <Loader />;

  return children;
}
