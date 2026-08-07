import { format, formatDistanceToNow } from "date-fns"

export function formatDate(date: string | Date, pattern?: string): string {
  return format(new Date(date), pattern || "MMM d, yyyy")
}

export function formatDateTime(date: string | Date): string {
  return format(new Date(date), "MMM d, yyyy HH:mm")
}

export function formatRelative(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

export function formatNumber(n: number): string {
  return n.toLocaleString()
}

export function shortId(id?: string, length = 8): string {
  if (!id) return "-"
  return id.length > length ? `${id.slice(0, length)}…` : id
}
