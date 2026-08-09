import type { useSWRConfig } from "swr";
import { getActiveWorkspaceId } from "@/lib/workspace";

/**
 * SWR cache invalidation helpers for revalidating resource lists after
 * create/update/delete mutations.
 */

// Moved from hooks/use-permissions.ts
export function revalidatePermissions(
  mutate: ReturnType<typeof useSWRConfig>["mutate"]
) {
  mutate((key) => Array.isArray(key) && key[0] === "permissions");
}

// Moved from hooks/use-roles.ts
export function revalidateRoles(
  mutate: ReturnType<typeof useSWRConfig>["mutate"]
) {
  mutate((key) => Array.isArray(key) && key[0] === "roles");
}

// Moved from hooks/use-memberships.ts
export function isMembershipsListKey(key: unknown): boolean {
  return (
    Array.isArray(key) &&
    key[0] === "memberships" &&
    key[1] === getActiveWorkspaceId()
  );
}
