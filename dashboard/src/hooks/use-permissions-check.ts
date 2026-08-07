"use client"
import { usePermissions } from "@/components/providers/permission-provider"
import { can } from "@/lib/permissions"
import type { PermissionVerb } from "@/lib/permissions"

/** Whether the current user holds `{entity}:{verb}`. */
export function useCan(entity: string, verb: PermissionVerb): boolean {
  const { permissions } = usePermissions()
  return can(entity, verb, permissions)
}

/** Whether the current user holds any of the requested permission checks. */
export function useCanAny(
  checks: Array<{ entity: string; verb: PermissionVerb }>,
): boolean {
  const { permissions } = usePermissions()
  return checks.some(({ entity, verb }) => can(entity, verb, permissions))
}
