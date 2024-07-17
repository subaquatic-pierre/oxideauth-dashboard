import { Service } from '@/types/service';

import { BaseClient } from './client';
import { DESCRIBE_SERVICE, LIST_SERVICES } from './endpoints';

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
}

export const serviceClient = new ServiceClient();
