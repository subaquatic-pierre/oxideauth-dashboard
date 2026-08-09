"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Combobox,
  ComboboxChip,
  ComboboxChipRemove,
  ComboboxChips,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxInputGroup,
  ComboboxItem,
  ComboboxList,
  ComboboxPopup,
  ComboboxPortal,
  ComboboxPositioner,
  ComboboxValue,
} from "@/components/ui/combobox"
import { usePermissions } from "@/hooks/use-permissions"
import { Loader2Icon, XIcon } from "lucide-react"
import type { RoleFormData } from "@/types/role"
import type { PermissionDescribeRes } from "@/types/permission"

interface RoleFormProps {
  workspaceId?: string
  initialData?: RoleFormData
  isSubmitting?: boolean
  submitLabel?: string
  onSubmit: (data: RoleFormData) => Promise<void>
}

export function RoleForm({
  workspaceId,
  initialData,
  isSubmitting = false,
  submitLabel = "Create role",
  onSubmit,
}: RoleFormProps) {
  const [name, setName] = useState(initialData?.name ?? "")
  const [description, setDescription] = useState(initialData?.description ?? "")
  const [permissionIds, setPermissionIds] = useState<string[]>(
    initialData?.permission_ids ?? [],
  )
  const { data: permissions, isLoading: permissionsLoading } = usePermissions(
    workspaceId,
  )

  const permissionById = useMemo(() => {
    const map = new Map<string, PermissionDescribeRes>()
    for (const permission of permissions ?? []) {
      map.set(permission.id, permission)
    }
    return map
  }, [permissions])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await onSubmit({
      name,
      description: description.trim() ? description : undefined,
      permission_ids: permissionIds,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="role-name">Name</Label>
        <Input
          id="role-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Project Admin"
          required
          autoFocus
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="role-description">Description</Label>
        <Textarea
          id="role-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional description of this role."
        />
      </div>
      <div className="space-y-2">
        <Label>Permissions</Label>
        {permissionsLoading ? (
          <div className="flex items-center gap-2 rounded-lg border border-input px-2.5 py-2 text-sm text-muted-foreground">
            <Loader2Icon className="size-4 animate-spin" />
            Loading permissions...
          </div>
        ) : (
          <Combobox
            multiple
            items={(permissions ?? []).map((p) => p.id)}
            value={permissionIds}
            onValueChange={(value) => setPermissionIds(value ?? [])}
            itemToStringLabel={(id) => permissionById.get(id)?.name ?? id}
          >
            <ComboboxInputGroup className="flex-wrap gap-1 rounded-lg border border-input bg-transparent px-1.5 py-1 transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50">
              <ComboboxChips>
                <ComboboxValue>
                  {(selected: string[]) => (
                    <>
                      {selected.map((id) => (
                        <ComboboxChip
                          key={id}
                          aria-label={permissionById.get(id)?.name ?? id}
                        >
                          {permissionById.get(id)?.name ?? id}
                          <ComboboxChipRemove
                            aria-label={`Remove ${permissionById.get(id)?.name ?? id}`}
                          >
                            <XIcon className="size-3" />
                          </ComboboxChipRemove>
                        </ComboboxChip>
                      ))}
                      <ComboboxInput
                        placeholder={
                          selected.length > 0 ? "" : "Search permissions..."
                        }
                        className="h-6 min-w-24 flex-1 border-none bg-transparent px-1 text-sm focus-visible:ring-0"
                      />
                    </>
                  )}
                </ComboboxValue>
              </ComboboxChips>
            </ComboboxInputGroup>
            <ComboboxPortal>
              <ComboboxPositioner sideOffset={4} align="start">
                <ComboboxPopup className="w-80">
                  <ComboboxEmpty>No permissions found.</ComboboxEmpty>
                  <ComboboxList>
                    {(permissions ?? []).map((permission) => (
                      <ComboboxItem key={permission.id} value={permission.id}>
                        <span className="flex min-w-0 flex-1 flex-col">
                          <span className="truncate">{permission.name}</span>
                          <span className="truncate font-mono text-xs text-muted-foreground">
                            {permission.code}
                          </span>
                        </span>
                      </ComboboxItem>
                    ))}
                  </ComboboxList>
                </ComboboxPopup>
              </ComboboxPositioner>
            </ComboboxPortal>
          </Combobox>
        )}
        <p className="text-xs text-muted-foreground">
          {permissionIds.length > 0
            ? `${permissionIds.length} permission${permissionIds.length === 1 ? "" : "s"} selected.`
            : "Select the permissions assigned to this role."}
        </p>
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
