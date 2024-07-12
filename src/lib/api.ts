import axios from 'axios';
import {
  LIST_ACCOUNTS,
  DESCRIBE_ACCOUNT,
  LIST_ROLES,
  DESCRIBE_ROLE,
  LIST_PERMISSIONS,
  DESCRIBE_SERVICE,
  LIST_SERVICES,
  CREATE_PERMISSIONS,
  DELETE_PERMISSIONS
} from './endpoints';
import { Account } from 'types/account';
import { Role } from 'types/role';
import { Service } from 'types/service';

export const listAccounts = async (): Promise<Account[]> => {
  const data = await apiReqWithAuth<{ accounts: Account[] }>({ endpoint: LIST_ACCOUNTS });
  return data.accounts;
};

export const describeAccount = async (id_or_name: string): Promise<Account> => {
  const data = await apiReqWithAuth<{ account: Account }>({ endpoint: DESCRIBE_ACCOUNT, method: 'POST', data: { account: id_or_name } });
  return data.account;
};

export const listRoles = async (): Promise<Role[]> => {
  const data = await apiReqWithAuth<{ roles: Role[] }>({ endpoint: LIST_ROLES });
  return data.roles;
};

export const listPermissions = async (): Promise<string[]> => {
  const data = await apiReqWithAuth<{ permissions: string[] }>({ endpoint: LIST_PERMISSIONS });
  return data.permissions;
};

export const describeRole = async (id_or_name: string): Promise<Role> => {
  const data = await apiReqWithAuth<{ role: Role }>({ endpoint: DESCRIBE_ROLE, method: 'POST', data: { role: id_or_name } });
  return data.role;
};

export const listServices = async (): Promise<Service[]> => {
  const data = await apiReqWithAuth<{ services: Service[] }>({ endpoint: LIST_SERVICES });
  return data.services;
};

export const describeService = async (id_or_name: string): Promise<Service> => {
  const data = await apiReqWithAuth<{ service: Service }>({ endpoint: DESCRIBE_SERVICE, method: 'POST', data: { service: id_or_name } });
  return data.service;
};

export const createPermissions = async (permissions: string[]): Promise<string[]> => {
  const data = await apiReqWithAuth<{ createdPermissions: string[] }>({
    endpoint: CREATE_PERMISSIONS,
    method: 'POST',
    data: { permissions }
  });
  return data.createdPermissions;
};

export const deletePermissions = async (permissions: string[]): Promise<string[]> => {
  const data = await apiReqWithAuth<{ createdPermissions: string[] }>({
    endpoint: DELETE_PERMISSIONS,
    method: 'POST',
    data: { permissions }
  });
  return data.createdPermissions;
};

const apiHost = process.env.NEXT_PUBLIC_SERVER_ENDPOINT;

type Object = Record<string, number | string | null>;

export type ApiMethod = 'POST' | 'PUT' | 'GET' | 'DELETE';
export type ApiResponse<Model = Object> = {
  data: Model;
  error?: Partial<Object & { message: string }>;
};
export type ApiRequest = {
  endpoint: string;
  method?: ApiMethod;
  data?: object;
  headers?: object;
};

export const apiReq = async <Model = object>({ endpoint, method = 'GET', data, headers }: ApiRequest): Promise<Model> => {
  const res = await axios.request<any, ApiResponse<Model>>({
    method: method,
    url: `${apiHost}${endpoint}`,
    data,
    headers
  });

  return res.data;
};

export const apiReqWithAuth = async <Model = object>({ endpoint, method = 'GET', data, headers }: ApiRequest): Promise<Model> => {
  const token = window.localStorage.getItem('token');

  if (!token) {
    throw Error('No auth token in client');
  }

  const _headers = {
    ...headers,
    Authorization: `Bearer ${token}`
  };

  return apiReq({ endpoint, method, data, headers: _headers });
};
