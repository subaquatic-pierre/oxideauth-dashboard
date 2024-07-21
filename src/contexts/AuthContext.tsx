'use client';

import { createContext, ReactElement, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Account } from '@/types/account';
import { AuthContextProps } from '@/types/auth';
import { paths } from '@/paths';
import { authClient } from '@/lib/api/auth';
import { DESCRIBE_SELF } from '@/lib/api/endpoints';

// initial state
const initialState: AuthContextProps = {
  user: null,
  loading: false,
  error: null,
  checkSession: () => {},
};

const AuthContext = createContext(initialState);

function AuthContextProvider({ children }: React.PropsWithChildren): React.JSX.Element {
  const [user, setUser] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>('');

  const loadUser = async () => {
    // return early if no token in localStorage
    if (!window.localStorage.getItem('token')) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const account = await authClient.getUser();
      setUser(account);
    } catch (e) {
      setError(`${e}`);
      window.localStorage.removeItem('token');
      console.log(e);
    }

    setLoading(false);
  };

  const checkSession = async () => {
    setLoading(true);
    await loadUser();
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        checkSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContextProvider, AuthContext };
