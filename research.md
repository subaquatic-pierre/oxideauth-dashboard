# Research: X-Workspace-Id Header Priority Chain

## 1. Changes to `api.ts` — Priority Chain

### Decision

Modify `api.ts` to resolve the `X-Workspace-Id` header value using the following priority:

```
localStorage("active_workspace_id")  →  auth?.claims?.ws  →  absent
```

Concretely, in the `api()` function at `dashboard/src/lib/api.ts:43-47`, replace:

```ts
const workspaceId = auth?.claims?.ws;
if (workspaceId) {
  tokenHeaders["X-Workspace-Id"] = workspaceId;
}
```

with:

```ts
const workspaceId = resolveWorkspaceId(auth?.claims?.ws);
if (workspaceId) {
  tokenHeaders["X-Workspace-Id"] = workspaceId;
}
```

Where `resolveWorkspaceId` (already exported from `@/lib/workspace`) does exactly that: returns the explicit argument if non-empty, otherwise reads from localStorage. This gives us:

1. Always send the header whenever *any* workspace context is available (satisfies FR: "always send")
2. Explicit selector choice from localStorage wins over token claims (satisfies priority req)
3. Token claims serve as fallback when the user hasn't selected a workspace (satisfies fallback req)

Current import at `api.ts:1` will need `resolveWorkspaceId` imported from `@/lib/workspace`.

### Rationale

- `resolveWorkspaceId(id?)` already encapsulates the exact priority logic needed (explicit → localStorage fallback). By passing `auth?.claims?.ws` as the explicit argument, the chain becomes: localStorage → token claims.
- One-line change. Zero new abstractions.
- The function is already tested indirectly through all service-layer callers that use it.

### Alternatives Considered

| Alternative | Verdict |
|---|---|
| Inline the two-step read in `api.ts` directly | Duplicates logic already in `resolveWorkspaceId`. Worse maintainability. |
| Always override token claims with localStorage (ignore claims entirely) | Violates the fallback requirement on fresh login when no workspace is yet selected. |
| Only send header when explicit selection exists | Violates "always send" requirement and breaks endpoints that rely on the header for tenant isolation. |

---

## 2. Syncing Strategy — localStorage Read vs. Module-Level Variable

### Decision

**Read localStorage synchronously on every `api()` call** via the existing `resolveWorkspaceId()` / `getActiveWorkspaceId()` functions. No module-level cache variable, no event listeners in `api.ts`.

### Rationale

1. **Performance is a non-issue.** `localStorage.getItem()` is a synchronous, in-memory map lookup in browsers. It completes in microseconds. The dominant latency in `api()` is the network fetch (milliseconds to seconds). The localStorage read adds zero measurable overhead.

2. **Simplicity.** A module-level variable would require:
   - Initialization on load (reading localStorage once)
   - A listener for `"storage"` events (cross-tab sync)
   - A listener for `"oxideauth:workspace-change"`(same-tab sync)
   - All of this in a non-React, non-component module (`api.ts` is a plain function), meaning lifecycle management (add/remove listeners) gets awkward without a framework.
   - Risk of listener leaks or stale state if the module is reloaded (HMR in dev).

3. **Always-fresh guarantee.** Reading localStorage on every call guarantees the header always reflects the very latest selector value, even if the `oxideauth:workspace-change` event hasn't been dispatched yet, or if something writes to localStorage directly.

4. **Existing pattern.** The `getActiveWorkspaceId()` and `resolveWorkspaceId()` functions already do synchronous localStorage reads. Services already call them on every method invocation. This just moves that same pattern into the header injection layer.

### Alternatives Considered

| Alternative | Pros | Cons |
|---|---|---|
| **(a) Module-level variable + listeners** | Single localStorage read at startup. | Requires setting up `storage` and custom event listeners in a non-React module. Risk of listener leaks on HMR. Risk of stale state if listener fails to fire. The `oxideauth:workspace-change` event is a plain `Event` (no `detail`), so the listener would still need to read localStorage anyway. Two sources of truth (variable + localStorage) that can drift. |
| **(b) Event system / pub-sub** | Decoupled. | Over-engineered. `api.ts` doesn't need to *react* to changes in a time-sensitive way; it just needs the *current* value at call time. Adds dependency. |
| **(c) Make api() accept workspaceId as a parameter** | Explicit data flow. | Requires every caller (100+ service method calls) to pass the workspace ID. Massive refactor. Service methods already embed `workspace_id` in the request *body*; adding it as a *header* param to every call is redundant. |

---

## 3. WorkspaceSelector Initialization — Token Claims Fallback

### Decision

Update `WorkspaceSelector` at `dashboard/src/components/layout/workspace-selector.tsx:35-51` to include token claims as a fallback *before* the first-workspace default. The initialization order becomes:

```
localStorage → token claims (auth.claims.ws) → first workspace in list
```

Concrete changes:

1. **Import `getStoredAuth`** from `@/utils/auth`.
2. **Read `auth?.claims?.ws`** at component mount time to seed `activeId` state (or in the `useMemo` resolution).
3. **In the `useMemo` active workspace resolution** (line 43-51): after checking `localStorage`, check `auth?.claims?.ws` against the workspace list, then fall back to `workspaces[0]`.

### Rationale

On fresh login (no prior localStorage state), the user should see their token-claims workspace pre-selected in the dropdown. Currently it falls directly to `workspaces[0]`, which may be a different workspace.

The token claims workspace ID is available synchronously via `getStoredAuth()` at render time (it reads from localStorage where the auth token is stored). No async fetching needed.

### Pseudocode for the updated resolution

