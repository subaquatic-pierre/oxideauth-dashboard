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
import { EyeIcon, Trash2Icon, TicketIcon } from "lucide-react"
import { formatDateTime, shortId } from "@/lib/format"
import type { BlacklistedToken, TokenKind } from "@/types/token"

const kindVariant: Record<TokenKind, "default" | "outline"> = {
  auth: "default",
  password_reset: "outline",
}

interface TokenTableProps {
  tokens: BlacklistedToken[]
  isLoading?: boolean
  total?: number
  page?: number
  pageSize?: number
  onPageChange?: (page: number) => void
  onDelete?: (token: BlacklistedToken) => void
}

export function TokenTable({
  tokens,
  isLoading = false,
  total = 0,
  page = 1,
  pageSize = 10,
  onPageChange,
  onDelete,
}: TokenTableProps) {
  const offset = (page - 1) * pageSize

  return (
    <div className="space-y-3">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Kind</TableHead>
            <TableHead>Account ID</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead>Expires At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && tokens.length === 0 ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={`skeleton-${i}`}>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-40" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="ml-auto h-4 w-20" />
                </TableCell>
              </TableRow>
            ))
          ) : tokens.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="h-24 text-center text-muted-foreground"
              >
                <div className="flex flex-col items-center gap-2">
                  <TicketIcon className="size-8 text-muted-foreground/50" />
                  No blacklisted tokens
                </div>
              </TableCell>
            </TableRow>
          ) : (
            tokens.map((token) => (
              <TableRow key={token.id}>
                <TableCell>
                  <Badge variant={kindVariant[token.kind]}>
                    {token.kind}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span
                    className="font-mono text-xs"
                    title={token.account_id}
                  >
                    {shortId(token.account_id, 12)}
                  </span>
                </TableCell>
                <TableCell className="max-w-64 truncate text-muted-foreground">
                  {token.reason ?? "—"}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {token.expires_at ? formatDateTime(token.expires_at) : "—"}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      render={<Link href={`/tokens/${token.id}`} />}
                      aria-label="View token"
                    >
                      <EyeIcon className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => onDelete?.(token)}
                      aria-label="Delete token"
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
