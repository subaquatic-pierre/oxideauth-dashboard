export const ACTIVE_WORKSPACE_KEY = "active_workspace_id"

/**
 * Resolve the active workspace id from localStorage. The header workspace
 * selector persists the current tenant under "active_workspace_id";
 * workspace-scoped services and hooks use this value as the tenant context
 * for every request.
 */
export function getActiveWorkspaceId(): string {
  if (typeof window === "undefined") return ""
  return localStorage.getItem(ACTIVE_WORKSPACE_KEY) ?? ""
}
