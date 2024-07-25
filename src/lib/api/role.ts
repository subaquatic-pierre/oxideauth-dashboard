import { Account } from 'types/account';
import { Role } from 'types/role';

import { BaseClient } from './client';
import {
  ASSIGN_PERMISSIONS,
  ASSIGN_ROLES,
  CREATE_PERMISSIONS,
  CREATE_ROLE,
  DELETE_PERMISSIONS,
  DELETE_ROLE,
  DESCRIBE_ROLE,
  LIST_PERMISSIONS,
  LIST_ROLES,
  REMOVE_PERMISSIONS,
  REMOVE_ROLES,
  UPDATE_ROLE
} from './endpoints';

interface AssignPermissionsParams {
  role: string;
  permissions: string[];
}

interface AssignRolesParams {
  account: string;
  roles: string[];
}

interface CreateRoleParams {
  name: string;
  description?: string;
  permissions?: string[];
}
interface UpdateRoleParams {
  role: string;
  name?: string;
  description?: string;
}

class RoleClient extends BaseClient {
  constructor() {
    super();
  }

  async listRoles(): Promise<Role[]> {
    const data = await super.req<{ roles: Role[] }>({ endpoint: LIST_ROLES });
    return data.roles;
  }

  async describeRole(idOrName: string): Promise<Role> {
    const data = await super.req<{ role: Role }>({
      endpoint: DESCRIBE_ROLE,
      method: 'POST',
      data: { role: idOrName }
    });
    return data.role;
  }

  async createRole(newRoleData: CreateRoleParams): Promise<Role> {
    const data = await super.req<{ role: Role }>({
      endpoint: CREATE_ROLE,
      data: newRoleData,
      auth: true,
      method: 'POST'
    });

    return data.role;
  }

  async updateRole(updateRoleData: UpdateRoleParams): Promise<Role> {
    const data = await super.req<{ role: Role }>({
      endpoint: UPDATE_ROLE,
      data: updateRoleData,
      auth: true,
      method: 'POST'
    });

    return data.role;
  }

  async deleteRole(idOrName: string): Promise<string> {
    const data = await super.req<{ deleted_role: string }>({
      endpoint: DELETE_ROLE,
      data: { role: idOrName },
      auth: true,
      method: 'POST'
    });

    return data.deleted_role;
  }

  async removeRoles(removeRolesParams: AssignRolesParams): Promise<Account> {
    const data = await super.req<{ account: Account }>({
      endpoint: REMOVE_ROLES,
      method: 'POST',
      data: removeRolesParams,
      auth: true
    });
    return data.account;
  }

  async assignRoles(assignRolesParams: AssignRolesParams): Promise<Account> {
    const data = await super.req<{ account: Account }>({
      endpoint: ASSIGN_ROLES,
      method: 'POST',
      data: assignRolesParams,
      auth: true
    });
    return data.account;
  }

  // Permissions
  // ---

  async assignPermissions(assignPermsParams: AssignPermissionsParams): Promise<Role> {
    const data = await super.req<{ role: Role }>({
      endpoint: ASSIGN_PERMISSIONS,
      method: 'POST',
      auth: true,
      data: assignPermsParams
    });
    return data.role;
  }

  async removePermissions(removePermissionsParams: AssignPermissionsParams): Promise<Role> {
    const data = await super.req<{ role: Role }>({
      endpoint: REMOVE_PERMISSIONS,
      method: 'POST',
      auth: true,
      data: removePermissionsParams
    });
    return data.role;
  }

  async listPermissions(): Promise<string[]> {
    const data = await super.req<{ permissions: string[] }>({ endpoint: LIST_PERMISSIONS });
    return data.permissions;
  }

  async createPermissions(permissions: string[]): Promise<string[]> {
    const data = await super.req<{ createdPermissions: string[] }>({
      endpoint: CREATE_PERMISSIONS,
      method: 'POST',
      data: { permissions }
    });

    return data.createdPermissions;
  }

  async deletePermissions(permissions: string[]): Promise<string[]> {
    const data = await super.req<{ deletedPermissions: string[] }>({
      endpoint: DELETE_PERMISSIONS,
      method: 'POST',
      data: { permissions }
    });

    return data.deletedPermissions;
  }
}

export const roleClient = new RoleClient();
