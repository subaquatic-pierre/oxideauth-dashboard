import type { Account } from "./account"

export type User = Account
export type LoginRequest = AuthLoginReq
export type RegisterRequest = AuthRegisterReq
export type AuthResponse = AuthLoginRes

export type TokenType = "Auth" | "PasswordReset" | "Refresh" | "AccountConfirm"
export type AuthProvider = "local" | "google" | "github"

export interface AuthLoginRes {
  account: Account
  accessToken: string
  refreshToken: string
}

export type AuthRegisterRes = AuthLoginRes

export interface AuthRefreshRes {
  accessToken: string
  refreshToken: string
}

export interface AuthRevokeRes {
  revoked: true
}

export interface AuthResetPasswordRes {
  message: string
}

export interface AuthUpdatePasswordRes {
  account_id: string
}

export interface AuthConfirmAccountRes {
  account_id: string
  verified: boolean
}

export interface AuthResendConfirmRes {
  message: string
}

export interface AuthOAuthInitiateRes {
  auth_url: string
}

export interface AuthLoginReq {
  email: string
  password: string
}

export interface AuthRegisterReq {
  email: string
  password?: string
  name?: string
}

export interface AuthResetPasswordReq {
  email: string
}

export interface AuthUpdatePasswordReq {
  token: string
  password: string
}

export interface AuthConfirmAccountReq {
  token: string
}

export interface AuthResendConfirmReq {
  email: string
}

export interface AuthOAuthInitiateReq {
  redirect_url: string
}

export interface AuthState {
  account: Account | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isPending: boolean
}
