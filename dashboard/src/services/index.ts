export { BaseService } from "./base"
export { AuthService } from "./auth.service"
export { WorkspaceService } from "./workspace.service"
export { AccountService } from "./account.service"
export { ProjectService } from "./project.service"
export { RoleService } from "./role.service"
export { PermissionService } from "./permission.service"
export { CredentialService } from "./credential.service"
export { TokenService } from "./token.service"
export { MembershipService } from "./membership.service"

// Singleton instances
import { AuthService } from "./auth.service"
import { WorkspaceService } from "./workspace.service"
import { AccountService } from "./account.service"
import { ProjectService } from "./project.service"
import { RoleService } from "./role.service"
import { PermissionService } from "./permission.service"
import { CredentialService } from "./credential.service"
import { TokenService } from "./token.service"
import { MembershipService } from "./membership.service"

export const authService = new AuthService()
export const workspaceService = new WorkspaceService()
export const accountService = new AccountService()
export const projectService = new ProjectService()
export const roleService = new RoleService()
export const permissionService = new PermissionService()
export const credentialService = new CredentialService()
export const tokenService = new TokenService()
export const membershipsService = new MembershipService()
