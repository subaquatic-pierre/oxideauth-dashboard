import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/**
 * Heuristic used when an endpoint accepts either a UUID `id` or a
 * human-readable key (e.g. project `code`): UUIDs are sent as `id`, anything
 * else is sent under the entity's alternate key field.
 */
export function isUuid(value: string): boolean {
  return UUID_REGEX.test(value)
}
