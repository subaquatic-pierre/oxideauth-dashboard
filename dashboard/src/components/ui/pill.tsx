"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const pillVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
  {
    variants: {
      variant: {
        default: "bg-primary/10 text-primary",
        success: "bg-green-500/10 text-green-600 dark:text-green-400",
        warning: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
        danger: "bg-red-500/10 text-red-600 dark:text-red-400",
        info: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
      },
    },
    defaultVariants: { variant: "default" },
  }
)

function Pill({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof pillVariants>) {
  return (
    <span
      data-slot="pill"
      className={cn(pillVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Pill, pillVariants }
