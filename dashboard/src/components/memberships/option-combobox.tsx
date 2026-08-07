"use client"

import * as React from "react"
import {
  Combobox,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxPopup,
  ComboboxPortal,
  ComboboxPositioner,
} from "@/components/ui/combobox"
import { cn } from "@/lib/utils"

export interface ComboboxOption {
  value: string
  label: string
  hint?: string
}

interface OptionComboboxProps {
  options: ComboboxOption[]
  value: string | string[] | null
  onChange: (value: string | string[] | null) => void
  placeholder?: string
  emptyText?: string
  multiple?: boolean
  disabled?: boolean
  className?: string
}

/**
 * Searchable combobox built on the Base UI primitive. Supports both single
 * selection (returns the selected option's value) and multiple selection
 * (returns an array of selected values).
 *
 * When closed, the input displays the selected option's label; when opened it
 * becomes a search field.
 */
export function OptionCombobox({
  options,
  value,
  onChange,
  placeholder = "Select...",
  emptyText = "No options found",
  multiple = false,
  disabled = false,
  className,
}: OptionComboboxProps) {
  const [query, setQuery] = React.useState("")
  const [open, setOpen] = React.useState(false)

  const selectedLabel = React.useMemo(() => {
    if (multiple || !value || typeof value !== "string") return ""
    return options.find((o) => o.value === value)?.label ?? ""
  }, [options, value, multiple])

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return options
    return options.filter((o) => o.label.toLowerCase().includes(q))
  }, [options, query])

  const inputValue = multiple ? query : open ? query : selectedLabel

  return (
    <Combobox
      multiple={multiple}
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        // Always start with a fresh search whenever the popup opens/closes.
        setQuery("")
      }}
      inputValue={inputValue}
      onInputValueChange={(val) => setQuery(val ?? "")}
      value={
        multiple
          ? Array.isArray(value)
            ? (value as string[])
            : []
          : typeof value === "string"
            ? (value as string)
            : null
      }
      onValueChange={(val) => {
        if (multiple) onChange(Array.isArray(val) ? (val as string[]) : [])
        else onChange(typeof val === "string" ? (val as string) : null)
      }}
    >
      <ComboboxInput
        placeholder={placeholder}
        disabled={disabled}
        className={cn("w-full", className)}
      />
      <ComboboxPortal>
        <ComboboxPositioner
          align="start"
          sideOffset={4}
          className="w-(--anchor-width)"
        >
          <ComboboxPopup>
            <ComboboxList>
              {filtered.map((option) => (
                <ComboboxItem key={option.value} value={option.value}>
                  <span className="font-medium">{option.label}</span>
                  {option.hint ? (
                    <span className="ml-auto text-xs text-muted-foreground">
                      {option.hint}
                    </span>
                  ) : null}
                </ComboboxItem>
              ))}
              {filtered.length === 0 ? (
                <ComboboxEmpty>{emptyText}</ComboboxEmpty>
              ) : null}
            </ComboboxList>
          </ComboboxPopup>
        </ComboboxPositioner>
      </ComboboxPortal>
    </Combobox>
  )
}
