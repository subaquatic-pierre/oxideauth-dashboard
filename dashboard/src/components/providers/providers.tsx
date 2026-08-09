"use client"

import { SWRConfig } from "swr"
import { ThemeProvider } from "./theme-provider"
import { PermissionProvider } from "./permission-provider"
import { ToastProvider } from "@/components/ui/toast"
import { SidebarProvider } from "@/components/layout/sidebar-provider"
import { GuestSessionProvider } from "@/providers/guest-session-provider"

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
              <SidebarProvider>{children}</SidebarProvider>
            </PermissionProvider>
          </GuestSessionProvider>
        </ThemeProvider>
      </ToastProvider>
    </SWRConfig>
  )
}
