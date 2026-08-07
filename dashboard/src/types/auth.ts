export interface User {
  id: string
  email: string
  name: string
  verified: boolean
  enabled: boolean
  avatar_url?: string
  created_at?: string
  updated_at?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  name: string
}

export interface AuthResponse {
  token: string
  account: User
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isPending: boolean
}
