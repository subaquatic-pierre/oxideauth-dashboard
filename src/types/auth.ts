import { ReactElement } from 'react';

// ==============================|| AUTH TYPES ||============================== //

export type GuardProps = {
  children: ReactElement | null;
};

export type AuthContextProps = {
  user: UserProfile | null;
  loading: boolean;
  logout: () => void;
  login: (token: string) => void;
};

export type UserProfile = {
  id?: string;
  email?: string;
  name?: string;
  imageUrl?: string;
};
