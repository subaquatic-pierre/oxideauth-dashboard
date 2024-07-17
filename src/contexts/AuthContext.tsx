'use client';

import { createContext, ReactElement, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Account } from '@/types/account';
import { AuthContextProps } from '@/types/auth';
import { authClient } from '@/lib/api/auth';
import { DESCRIBE_SELF } from '@/lib/api/endpoints';

// initial state
const initialState: AuthContextProps = {
  user: null,
  loading: false,
  logout: () => {},
  login: () => {},
  error: null,
};

const AuthContext = createContext(initialState);

function AuthContextProvider({ children }: React.PropsWithChildren): React.JSX.Element {
  const router = useRouter();
  const [user, setUser] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>('');

  const login = async (token: string) => {
    setLoading(true);
    window.localStorage.setItem('token', token as string);
    try {
      const account = await authClient.getUser();

      setUser(account);
    } catch (e) {
      console.log(e);
    }

    router.push('/dashboard');
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
    window.localStorage.removeItem('token');
    router.push('/login');
  };

  const loadUser = async () => {
    // return early if no token in localStorage
    if (!window.localStorage.getItem('token')) {
      setLoading(false);
      return;
    }

    try {
      const account = await authClient.getUser();

      setUser(account);
    } catch (e) {
      setError(`${e}`);
      console.log(e);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        loading,
        logout,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContextProvider, AuthContext };
