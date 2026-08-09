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
import { Pill } from "@/components/ui/pill"
import { EyeIcon, PencilIcon, Trash2Icon, Loader2Icon } from "lucide-react"
import type { RoleDescribeRes } from "@/types/role"

interface RoleTableProps {
  roles: RoleDescribeRes[]
  deletingId?: string | null
  onDelete?: (role: RoleDescribeRes) => void
}

export function RoleTable({ roles, deletingId, onDelete }: RoleTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Permissions</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {roles.map((role) => {
          const count = role.permissions?.length ?? 0
          return (
            <TableRow key={role.id}>
              <TableCell className="font-medium">{role.name}</TableCell>
              <TableCell className="max-w-72 truncate text-muted-foreground">
                {role.description || "—"}
              </TableCell>
              <TableCell>
                <Pill variant="info">{count}</Pill>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-0.5">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`View ${role.name}`}
                    render={<Link href={`/roles/${role.id}`} />}
                  >
                    <EyeIcon />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Edit ${role.name}`}
                    render={<Link href={`/roles/${role.id}/edit`} />}
                  >
                    <PencilIcon />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Delete ${role.name}`}
                    disabled={deletingId === role.id}
                    onClick={() => onDelete?.(role)}
                  >
                    {deletingId === role.id ? (
                      <Loader2Icon className="animate-spin" />
                    ) : (
                      <Trash2Icon />
                    )}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
