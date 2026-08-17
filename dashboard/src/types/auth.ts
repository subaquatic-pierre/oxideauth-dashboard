import type { Account } from "./account";

export type User = Account;
export type LoginRequest = AuthLoginReq;
export type RegisterRequest = AuthRegisterReq;
export type AuthResponse = AuthLoginRes;

export type TokenType = "Auth" | "PasswordReset" | "Refresh" | "AccountConfirm";
export type AuthProvider = "local" | "google" | "github";

/** Deserialized JWT claims matching the backend `TokenClaims` struct. */
export interface TokenClaims {
  /** Account ID (UUID) */
  sub: string;
  /** Workspace ID (UUID) — may be nil UUID for account-level tokens */
  ws: string;
  /** Membership ID (UUID) */
  mem: string;
  /** Issuer identifier */
  iss: string;
  /** Audience identifier */
  aud: string;
  /** Expiration timestamp (Unix seconds) */
  exp: number;
  /** Issued-at timestamp (Unix seconds) */
  iat: number;
  /** Token type — JSON key is `ty` not `typ` (matches Rust field name) */
  ty: TokenType;
  /** Membership token version */
  mem_ver: number;
  /** Account token version */
  acc_ver: number;
  /** Session ID (absent for single-use tokens) */
  sid: string | null;
  /** JWT ID — unique per token */
  jti: string | null;
}

export interface AuthLoginRes {
  account: Account;
  accessToken: string;
  refreshToken: string;
}

export type AuthRegisterRes = AuthLoginRes;

export interface AuthRefreshRes {
  accessToken: string;
  refreshToken: string;
}

export interface AuthRevokeRes {
  revoked: true;
}

export interface AuthResetPasswordRes {
  message: string;
}

export interface AuthUpdatePasswordRes {
  account_id: string;
}

export interface AuthConfirmAccountRes {
  account_id: string;
  verified: boolean;
}

export interface AuthResendConfirmRes {
  message: string;
}

export interface AuthOAuthInitiateRes {
  auth_url: string;
}

export interface AuthLoginReq {
  email: string;
  password: string;
  workspace: {
    id: string;
  };
}

export interface AuthRegisterReq {
  email: string;
  password?: string;
  name?: string;
}

export interface AuthResetPasswordReq {
  email: string;
}

export interface AuthUpdatePasswordReq {
  token: string;
  password: string;
}

export interface AuthConfirmAccountReq {
  token: string;
}

export interface AuthResendConfirmReq {
  email: string;
}

export interface AuthOAuthInitiateReq {
  redirect_url: string;
}

export interface AuthState {
  account: Account | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isPending: boolean;
}
