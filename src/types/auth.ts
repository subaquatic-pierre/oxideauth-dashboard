import { ReactElement } from 'react';
import { Account } from './account';

// ==============================|| AUTH TYPES ||============================== //

export type GuardProps = {
  children: ReactElement | null;
};

export type AuthContextProps = {
  user: Account | null;
  loading: boolean;
  logout: () => void;
  login: (token: string) => void;
};
