"use client"

import { useEffect } from "react"
import { SWRConfig, useSWRConfig } from "swr"
import { ThemeProvider } from "./theme-provider"
import { PermissionProvider } from "./permission-provider"
import { ToastProvider } from "@/components/ui/toast"
import { SidebarProvider } from "@/components/layout/sidebar-provider"
import { GuestSessionProvider } from "@/providers/guest-session-provider"

/**
 * Listens for workspace-switch events and invalidates the entire SWR cache
 * so all active resource hooks re-fetch with the new workspace context.
 * Must be rendered inside <SWRConfig> to access mutate().
 */
function WorkspaceChangeListener() {
  const { mutate } = useSWRConfig()

  useEffect(() => {
    function handleWorkspaceChange() {
      // Invalidate workspace-scoped SWR cache keys so all resource hooks
      // re-fetch for the new workspace. Exclude non-workspace-scoped keys
      // (auth, workspace list) to avoid re-fetch loops.
      mutate(
        (key) => {
          if (!Array.isArray(key) || key.length === 0) return false
          const prefix = key[0]
          // Never invalidate auth state or the workspace list itself
          if (prefix === "auth" || prefix === "auth-login" || prefix === "auth-register") return false
          if (prefix === "workspaces") return false
          return true
        },
        undefined,
        { revalidate: true },
      )
    }

    window.addEventListener("oxideauth:workspace-change", handleWorkspaceChange)
    return () => {
      window.removeEventListener("oxideauth:workspace-change", handleWorkspaceChange)
    }
  }, [mutate])

  return null
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig
      value={{
        shouldRetryOnError: false,
        keepPreviousData: true,
        revalidateOnFocus: false,
      }}
    >
      <ToastProvider>
        <ThemeProvider>
          <GuestSessionProvider>
            <PermissionProvider>
              <SidebarProvider>
                <WorkspaceChangeListener />
                {children}
              </SidebarProvider>
            </PermissionProvider>
          </GuestSessionProvider>
        </ThemeProvider>
      </ToastProvider>
    </SWRConfig>
  )
}
