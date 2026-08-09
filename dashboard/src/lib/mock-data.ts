/**
 * Guest-mode mock data — static datasets for all 8 resource types plus a mock
 * guest user. Each dataset contains 3–5 plausible records (per FR-010) so
 * the dashboard UI is fully explorable without a real API connection.
 *
 * Datasets are workspace-keyed: at least two dummy workspace IDs are defined
 * so the workspace selector shows realistic switching behaviour (FR-016).
 * Services look up mock data by workspace_id when running in guest mode.
 */
import type {
  MockWorkspace, MockAccount, MockProject, MockRole,
  MockPermission, MockMembership, MockCredential,
} from "@/types/mock-data";

// ── Workspace IDs ─────────────────────────────────────────────────────────
export const WORKSPACE_ONE = "ws-001-guest-demo";
export const WORKSPACE_TWO = "ws-002-guest-staging";
export const WORKSPACE_THREE = "ws-003-guest-sandbox";
export const GUEST_WORKSPACES = [WORKSPACE_ONE, WORKSPACE_TWO, WORKSPACE_THREE];

// ── Guest user ────────────────────────────────────────────────────────────
export const GUEST_USER = {
  id: "guest-user-001",
  email: "guest@oxideauth.demo",
  name: "Guest User",
  verified: true,
  enabled: true,
  avatar_url: "",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

// ── Workspaces ────────────────────────────────────────────────────────────
export const MOCK_WORKSPACES: MockWorkspace[] = [
  {
    id: WORKSPACE_ONE,
    name: "Demo Org",
    slug: "demo-org",
    description: "Primary demo workspace showing IAM features",
    tags: ["demo", "production"],
    created_at: "2026-01-15T10:00:00Z",
    updated_at: "2026-08-01T14:30:00Z",
  },
  {
    id: WORKSPACE_TWO,
    name: "Staging Environment",
    slug: "staging-env",
    description: "Pre-production testing workspace",
    tags: ["staging", "testing"],
    created_at: "2026-03-22T08:00:00Z",
    updated_at: "2026-07-28T09:15:00Z",
  },
  {
    id: WORKSPACE_THREE,
    name: "Sandbox",
    slug: "sandbox",
    description: "Isolated sandbox for experiments",
    tags: ["sandbox", "development"],
    created_at: "2026-06-01T12:00:00Z",
    updated_at: "2026-08-05T16:45:00Z",
  },
];

// ── Accounts ──────────────────────────────────────────────────────────────
export const MOCK_ACCOUNTS: MockAccount[] = [
  {
    id: "acc-001",
    email: "alice@demo-org.com",
    name: "Alice Johnson",
    verified: true, enabled: true,
    description: "Workspace administrator",
    avatar_url: "",
    tags: ["admin"],
    created_at: "2026-01-16T10:00:00Z",
    updated_at: "2026-08-01T11:00:00Z",
  },
  {
    id: "acc-002",
    email: "bob@demo-org.com",
    name: "Bob Smith",
    verified: true, enabled: true,
    description: "Engineering lead",
    avatar_url: "",
    tags: ["engineering"],
    created_at: "2026-02-10T09:00:00Z",
    updated_at: "2026-07-20T14:00:00Z",
  },
  {
    id: "acc-003",
    email: "carol@demo-org.com",
    name: "Carol Davis",
    verified: false, enabled: true,
    description: "Pending email verification",
    avatar_url: "",
    tags: ["pending"],
    created_at: "2026-04-05T11:00:00Z",
    updated_at: "2026-04-05T11:00:00Z",
  },
  {
    id: "acc-004",
    email: "dave@demo-org.com",
    name: "Dave Wilson",
    verified: true, enabled: false,
    description: "Account disabled — offboarded",
    avatar_url: "",
    tags: ["disabled"],
    created_at: "2025-11-01T08:00:00Z",
    updated_at: "2026-06-15T10:00:00Z",
  },
  {
    id: "acc-005",
    email: "eve@demo-org.com",
    name: "Eve Martinez",
    verified: true, enabled: true,
    description: "Security auditor",
    avatar_url: "",
    tags: ["security"],
    created_at: "2026-05-12T13:00:00Z",
    updated_at: "2026-08-06T15:00:00Z",
  },
];

// ── Projects ──────────────────────────────────────────────────────────────
export const MOCK_PROJECTS: MockProject[] = [
  {
    id: "proj-001", workspace_id: WORKSPACE_ONE,
    name: "Identity Service", code: "id-svc",
    description: "Core identity management microservice",
    config: {}, tags: ["core"],
    created_at: "2026-02-01T10:00:00Z",
    updated_at: "2026-07-15T12:00:00Z",
  },
  {
    id: "proj-002", workspace_id: WORKSPACE_ONE,
    name: "Auth Gateway", code: "auth-gw",
    description: "OAuth2 / OIDC authentication gateway",
    config: {}, tags: ["auth", "gateway"],
    created_at: "2026-03-10T09:00:00Z",
    updated_at: "2026-08-01T16:00:00Z",
  },
  {
    id: "proj-003", workspace_id: WORKSPACE_TWO,
    name: "Admin Dashboard", code: "admin-dash",
    description: "Internal admin dashboard for IAM",
    config: {}, tags: ["internal", "ui"],
    created_at: "2026-04-01T08:00:00Z",
    updated_at: "2026-08-05T11:00:00Z",
  },
  {
    id: "proj-004", workspace_id: WORKSPACE_TWO,
    name: "Audit Logger", code: "audit-log",
    description: "Centralized audit event logging",
    config: {}, tags: ["security", "audit"],
    created_at: "2026-05-20T14:00:00Z",
    updated_at: "2026-07-30T09:00:00Z",
  },
];

// ── Permissions ───────────────────────────────────────────────────────────
export const MOCK_PERMISSIONS: MockPermission[] = [
  { id: "perm-001", workspace_id: WORKSPACE_ONE, name: "Create Workspace", code: "workspace:create", description: "Ability to create new workspaces", created_at: "2026-01-15T10:00:00Z", updated_at: "2026-01-15T10:00:00Z" },
  { id: "perm-002", workspace_id: WORKSPACE_ONE, name: "Update Workspace", code: "workspace:update", description: "Modify workspace settings", created_at: "2026-01-15T10:00:00Z", updated_at: "2026-01-15T10:00:00Z" },
  { id: "perm-003", workspace_id: WORKSPACE_ONE, name: "Delete Workspace", code: "workspace:delete", description: "Remove a workspace", created_at: "2026-01-15T10:00:00Z", updated_at: "2026-01-15T10:00:00Z" },
  { id: "perm-004", workspace_id: WORKSPACE_ONE, name: "Create Account", code: "account:create", description: "Create user accounts", created_at: "2026-01-16T09:00:00Z", updated_at: "2026-01-16T09:00:00Z" },
  { id: "perm-005", workspace_id: WORKSPACE_ONE, name: "Update Account", code: "account:update", description: "Modify account details", created_at: "2026-01-16T09:00:00Z", updated_at: "2026-01-16T09:00:00Z" },
  { id: "perm-006", workspace_id: WORKSPACE_ONE, name: "Delete Account", code: "account:delete", description: "Remove accounts", created_at: "2026-01-16T09:00:00Z", updated_at: "2026-01-16T09:00:00Z" },
  { id: "perm-007", workspace_id: WORKSPACE_ONE, name: "Manage Roles", code: "role:manage", description: "Create and modify roles", created_at: "2026-01-17T08:00:00Z", updated_at: "2026-01-17T08:00:00Z" },
  { id: "perm-008", workspace_id: WORKSPACE_ONE, name: "Manage Permissions", code: "permission:manage", description: "Create and modify permissions", created_at: "2026-01-17T08:00:00Z", updated_at: "2026-01-17T08:00:00Z" },
];

// ── Roles ─────────────────────────────────────────────────────────────────
export const MOCK_ROLES: MockRole[] = [
  {
    id: "role-001", workspace_id: WORKSPACE_ONE,
    name: "Admin",
    description: "Full administrative access",
    permissions: ["perm-001", "perm-002", "perm-003", "perm-004", "perm-005", "perm-006", "perm-007", "perm-008"],
    created_at: "2026-01-20T10:00:00Z",
    updated_at: "2026-01-20T10:00:00Z",
  },
  {
    id: "role-002", workspace_id: WORKSPACE_ONE,
    name: "Developer",
    description: "Standard developer access",
    permissions: ["perm-004", "perm-005", "perm-007"],
    created_at: "2026-02-01T09:00:00Z",
    updated_at: "2026-02-01T09:00:00Z",
  },
  {
    id: "role-003", workspace_id: WORKSPACE_ONE,
    name: "Viewer",
    description: "Read-only access",
    permissions: [],
    created_at: "2026-03-01T08:00:00Z",
    updated_at: "2026-03-01T08:00:00Z",
  },
  {
    id: "role-004", workspace_id: WORKSPACE_TWO,
    name: "Staging Admin",
    description: "Staging environment administration",
    permissions: ["perm-001", "perm-002"],
    created_at: "2026-03-22T08:00:00Z",
    updated_at: "2026-03-22T08:00:00Z",
  },
];

// ── Memberships ───────────────────────────────────────────────────────────
export const MOCK_MEMBERSHIPS: MockMembership[] = [
  {
    id: "mem-001", workspace_id: WORKSPACE_ONE, account_id: "acc-001",
    scope: "workspace", project_id: null,
    status: "active", roles: ["role-001"],
    created_at: "2026-01-21T10:00:00Z",
    updated_at: "2026-01-21T10:00:00Z",
  },
  {
    id: "mem-002", workspace_id: WORKSPACE_ONE, account_id: "acc-002",
    scope: "workspace", project_id: null,
    status: "active", roles: ["role-002"],
    created_at: "2026-02-11T09:00:00Z",
    updated_at: "2026-02-11T09:00:00Z",
  },
  {
    id: "mem-003", workspace_id: WORKSPACE_ONE, account_id: "acc-003",
    scope: "workspace", project_id: null,
    status: "invited", roles: ["role-003"],
    created_at: "2026-04-06T11:00:00Z",
    updated_at: "2026-04-06T11:00:00Z",
  },
  {
    id: "mem-004", workspace_id: WORKSPACE_ONE, account_id: "acc-004",
    scope: "project", project_id: "proj-001",
    status: "suspended", roles: ["role-002"],
    created_at: "2025-11-02T08:00:00Z",
    updated_at: "2026-06-15T10:00:00Z",
  },
  {
    id: "mem-005", workspace_id: WORKSPACE_TWO, account_id: "acc-005",
    scope: "workspace", project_id: null,
    status: "active", roles: ["role-004"],
    created_at: "2026-06-01T12:00:00Z",
    updated_at: "2026-08-05T16:45:00Z",
  },
];

// ── Credentials ───────────────────────────────────────────────────────────
export const MOCK_CREDENTIALS: MockCredential[] = [
  {
    id: "cred-001", workspace_id: WORKSPACE_ONE, account_id: "acc-001",
    kind: "password", provider: "local",
    status: "active", email: "alice@demo-org.com",
    last_used_at: "2026-08-06T18:00:00Z",
    created_at: "2026-01-16T10:00:00Z",
    updated_at: "2026-01-16T10:00:00Z",
  },
  {
    id: "cred-002", workspace_id: WORKSPACE_ONE, account_id: "acc-002",
    kind: "oauth", provider: "google",
    status: "active", email: "bob@demo-org.com",
    last_used_at: "2026-08-07T09:00:00Z",
    created_at: "2026-02-10T09:00:00Z",
    updated_at: "2026-02-10T09:00:00Z",
  },
  {
    id: "cred-003", workspace_id: WORKSPACE_ONE, account_id: "acc-005",
    kind: "api_key", provider: "oxideauth",
    status: "active", email: "eve@demo-org.com",
    last_used_at: "2026-08-07T14:00:00Z",
    created_at: "2026-06-15T12:00:00Z",
    updated_at: "2026-06-15T12:00:00Z",
  },
  {
    id: "cred-004", workspace_id: WORKSPACE_ONE, account_id: "acc-004",
    kind: "password", provider: "local",
    status: "revoked", email: "dave@demo-org.com",
    last_used_at: "2026-04-01T08:00:00Z",
    created_at: "2025-11-01T08:00:00Z",
    updated_at: "2026-06-15T10:00:00Z",
  },
];

/**
 * Filter mock data by workspace_id. Returns all records if no workspace
 * is specified (for resources that are global or when workspaceId is null).
 */
export function filterByWorkspace<T extends { workspace_id: string }>(
  items: T[],
  workspaceId?: string | null,
): T[] {
  if (!workspaceId) return items;
  return items.filter((item) => item.workspace_id === workspaceId);
}
