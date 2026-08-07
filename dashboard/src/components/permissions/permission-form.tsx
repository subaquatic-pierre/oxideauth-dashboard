"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2Icon } from "lucide-react"
import type { PermissionFormData } from "@/types/permission"

interface PermissionFormProps {
  initialData?: PermissionFormData
  isSubmitting?: boolean
  submitLabel?: string
  onSubmit: (data: PermissionFormData) => Promise<void>
}

export function PermissionForm({
  initialData,
  isSubmitting = false,
  submitLabel = "Create permission",
  onSubmit,
}: PermissionFormProps) {
  const [name, setName] = useState(initialData?.name ?? "")
  const [code, setCode] = useState(initialData?.code ?? "")
  const [description, setDescription] = useState(initialData?.description ?? "")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await onSubmit({
      name,
      code,
      description: description.trim() ? description : undefined,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="permission-name">Name</Label>
        <Input
          id="permission-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Create project"
          required
          autoFocus
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="permission-code">Code</Label>
        <Input
          id="permission-code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="e.g. project:create"
          required
          className="font-mono"
        />
        <p className="text-xs text-muted-foreground">
          A unique, machine-readable identifier for this permission.
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="permission-description">Description</Label>
        <Textarea
          id="permission-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional description of what this permission allows."
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2Icon className="animate-spin" />}
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  )
}
