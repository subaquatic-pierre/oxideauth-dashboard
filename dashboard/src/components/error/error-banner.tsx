"use client"

import { XIcon } from "lucide-react"
import { Alert } from "@/components/ui/alert"

interface ErrorBannerProps {
  message: string
  onDismiss?: () => void
}

export function ErrorBanner({ message, onDismiss }: ErrorBannerProps) {
  if (!message) return null

  return (
    <Alert variant="error" className="flex items-center justify-between">
      <span>{message}</span>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="ml-3 shrink-0 rounded-md p-1 opacity-70 transition-opacity hover:opacity-100"
        >
          <XIcon className="size-4" />
          <span className="sr-only">Dismiss</span>
        </button>
      )}
    </Alert>
  )
}
