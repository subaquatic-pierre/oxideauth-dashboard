/**
 * Module-level guest-mode flag for the OxideAuth dashboard.
 *
 * Services import `isGuestMode()` to decide whether to return mock data or call
 * the real API. The flag is set by `GuestSessionProvider` (React Context) which
 * syncs its state here so services remain React-free per constitution Principle 1.
 *
 * The flag is backed by `globalThis` under a stable `Symbol.for` key so it
 * survives Next.js HMR cycles — a hot reload during a guest session won't
 * silently revert the app to authenticated mode.
 */

const GUEST_MODE_KEY = Symbol.for("oxideauth.guestMode");

function getStore(): { value: boolean } {
  const g = globalThis as Record<symbol, { value: boolean }>;
  if (!g[GUEST_MODE_KEY]) {
    g[GUEST_MODE_KEY] = { value: false };
  }
  return g[GUEST_MODE_KEY];
}

/** Returns `true` when the current session is in guest/demo mode. */
export function isGuestMode(): boolean {
  return getStore().value;
}

/** Set the guest mode flag. Called by GuestSessionProvider on enter/exit. */
export function setGuestMode(enabled: boolean): void {
  getStore().value = enabled;
}
