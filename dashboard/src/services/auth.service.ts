import { BaseService } from "./base";
import type {
  User,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
} from "@/types/auth";
import { isGuestMode, setGuestMode } from "@/lib/guest-mode";
import { GUEST_USER } from "@/lib/mock-data";
import { mockOk } from "@/lib/mock-ok";

export class AuthService extends BaseService {
  private _refreshToken: string | null = null;

  get refreshToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("auth_refresh_token");
    }
    return this._refreshToken;
  }

  async me(): Promise<User | null> {
    if (isGuestMode()) {
      return mockOk(GUEST_USER).data as unknown as User;
    }
    const stored =
      typeof window !== "undefined" ? localStorage.getItem("auth_user") : null;
    if (typeof window !== "undefined") {
      const rt = localStorage.getItem("auth_refresh_token");
      this._refreshToken = rt;
    }
    return stored ? JSON.parse(stored) : null;
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    // In guest mode, return mock auth response
    if (isGuestMode()) {
      setGuestMode(false); // cleanly exit guest mode on "login"
      return mockOk({ token: "guest-mock-token", account: GUEST_USER })
        .data as unknown as AuthResponse;
    }
    const result = await this.post<AuthResponse>("/auth/login", data);
    console.log(result);
    // Ensure guest mode is off after real login
    setGuestMode(false);
    return result;
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    // In guest mode, return mock auth response
    if (isGuestMode()) {
      setGuestMode(false);
      return mockOk({ token: "guest-mock-token", account: GUEST_USER })
        .data as unknown as AuthResponse;
    }
    const result = await this.post<AuthResponse>("/auth/register", data);
    setGuestMode(false);
    return result;
  }

  async refresh(): Promise<AuthResponse> {
    if (isGuestMode()) {
      return mockOk({ token: "guest-mock-token", account: GUEST_USER })
        .data as unknown as AuthResponse;
    }
    return this.post<AuthResponse>("/auth/refresh");
  }

  async revoke(): Promise<void> {
    if (isGuestMode()) {
      return;
    }
    return this.post<void>("/auth/revoke");
  }
}
