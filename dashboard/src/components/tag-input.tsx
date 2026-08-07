"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { XIcon } from "lucide-react"

interface TagInputProps {
  value: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
  disabled?: boolean
}

/**
 * Comma / Enter-separated tag input. Renders existing tags as removable
 * pills alongside a free-text input.
 */
export function TagInput({
  value,
  onChange,
  placeholder,
  disabled,
}: TagInputProps) {
  const [draft, setDraft] = useState("")

  function addTag() {
    const tag = draft.trim()
    if (!tag) return
    if (!value.includes(tag)) onChange([...value, tag])
    setDraft("")
  }

  return (
    <div className="space-y-2">
      <Input
        value={draft}
        placeholder={placeholder ?? "Add a tag and press Enter"}
        disabled={disabled}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault()
            addTag()
          }
        }}
        onBlur={addTag}
      />
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {value.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs font-medium"
            >
              {tag}
              <button
                type="button"
                onClick={() => onChange(value.filter((t) => t !== tag))}
                aria-label={`Remove ${tag}`}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                <XIcon className="size-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
