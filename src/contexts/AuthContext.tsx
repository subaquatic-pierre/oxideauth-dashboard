'use client';
import { createContext, ReactElement, useState } from 'react';

// project import
import defaultConfig, { MenuOrientation, ThemeDirection, ThemeMode } from 'config';
import useLocalStorage from 'hooks/useLocalStorage';

// types
import { AuthContextProps } from 'types/auth';

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
  const [loading, setLoading] = useState(false);
  return (
    <AuthContext.Provider
      value={{
        user: null,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContextProvider, AuthContext };
