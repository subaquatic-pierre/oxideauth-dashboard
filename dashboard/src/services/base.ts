import { api, ApiError } from "@/lib/api"

export abstract class BaseService {
  protected async get<T>(path: string): Promise<T> {
    return api<T>(path)
  }

  protected async post<T>(path: string, body?: unknown): Promise<T> {
    return api<T>(path, {
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  protected async patch<T>(path: string, body?: unknown): Promise<T> {
    // OxideAuth uses POST for all operations, so patch is the same as post
    return this.post<T>(path, body)
  }

  protected async del<T = void>(path: string, body?: unknown): Promise<T> {
    return api<T>(path, {
      body: body ? JSON.stringify(body) : undefined,
    })
  }
}
