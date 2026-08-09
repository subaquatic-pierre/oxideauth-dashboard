export interface ListResponseMeta {
  total: number
  count: number
  offset: number | null
  limit: number
  order_bys: string[] | null
}

export interface RequestListOptions {
  limit?: number
  offset?: number
  order_bys?: string
}

export interface RequestFilterParams<F = Record<string, unknown>> {
  tags?: string[]
  fields?: F
}

export type PaginatedResponse<T, K extends string> = {
  [key in K]: T[]
} & {
  metadata: ListResponseMeta
}
