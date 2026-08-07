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
import { Skeleton } from "@/components/ui/skeleton"
import {
  EyeIcon,
  PencilIcon,
  Trash2Icon,
  FingerprintIcon,
} from "lucide-react"
import { formatDateTime, shortId } from "@/lib/format"
import type {
  Credential,
  CredentialStatus,
} from "@/types/credential"

const statusBadgeClass: Record<CredentialStatus, string> = {
  active: "bg-green-500/10 text-green-700 dark:text-green-400",
  revoked: "bg-red-500/10 text-red-700 dark:text-red-400",
  pending: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
}

interface CredentialTableProps {
  credentials: Credential[]
  isLoading?: boolean
  total?: number
  page?: number
  pageSize?: number
  onPageChange?: (page: number) => void
  onDelete?: (credential: Credential) => void
}

export function CredentialTable({
  credentials,
  isLoading = false,
  total = 0,
  page = 1,
  pageSize = 10,
  onPageChange,
  onDelete,
}: CredentialTableProps) {
  const offset = (page - 1) * pageSize

  return (
    <div className="space-y-3">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Account</TableHead>
            <TableHead>Kind</TableHead>
            <TableHead>Provider</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Used</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && credentials.length === 0 ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={`skeleton-${i}`}>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="ml-auto h-4 w-20" />
                </TableCell>
              </TableRow>
            ))
          ) : credentials.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="h-24 text-center text-muted-foreground"
              >
                <div className="flex flex-col items-center gap-2">
                  <FingerprintIcon className="size-8 text-muted-foreground/50" />
                  No credentials
                </div>
              </TableCell>
            </TableRow>
          ) : (
            credentials.map((credential) => (
              <TableRow key={credential.id}>
                <TableCell>
                  <span
                    className="font-mono text-xs"
                    title={credential.account_id}
                  >
                    {shortId(credential.account_id, 12)}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{credential.kind}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{credential.provider}</Badge>
                </TableCell>
                <TableCell>
                  <Badge className={statusBadgeClass[credential.status]}>
                    {credential.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {credential.last_used_at
                    ? formatDateTime(credential.last_used_at)
                    : "Never"}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      render={
                        <Link
                          href={`/credentials/${credential.id}?account_id=${credential.account_id}`}
                        />
                      }
                      aria-label="View credential"
                    >
                      <EyeIcon className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      render={
                        <Link
                          href={`/credentials/${credential.id}/edit?account_id=${credential.account_id}`}
                        />
                      }
                      aria-label="Edit credential"
                    >
                      <PencilIcon className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => onDelete?.(credential)}
                      aria-label="Delete credential"
                    >
                      <Trash2Icon className="size-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {total > pageSize && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Showing {total === 0 ? 0 : offset + 1}–
            {Math.min(offset + pageSize, total)} of {total}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => onPageChange?.(page - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={offset + pageSize >= total}
              onClick={() => onPageChange?.(page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
