import { Role } from '@/types/role';

import { BaseClient } from './client';
import { CREATE_PERMISSIONS, DELETE_PERMISSIONS, DESCRIBE_ROLE, LIST_PERMISSIONS, LIST_ROLES } from './endpoints';

class RoleClient extends BaseClient {
  constructor() {
    super();
  }

  async listRoles(): Promise<Role[]> {
    const data = await super.req<{ roles: Role[] }>({ endpoint: LIST_ROLES });
    return data.roles;
  }

  async listPermissions(): Promise<string[]> {
    const data = await super.req<{ permissions: string[] }>({ endpoint: LIST_PERMISSIONS });
    return data.permissions;
  }

  async describeRole(id_or_name: string): Promise<Role> {
    const data = await super.req<{ role: Role }>({
      endpoint: DESCRIBE_ROLE,
      method: 'POST',
      data: { role: id_or_name },
    });
    return data.role;
  }

  async createPermissions(permissions: string[]): Promise<string[]> {
    const data = await super.req<{ createdPermissions: string[] }>({
      endpoint: CREATE_PERMISSIONS,
      method: 'POST',
      data: { permissions },
    });
    return data.createdPermissions;
  }

  async deletePermissions(permissions: string[]): Promise<string[]> {
    const data = await super.req<{ createdPermissions: string[] }>({
      endpoint: DELETE_PERMISSIONS,
      method: 'POST',
      data: { permissions },
    });
    return data.createdPermissions;
  }
}

export const roleClient = new RoleClient();
