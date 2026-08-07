"use client"

import { cn } from "@/lib/utils"

interface DetailRowProps {
  label: string
  value?: React.ReactNode
  mono?: boolean
}

/** Label/value row used on resource detail pages. */
export function DetailRow({ label, value, mono }: DetailRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg bg-muted/50 px-4 py-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span
        className={cn(
          "text-right text-sm font-medium",
          mono && "font-mono text-xs",
        )}
      >
        {value ?? "—"}
      </span>
    </div>
  )
}
