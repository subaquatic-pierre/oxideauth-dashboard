"use client"

import { useEffect, useState } from "react"
import { ACTIVE_WORKSPACE_KEY, getActiveWorkspaceId } from "@/lib/workspace"

// Dispatched by the header workspace selector when the active workspace changes.
const WORKSPACE_CHANGE_EVENT = "oxideauth:workspace-change"

/**
 * Returns the currently active workspace id from localStorage, keeping in
 * sync with changes made in other tabs (storage event), when the window
 * regains focus (e.g. after changing the workspace in the header selector),
 * and when the header selector dispatches a same-tab change event.
 */
export function useActiveWorkspaceId(): string | null {
  const [workspaceId, setWorkspaceId] = useState<string | null>(() =>
    getActiveWorkspaceId() || null,
  )

  useEffect(() => {
    function sync() {
      setWorkspaceId(getActiveWorkspaceId() || null)
    }

    function handleStorage(e: StorageEvent) {
      if (e.key === ACTIVE_WORKSPACE_KEY) {
        setWorkspaceId(e.newValue)
      }
    }

    window.addEventListener("storage", handleStorage)
    window.addEventListener("focus", sync)
    window.addEventListener(WORKSPACE_CHANGE_EVENT, sync)
    return () => {
      window.removeEventListener("storage", handleStorage)
      window.removeEventListener("focus", sync)
      window.removeEventListener(WORKSPACE_CHANGE_EVENT, sync)
    }
  }, [])

  return workspaceId
}
