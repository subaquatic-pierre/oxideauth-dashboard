import * as React from 'react';

import { AuthContextProps } from '@/types/auth';
import { AuthContext } from '@/contexts/AuthContext';

export function useAuth(): AuthContextProps {
  const context = React.useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within a AuthContextProvider');
  }

  return context;
}
