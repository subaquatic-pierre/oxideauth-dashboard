/**
 * Lightweight helper that wraps a payload in the OxideAuth API response
 * envelope `{ success: true, status: 200, data }`.
 *
 * Used by services in guest mode to return mock data that matches the
 * real API response shape, keeping hooks and SWR consumers unchanged.
 */

export interface ApiEnvelope<T> {
  success: true;
  status: 200;
  data: T;
}

/** Wrap data in a successful API response envelope. */
export function mockOk<T>(data: T): ApiEnvelope<T> {
  return { success: true, status: 200, data };
}
