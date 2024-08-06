import { Account } from 'types/account';

export const hasPerms = (account: Account | null, perms: string[] | string): boolean => {
  const allPerms = [];
  if (!account) return false;
  for (const role of account.roles) {
    role.permissions.forEach((perm) => allPerms.push(perm));
  }

  if (Array.isArray(perms)) {
    for (const needed of perms) {
      if (!allPerms.includes(needed)) {
        return false;
      }
    }

    return true;
  }

  if (!allPerms.includes(perms)) {
    return false;
  }

  return true;
};