```ts
const auth = getStoredAuth();
const claimsWs = auth?.claims?.ws;

const stored = activeId
  ?? (typeof window !== "undefined" ? localStorage.getItem(ACTIVE_WORKSPACE_KEY) : null);

// Prefer stored → claims → first
let resolved = workspaces.find((w) => w.id === stored);
if (!resolved && claimsWs) {
  resolved = workspaces.find((w) => w.id === claimsWs);
}
return resolved ?? workspaces[0];
```

### Post-resolution sync

After the active workspace is resolved (including the claims fallback), the existing `useEffect` (line 54-60) already persists it to localStorage and dispatches the `oxideauth:workspace-change` event. This means:

- The initial claims-based selection gets persisted to localStorage after the first render.
- Subsequent page loads will find it in localStorage (first priority).
- The `api.ts` change picks it up immediately for all API calls.

### Alternatives Considered

| Alternative | Verdict |
|---|---|
| Use only `workspaces[0]` as fallback (current behavior) | Violates spec: "On login: use token claims workspace as initial value" |
| Skip token claims, let api.ts handle it | Header would be correct, but the dropdown would show the wrong workspace visually — a confusing UX. |
| Use server-side cookie or SSR to seed the initial value | Unnecessary complexity. The token claims are available client-side. |

---

## 4. In-Flight Request Discarding on Workspace Change (FR-008)

### Decision

**Implement AbortController-based request discarding.** When the workspace changes, abort all in-flight API requests that were sent with the previous workspace ID. New requests from React re-renders (triggered by the workspace change) will pick up the new `X-Workspace-Id` header value.

Concrete design:

```
dependencies: api.ts ← new AbortController
                       ↑
              workspace-selector.tsx → abort old controller on change
                       ↓
              useActiveWorkspaceId() hook → triggers component re-renders
```

**In `api.ts`:**
- A module-level `AbortController` instance (created fresh, replaced on abort)
- The `api()` function attaches `signal: controller.signal` to every `fetch()` call
- A new **abort-and-reset** function that aborts the current controller and creates a new one
- When `fetch` is aborted, `api()` throws a distinguishable `AbortError` (so callers can suppress it if needed, or let it propagate)

**In `workspace-selector.tsx`:**
- In the `handleChange` callback (line 62-65): call the `api.ts` abort function before or after updating the workspace ID.
  - **Before** updating: aborts current requests, then new workspace ID is set, then `useEffect` persists it, then re-renders issue *new* requests with the *new* header.
  - **After** updating: the header is already changed, but old requests are still in flight — they'd be aborted a moment later.

  Recommended: **abort before** updating. This guarantees no window where old workspace requests complete after the selection changed.

**Key edge cases:**
- The abort should be a **fire-and-forget** operation — no need to await the abort or track completion.
- React components using SWR or `useEffect` fetches will see the abort as a failed request. They should handle `AbortError` gracefully (e.g., SWR already ignores aborted requests by default).
- Multiple rapid workspace switches should be handled correctly: each switch creates a new `AbortController` and aborts the previous one. Only requests from the *last* selection survive.

### Rationale

- **Data integrity.** Without discarding, a response for workspace-A could arrive *after* the user switches to workspace-B and be rendered in workspace-B's context. This is a data leak / confusion bug.
- **AbortController is the platform standard** for cancelling fetch requests. No library needed.
- **Minimal api.ts API surface change.** Add one import, one signal attachment, and export one abort function.

### Implementation Sketch

```ts
// api.ts (additions)

let currentController = new AbortController();

export function abortInFlightRequests(): void {
  currentController.abort();
  currentController = new AbortController();
}

// Inside api():
const res = await fetch(url, {
  method: "POST",
  headers: { ... },
  signal: currentController.signal,   // ← added
  ...options,
});
```

```tsx
// workspace-selector.tsx handleChange
function handleChange(value: string | null) {
  if (!value) return;
  abortInFlightRequests();  // ← discard stale requests
  setActiveId(value);
}
```

### Alternatives Considered

| Alternative | Pros | Cons |
|---|---|---|
| **Do nothing (let old requests complete)** | Zero implementation. | Responses from old workspace arrive in new workspace context → wrong data rendered, potential data leak. |
| **Request tagging + response discard** (tag each request with workspace ID, ignore response if ID mismatched) | Doesn't cancel network I/O (saves bandwidth?). | Pointless complexity. The response is already downloaded by the time you can check the tag. AbortController prevents the download in the first place. Also requires passing tags through every caller. |
| **Route-level abort (in each page component)** | Each page manages its own request lifecycle. | Every consumer page must implement the same pattern. Duplicated logic, easy to miss, inconsistent behavior. Centralizing in `api.ts` ensures *all* requests are covered. |

---

## Summary of Required Changes

| File | Change |
|---|---|
| `dashboard/src/lib/api.ts` | (1) Import `resolveWorkspaceId`. (2) Replace `auth?.claims?.ws` with `resolveWorkspaceId(auth?.claims?.ws)`. (3) Add module-level `AbortController`, export `abortInFlightRequests()`, attach `signal` to `fetch`. |
| `dashboard/src/components/layout/workspace-selector.tsx` | (1) Import `getStoredAuth`. (2) Add `auth?.claims?.ws` as middle fallback in active workspace resolution. (3) Call `abortInFlightRequests()` in `handleChange`. |
| `dashboard/src/lib/workspace.ts` | No changes needed. `resolveWorkspaceId` already implements the priority chain. |
| `dashboard/src/hooks/use-active-workspace.ts` | No changes needed. Already syncs with localStorage and the custom event. |

No other files require changes. Services already pass `workspaceId` via `resolveWorkspaceId` in their request *bodies*; the header change is entirely contained in `api.ts`.
