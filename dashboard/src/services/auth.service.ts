import { BaseService } from "./base"
import type { User, LoginRequest, RegisterRequest, AuthResponse } from "@/types/auth"

export class AuthService extends BaseService {
  async me(): Promise<User | null> {
    // User data is stored at login time; token validation is client-side
    const stored = typeof window !== "undefined" ? localStorage.getItem("auth_user") : null
    return stored ? JSON.parse(stored) : null
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    return this.post<AuthResponse>("/auth/login", data)
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    return this.post<AuthResponse>("/auth/register", data)
  }

  async refresh(): Promise<AuthResponse> {
    return this.post<AuthResponse>("/auth/refresh")
  }

  async revoke(): Promise<void> {
    return this.post<void>("/auth/revoke")
  }
}
