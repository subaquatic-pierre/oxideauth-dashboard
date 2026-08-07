"use client"

import Link from "next/link"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { EyeIcon, PencilIcon, Trash2Icon, Loader2Icon } from "lucide-react"
import type { Permission } from "@/types/permission"

interface PermissionTableProps {
  permissions: Permission[]
  deletingId?: string | null
  onDelete?: (permission: Permission) => void
}

export function PermissionTable({
  permissions,
  deletingId,
  onDelete,
}: PermissionTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Code</TableHead>
          <TableHead>Description</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {permissions.map((permission) => (
          <TableRow key={permission.id}>
            <TableCell className="font-medium">{permission.name}</TableCell>
            <TableCell>
              <Badge variant="secondary" className="font-mono">
                {permission.code}
              </Badge>
            </TableCell>
            <TableCell className="max-w-72 truncate text-muted-foreground">
              {permission.description || "—"}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-0.5">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`View ${permission.name}`}
                  render={<Link href={`/permissions/${permission.id}`} />}
                >
                  <EyeIcon />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Edit ${permission.name}`}
                  render={<Link href={`/permissions/${permission.id}/edit`} />}
                >
                  <PencilIcon />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Delete ${permission.name}`}
                  disabled={deletingId === permission.id}
                  onClick={() => onDelete?.(permission)}
                >
                  {deletingId === permission.id ? (
                    <Loader2Icon className="animate-spin" />
                  ) : (
                    <Trash2Icon />
                  )}
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
