import { Service } from '@/types/service';

import { BaseClient } from './client';
import { CREATE_SERVICE, DELETE_SERVICE, DESCRIBE_SERVICE, LIST_SERVICES, UPDATE_SERVICE } from './endpoints';

interface CreateServiceParams {
  name: string;
  endpoint: string;
  description: string;
}

interface UpdateServiceParams {
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

  async describeService(id_or_name: string): Promise<Service> {
    const data = await super.req<{ service: Service }>({
      endpoint: DESCRIBE_SERVICE,
      method: 'POST',
      data: { service: id_or_name },
      auth: true,
    });
    return data.service;
  }

  async createService(newServiceData: CreateServiceParams): Promise<Service> {
    const data = await super.req<{ service: Service }>({
      endpoint: CREATE_SERVICE,
      method: 'POST',
      data: newServiceData,
      auth: true,
    });
    return data.service;
  }

  async updateService(updateServiceData: UpdateServiceParams): Promise<Service> {
    const data = await super.req<{ service: Service }>({
      endpoint: UPDATE_SERVICE,
      method: 'POST',
      data: updateServiceData,
      auth: true,
    });
    return data.service;
  }

  async deleteService(id_or_name: string): Promise<Service> {
    const data = await super.req<{ service: Service }>({
      endpoint: DELETE_SERVICE,
      method: 'POST',
      data: { service: id_or_name },
      auth: true,
    });
    return data.service;
  }
}

export const serviceClient = new ServiceClient();
