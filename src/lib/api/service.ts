import { Service } from 'types/service';

import { BaseClient } from './client';
import {
  CREATE_SERVICE,
  DELETE_SERVICE,
  DESCRIBE_SERVICE,
  GET_SERVICE_ACCOUNT_SECRET_KEY,
  LIST_SERVICES,
  UPDATE_SERVICE
} from './endpoints';

export interface CreateServiceParams {
  name: string;
  endpoint: string;
  description: string;
}

export interface UpdateServiceParams {
  service: string;
  name?: string;
  endpoint?: string;
  description?: string;
}

export class ServiceClient extends BaseClient {
  async listServices(): Promise<Service[]> {
    const data = await super.req<{ services: Service[] }>({ endpoint: LIST_SERVICES, auth: true });
    return data.services;
  }

  async describeService(idOrName: string): Promise<Service> {
    const data = await super.req<{ service: Service }>({
      endpoint: DESCRIBE_SERVICE,
      method: 'POST',
      data: { service: idOrName }
    });
    return data.service;
  }

  async createService(newServiceData: CreateServiceParams): Promise<Service> {
    const data = await super.req<{ service: Service }>({
      endpoint: CREATE_SERVICE,
      method: 'POST',
      data: newServiceData
    });
    return data.service;
  }

  async updateService(updateServiceData: UpdateServiceParams): Promise<Service> {
    const data = await super.req<{ service: Service }>({
      endpoint: UPDATE_SERVICE,
      method: 'POST',
      data: updateServiceData
    });
    return data.service;
  }

  async deleteService(idOrName: string): Promise<Service> {
    const data = await super.req<{ service: Service }>({
      endpoint: DELETE_SERVICE,
      method: 'POST',
      data: { service: idOrName }
    });
    return data.service;
  }
}

export const serviceClient = new ServiceClient();
