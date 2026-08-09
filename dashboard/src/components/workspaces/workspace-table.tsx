"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/format";
import { EyeIcon, EditIcon, TrashIcon } from "lucide-react";
import type { WorkspaceDescribeRes } from "@/types/workspace";

interface WorkspaceTableProps {
  workspaces?: WorkspaceDescribeRes[];
  onDelete: (workspace: WorkspaceDescribeRes) => void;
}

export function WorkspaceTable({ workspaces, onDelete }: WorkspaceTableProps) {
  // Loading state — the list hasn't resolved yet.
  if (!workspaces) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (workspaces.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border py-16">
        <p className="text-muted-foreground">No workspaces found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {workspaces.map((workspace) => (
            <TableRow key={workspace.id}>
              <TableCell>
                <Link
                  href={`/workspaces/${workspace.id}`}
                  className="font-semibold text-primary underline-offset-2 hover:underline"
                >
                  {workspace.name}
                </Link>
              </TableCell>
              <TableCell>
                <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
                  {workspace.slug}
                </code>
              </TableCell>
              <TableCell className="whitespace-nowrap text-muted-foreground">
                {formatDate(workspace.created_at)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    title="View"
                    render={<Link href={`/workspaces/${workspace.id}`} />}
                  >
                    <EyeIcon />
                    <span className="sr-only">View</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    title="Edit"
                    render={<Link href={`/workspaces/${workspace.id}/edit`} />}
                  >
                    <EditIcon />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    title="Delete"
                    className="text-destructive hover:text-destructive"
                    onClick={() => onDelete(workspace)}
                  >
                    <TrashIcon />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
