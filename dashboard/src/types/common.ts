// Standard API response envelope
export interface ApiResponse<T> {
  success: boolean
  status: number
  data: T
}

// Pagination metadata
export interface PaginationMetadata {
  total: number
  count: number
  offset: number
  limit: number
  order_bys: string[]
}

// Paginated response (keyed by resource plural name). The mapped key gives
// the resource array exact typing (e.g. `data.accounts` is `Account[]`).
export type PaginatedResponse<T, K extends string = string> = {
  [key in K]: T[]
} & {
  metadata: PaginationMetadata
}

// List query filters
export interface ListFilters {
  tags?: string[]
  fields?: Record<string, unknown>
  limit?: number
  offset?: number
  order_bys?: string[]
}

// Date range
export interface DateRange {
  from?: Date
  to?: Date
}
