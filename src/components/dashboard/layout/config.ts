import { hasPerms } from 'lib/accountPerms';
import { paths } from 'paths';
import { Account } from 'types/account';
import type { NavItemConfig } from 'types/nav';

export const navItems = [
  { key: 'overview', title: 'Overview', href: paths.dashboard.overview, icon: 'chart-pie' },
  { key: 'services', title: 'Services', href: paths.dashboard.services, icon: 'plugs-connected' },
  { key: 'users', title: 'Users', href: paths.dashboard.users, icon: 'users' },
  { key: 'serviceAccounts', title: 'Service Accounts', href: paths.dashboard.serviceAccounts, icon: 'service-account' },
  { key: 'roles', title: 'Roles', href: paths.dashboard.roles, icon: 'role' },
  { key: 'permissions', title: 'Permissions', href: paths.dashboard.permissions, icon: 'cert' },
  { key: 'settings', title: 'Settings', href: paths.dashboard.settings, icon: 'gear-six' }
  // { key: 'error', title: 'Error', href: paths.errors.notFound, icon: 'x-square' },
] satisfies NavItemConfig[];

export const getNavItems = (account: Account | null): NavItemConfig[] => {
  const allNavItems: NavItemConfig[] = [{ key: 'overview', title: 'Overview', href: paths.dashboard.overview, icon: 'chart-pie' }];
  const allPerms = [];
  if (!account) return allPerms;
  for (const role of account.roles) {
    role.permissions.forEach((perm) => allPerms.push(perm));
  }

  if (hasPerms(account, 'auth.services.list')) {
    allNavItems.push({ key: 'services', title: 'Services', href: paths.dashboard.services, icon: 'plugs-connected' });
  }
  if (hasPerms(account, 'auth.accounts.list')) {
    allNavItems.push({ key: 'users', title: 'Users', href: paths.dashboard.users, icon: 'users' });
    allNavItems.push({ key: 'serviceAccounts', title: 'Service Accounts', href: paths.dashboard.serviceAccounts, icon: 'service-account' });
  }
  if (hasPerms(account, 'auth.roles.list')) {
    allNavItems.push({ key: 'roles', title: 'Roles', href: paths.dashboard.roles, icon: 'role' });
  }
  if (hasPerms(account, 'auth.permissions.list')) {
    allNavItems.push({ key: 'permissions', title: 'Permissions', href: paths.dashboard.permissions, icon: 'cert' });
  }

  allNavItems.push({ key: 'settings', title: 'Settings', href: paths.dashboard.settings, icon: 'gear-six' });

  return allNavItems;
};
