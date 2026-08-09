"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface ErrorToastProps {
  message: string
  type?: "error" | "warning"
  onClose?: () => void
}

export function ErrorToast({ message, type = "error", onClose }: ErrorToastProps) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setVisible(false)
      onClose?.()
    }, 5000)
    return () => window.clearTimeout(timer)
  }, [onClose])

  if (!visible || !message) return null

  return (
    <div
      role="status"
      className={cn(
        "fixed bottom-4 right-4 z-[100] max-w-sm rounded-lg border px-4 py-3 text-sm shadow-lg",
        type === "warning"
          ? "border-yellow-200 bg-yellow-50 text-yellow-800 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-300"
          : "border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-300",
      )}
    >
      {message}
    </div>
  )
}
