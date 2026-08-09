export interface EntityMeta {
  schema_version: string
}

export type AccountMeta = EntityMeta
export type WorkspaceMeta = EntityMeta
export type ProjectMeta = EntityMeta
export type RoleMeta = EntityMeta
export type PermissionMeta = EntityMeta
export type MembershipMeta = EntityMeta
export type CredentialMeta = EntityMeta
export type ClientMeta = EntityMeta

export interface EntityConfig {
  schema_version: string
}

export type WorkspaceConfig = EntityConfig
export type ProjectConfig = EntityConfig

export interface ListFilters {
  tags?: string[]
  fields?: Record<string, unknown>
  limit?: number
  offset?: number
  order_bys?: string[]
}
