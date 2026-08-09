/**
 * Service Registry — single entry point for all domain services.
 *
 * Every service is exported as a **lazily-instantiated singleton** via
 * `getSingleton`, guaranteeing exactly one instance per application lifecycle
 * (FR-001–FR-004). The `globalThis`-backed store survives Next.js HMR cycles
 * so hot reloads never create duplicate instances.
 *
 * Import usage:
 * ```ts
 * import { workspaceService, authService } from "@/services";
 * ```
 *
 * Class exports are kept for type references and DI/construction needs.
 * Type re-exports ensure consumers can import both instance and types
 * from the single barrel path.
 */

import { getSingleton } from "@/lib/get-singleton";

// ── Class re-exports (for type usage) ────────────────────────────────────
export { BaseService } from "./base";
export { AuthService } from "./auth.service";
export { WorkspaceService } from "./workspace.service";
export { AccountService } from "./account.service";
export { ProjectService } from "./project.service";
export { RoleService } from "./role.service";
export { PermissionService } from "./permission.service";
export { CredentialService } from "./credential.service";
export { MembershipService } from "./membership.service";

// ── Type re-exports (so consumers don't import from individual files) ─────
export type { AccountListQuery, AccountListResponse } from "./account.service";

// ── Import constructors for lazy instantiation ────────────────────────────
import { AuthService } from "./auth.service";
import { WorkspaceService } from "./workspace.service";
import { AccountService } from "./account.service";
import { ProjectService } from "./project.service";
import { RoleService } from "./role.service";
import { PermissionService } from "./permission.service";
import { CredentialService } from "./credential.service";
import { MembershipService } from "./membership.service";

// ── Lazy singleton instances ─────────────────────────────────────────────
export const authService = getSingleton(
  () => new AuthService(),
  Symbol.for("oxideauth.authService"),
);

export const workspaceService = getSingleton(
  () => new WorkspaceService(),
  Symbol.for("oxideauth.workspaceService"),
);

export const accountService = getSingleton(
  () => new AccountService(),
  Symbol.for("oxideauth.accountService"),
);

export const projectService = getSingleton(
  () => new ProjectService(),
  Symbol.for("oxideauth.projectService"),
);

export const roleService = getSingleton(
  () => new RoleService(),
  Symbol.for("oxideauth.roleService"),
);

export const permissionService = getSingleton(
  () => new PermissionService(),
  Symbol.for("oxideauth.permissionService"),
);

export const credentialService = getSingleton(
  () => new CredentialService(),
  Symbol.for("oxideauth.credentialService"),
);

export const membershipsService = getSingleton(
  () => new MembershipService(),
  Symbol.for("oxideauth.membershipsService"),
);
