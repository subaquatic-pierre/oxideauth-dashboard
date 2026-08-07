"use client"
import { createContext, useContext, useMemo } from "react"
import { useAuth } from "@/hooks/use-auth"
import useSWR from "swr"
import { PermissionService } from "@/services/permission.service"

interface PermissionContextValue {
  permissions: string[]
  isLoading: boolean
}

const PermissionContext = createContext<PermissionContextValue>({
  permissions: [],
  isLoading: true,
})

export function PermissionProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth()
  const workspaceId =
    typeof window !== "undefined"
      ? localStorage.getItem("active_workspace_id")
      : null

  const { data, isLoading } = useSWR(
    isAuthenticated && workspaceId ? ["permissions", "me", workspaceId] : null,
    async () => {
      // Fetch the user's permissions via membership/role resolution.
      // Placeholder: the API does not yet support user-level permission
      // resolution, so we return an empty set here. Swap this for the real
      // resolution endpoint once available.
      const svc = new PermissionService()
      await svc.list(workspaceId!, { limit: 1 })
      return []
    },
  )

  const permissions: string[] = useMemo(() => {
    // Placeholder: return a wildcard permission set for development so the
    // dashboard remains fully usable until the API exposes per-user
    // permission resolution.
    void data
    return ["*"]
  }, [data])

  return (
    <PermissionContext.Provider value={{ permissions, isLoading }}>
      {children}
    </PermissionContext.Provider>
  )
}

export function usePermissions() {
  return useContext(PermissionContext)
}
