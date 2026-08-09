/**
 * Generic lazy-singleton helper with HMR safety via globalThis backing store.
 *
 * ES modules are singletons by default (same resolved module → same bindings),
 * so a module-scoped `let` gives the singleton guarantee. However, Next.js dev
 * HMR re-evaluates modules and clears module-scoped bindings. To survive HMR,
 * we also store the instance on `globalThis` under a stable Symbol.for key,
 * recovering it on first access after a hot reload.
 *
 * Usage:
 * ```ts
 * import { getSingleton } from "@/lib/get-singleton";
 * import { WorkspaceService } from "@/services";
 *
 * export const workspaceService = getSingleton(
 *   () => new WorkspaceService(),
 *   Symbol.for("oxideauth.workspaceService"),
 * );
 * ```
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GlobalStore = Record<symbol, unknown>;

function getGlobalStore(): GlobalStore {
  const key = Symbol.for("oxideauth.__singleton_store__");
  const g = globalThis as Record<symbol, GlobalStore>;
  if (!g[key]) {
    g[key] = {};
  }
  return g[key];
}

/**
 * Returns the singleton instance for the given factory, creating it lazily on
 * first access. Survives Next.js HMR cycles by falling back to a globalThis
 * store keyed by the provided symbol.
 */
export function getSingleton<T>(
  factory: () => T,
  key: symbol,
): T {
  const store = getGlobalStore();
  if (!store[key]) {
    store[key] = factory();
  }
  return store[key] as T;
}
