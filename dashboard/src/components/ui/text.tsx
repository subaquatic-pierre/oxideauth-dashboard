"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { forwardRef } from "react"

const textVariants = cva("", {
  variants: {
    variant: {
      h1: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
      h2: "scroll-m-20 text-3xl font-semibold tracking-tight",
      h3: "scroll-m-20 text-2xl font-semibold tracking-tight",
      h4: "scroll-m-20 text-xl font-medium tracking-tight",
      p: "leading-7",
      muted: "text-sm text-muted-foreground",
      small: "text-xs leading-5",
    },
  },
  defaultVariants: { variant: "p" },
})

export interface TextProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof textVariants> {
  as?: React.ElementType
}

const Text = forwardRef<HTMLElement, TextProps>(
  ({ className, variant, as, ...props }, ref) => {
    const Comp: React.ElementType =
      as ||
      (variant === "h1" ||
      variant === "h2" ||
      variant === "h3" ||
      variant === "h4"
        ? variant
        : "p")
    return (
      <Comp
        className={cn(textVariants({ variant, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Text.displayName = "Text"
export { Text, textVariants }
