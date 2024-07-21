import { Account } from '@/types/account';

export const checkIsAdmin = (user: Account | null): boolean => {
  if (!user) {
    return false;
  }
  const roles = user.roles;

  if (roles?.findIndex((el) => el.name === 'Admin') !== -1) {
    return true;
  }

  if (roles?.findIndex((el) => el.name === 'Owner') !== -1) {
    return true;
  }

  return false;
};

export const checkIsAuditor = (user: Account | null): boolean => {
  if (!user) {
    return false;
  }
  const roles = user.roles;

  if (roles?.findIndex((el) => el.name === 'Auditor') !== -1) {
    return true;
  }

  return false;
};
