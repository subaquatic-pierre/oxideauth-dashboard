export type TokenKind = "auth" | "password_reset"

export interface BlacklistedToken {
  id: string
  workspace_id: string
  kind: TokenKind
  account_id: string
  reason?: string
  expires_at?: string
  tags?: string[]
  meta?: Record<string, unknown>
  created_at: string
  updated_at: string
}
