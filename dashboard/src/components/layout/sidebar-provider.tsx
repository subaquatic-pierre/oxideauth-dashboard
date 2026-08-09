"use client"

import { createContext, useContext, useState, useCallback } from "react"

interface SidebarContextType {
  collapsed: boolean
  setCollapsed: (v: boolean) => void
  toggle: () => void
  mobileOpen: boolean
  setMobileOpen: (v: boolean) => void
}

const SidebarContext = createContext<SidebarContextType>({
  collapsed: false,
  setCollapsed: () => {},
  toggle: () => {},
  mobileOpen: false,
  setMobileOpen: () => {},
})

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const toggle = useCallback(() => setCollapsed((prev) => !prev), [])

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed, toggle, mobileOpen, setMobileOpen }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  return useContext(SidebarContext)
}
