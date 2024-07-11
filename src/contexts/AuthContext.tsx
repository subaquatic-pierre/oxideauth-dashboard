'use client';
import { createContext, ReactElement, useEffect, useState } from 'react';

// project import
import defaultConfig, { APP_DEFAULT_PATH, MenuOrientation, ThemeDirection, ThemeMode } from 'config';
import useLocalStorage from 'hooks/useLocalStorage';

// types
import { AuthContextProps, UserProfile } from 'types/auth';
import { apiReq, apiReqWithAuth } from 'lib/api';
import { DESCRIBE_SELF } from 'lib/endpoints';
import { useRouter } from 'next/navigation';

// initial state
const initialState: AuthContextProps = {
  user: null,
  loading: false,
  logout: () => {},
  login: () => {}
};

// ==============================|| CONFIG CONTEXT & PROVIDER ||============================== //

const AuthContext = createContext(initialState);

type ConfigProviderProps = {
  children: ReactElement;
};

function AuthContextProvider({ children }: ConfigProviderProps) {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const login = async (token: string) => {
    setLoading(true);
    window.localStorage.setItem('token', token as string);
    try {
      const res = await apiReq<{ account: any }>({ endpoint: DESCRIBE_SELF, headers: { Authorization: `Bearer ${token}` } });
      const apiUser = res.data.account;

      if (!res.error) {
        const user: UserProfile = {
          id: apiUser.id,
          email: apiUser.email,
          imageUrl: apiUser.imageUrl,
          name: apiUser.name
        };

        setUser(user);
      }
    } catch (e) {
      console.log(e);
    }
    router.push(APP_DEFAULT_PATH);
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
    window.localStorage.removeItem('token');
    router.push('/login');
  };

  const loadUser = async () => {
    try {
      const res = await apiReqWithAuth<{ account: any }>({ endpoint: DESCRIBE_SELF });
      const apiUser = res.data.account;

      if (!res.error) {
        const user: UserProfile = {
          id: apiUser.id,
          email: apiUser.email,
          imageUrl: apiUser.imageUrl,
          name: apiUser.name
        };

        setUser(user);
      }
    } catch (e) {
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
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContextProvider, AuthContext };
