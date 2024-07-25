export const paths = {
  home: '/',
  auth: {
    confirmAccount: '/auth/confirm-account',
    signIn: '/auth/sign-in',
    signUp: '/auth/sign-up',
    resetPassword: '/auth/reset-password'
  },
  dashboard: {
    overview: '/dashboard',
    services: '/dashboard/services',
    users: '/dashboard/users',
    serviceAccounts: '/dashboard/service-accounts',
    roles: '/dashboard/roles',
    permissions: '/dashboard/permissions',
    settings: '/dashboard/settings'
  },
  errors: { notFound: '/errors/not-found' }
} as const;
