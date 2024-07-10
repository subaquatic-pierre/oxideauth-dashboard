'use client';
import { createContext, ReactElement, useEffect, useState } from 'react';

// project import
import defaultConfig, { MenuOrientation, ThemeDirection, ThemeMode } from 'config';
import useLocalStorage from 'hooks/useLocalStorage';

// types
import { AuthContextProps, UserProfile } from 'types/auth';
import { apiReqWithAuth } from 'lib/api';
import { DESCRIBE_SELF } from 'lib/endpoints';

// initial state
const initialState: AuthContextProps = {
  user: null,
  loading: false
};

// ==============================|| CONFIG CONTEXT & PROVIDER ||============================== //

const AuthContext = createContext(initialState);

type ConfigProviderProps = {
  children: ReactElement;
};

function AuthContextProvider({ children }: ConfigProviderProps) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    try {
      const res = await apiReqWithAuth<{ account: any }>({ endpoint: DESCRIBE_SELF });
      const apiUser = res.data.account;
      const user: UserProfile = {
        id: apiUser.id,
        email: apiUser.email,
        imageUrl: apiUser.imageUrl,
        name: apiUser.name
      };

      setUser(user);
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
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContextProvider, AuthContext };
