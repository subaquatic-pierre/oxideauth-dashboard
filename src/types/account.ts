import { Role } from './role';

type AccountType = 'user' | 'service';
type AccountProvider = 'local' | 'google';

export type Account = {
  id: string;
  verified: boolean;
  enabled: boolean;
  email?: string;
  name?: string;
  imageUrl?: string;
  type?: AccountType;
  provider?: AccountProvider;
  description?: string;
  roles?: Role[];
};
