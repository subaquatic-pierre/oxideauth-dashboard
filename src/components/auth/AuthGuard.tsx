'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Alert from '@mui/material/Alert';

import { paths } from '@/paths';
import { logger } from '@/lib/defaultLogger';
import { useAuth } from '@/hooks/useAuth';
import useNotify from '@/hooks/useNotify';

export interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps): React.JSX.Element | null {
  const notify = useNotify();
  const router = useRouter();
  const { user, error, loading } = useAuth();
  const [isChecking, setIsChecking] = React.useState<boolean>(true);

  const checkPermissions = async (): Promise<void> => {
    if (loading) {
      return;
    }

    if (error) {
      setIsChecking(false);
      return;
    }

    if (!user) {
      logger.debug('[AuthGuard]: User is not logged in, redirecting to sign in');
      router.replace(paths.auth.signIn);
      return;
    }

    setIsChecking(false);
  };

  React.useEffect(() => {
    if (error) {
      window.localStorage.removeItem('token');
      router.replace(paths.auth.signIn);

      notify(error, 'error');
    }
    checkPermissions().catch(() => {
      // noop
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Expected
  }, [user, error, loading]);

  if (isChecking) {
    return null;
  }

  return <React.Fragment>{children}</React.Fragment>;
}
