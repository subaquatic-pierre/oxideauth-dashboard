import { useContext } from 'react';
import { AuthContext } from 'contexts/AuthContext';

// ==============================|| CONFIG - HOOKS ||============================== //

export default function useAuth() {
  return useContext(AuthContext);
}
