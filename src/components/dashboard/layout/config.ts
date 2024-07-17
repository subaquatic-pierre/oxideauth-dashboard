import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  { key: 'overview', title: 'Overview', href: paths.dashboard.overview, icon: 'chart-pie' },
  { key: 'services', title: 'Services', href: paths.dashboard.services, icon: 'plugs-connected' },
  { key: 'users', title: 'Users', href: paths.dashboard.users, icon: 'users' },
  { key: 'serviceAccounts', title: 'Service Accounts', href: paths.dashboard.serviceAccounts, icon: 'user' },
  { key: 'roles', title: 'Roles', href: paths.dashboard.roles, icon: 'user' },
  { key: 'permissions', title: 'Permissions', href: paths.dashboard.permissions, icon: 'gear-six' },
  { key: 'settings', title: 'Settings', href: paths.dashboard.settings, icon: 'gear-six' },
  // { key: 'error', title: 'Error', href: paths.errors.notFound, icon: 'x-square' },
] satisfies NavItemConfig[];
