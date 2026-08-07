export type PermissionVerb = "create" | "read" | "update" | "delete" | "*"

/**
 * Check whether a user permission set grants `{entity}:{verb}`.
 *
 * Wildcards are honored at any level:
 * - `"*"` grants everything
 * - `"{entity}:*"` grants every verb on the entity
 * - `"*:{verb}"` grants the verb on every entity
 */
export function can(
  entity: string,
  verb: PermissionVerb,
  userPermissions: string[],
): boolean {
  const required = `${entity}:${verb}`
  return userPermissions.some(
    (p) =>
      p === "*" ||
      p === `${entity}:*` ||
      p === `*:${verb}` ||
      p === required,
  )
}

/** True when the user holds at least one of the requested checks. */
export function canAny(
  permissions: Array<{ entity: string; verb: PermissionVerb }>,
  userPermissions: string[],
): boolean {
  return permissions.some(({ entity, verb }) => can(entity, verb, userPermissions))
}
