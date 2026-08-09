import type { ListFilters } from "@/types/common";

/**
 * Serialize ListFilters into the API's ListQuery body shape:
 * `{ filter: { tags, fields }, options: { limit, offset, order_bys } }`.
 *
 * `order_bys` is an array here (e.g. `["!created_at"]`) and is joined into
 * the API's single-string `options.order_bys` field.
 */
export function buildListQuery(filters?: ListFilters) {
  return {
    filter: {
      // tags: filters?.tags ?? [],
      // fields: filters?.fields ?? {},
    },
    options: {
      limit: filters?.limit,
      offset: filters?.offset,
      order_bys: filters?.order_bys?.join(","),
    },
  };
}
