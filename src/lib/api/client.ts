import axios from 'axios';

const apiHost = process.env.NEXT_PUBLIC_SERVER_ENDPOINT ?? 'http://localhost:8080';

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
  headers?: { [key: string]: string };
  auth?: boolean;
};

export class BaseClient {
  async req<Model = {}>({ endpoint, data, headers, method = 'GET', auth = false }: ApiRequest): Promise<Model> {
    let _headers: { [key: string]: string } = headers ?? {};
    if (auth) {
      const token = window.localStorage.getItem('token');

      if (!token) {
        throw Error('No auth token in client');
      }
      _headers['Authorization'] = `Bearer ${token}`;
    }
    try {
      const res = await axios.request<any, ApiResponse<Model>>({
        method: method,
        url: `${apiHost}${endpoint}`,
        data,
        headers: _headers,
      });

      return res.data;
    } catch (e: any) {
      const message = e?.response?.data?.message ?? e.message;
      throw Error(message);
    }
  }
}

export const baseClient = new BaseClient();
