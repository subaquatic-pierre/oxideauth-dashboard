"use client";

import { useState, useDeferredValue, useEffect } from "react";
import Link from "next/link";
import { useWorkspaces, useDeleteWorkspace } from "@/hooks/use-workspaces";
import { useCan } from "@/hooks/use-permissions-check";
import { useToast } from "@/components/ui/toast";
import { WorkspaceTable } from "@/components/workspaces/workspace-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { isNetworkError } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  PlusIcon,
  SearchIcon,
  XIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Building2Icon,
} from "lucide-react";
import type { WorkspaceDescribeRes } from "@/types/workspace";

const PER_PAGE = 10;

export default function WorkspacesPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const deferredSearch = useDeferredValue(search);

  const toast = useToast();

  // Reset to page 1 whenever the search term changes.
  useEffect(() => {
    setPage(1);
  }, [deferredSearch]);

  const filters = {
    fields: deferredSearch.trim() ? { name: deferredSearch.trim() } : undefined,
    limit: PER_PAGE,
    offset: (page - 1) * PER_PAGE,
  };

  const { data, isLoading, error } = useWorkspaces(filters);
  const workspaces = data?.workspaces as WorkspaceDescribeRes[] | undefined;
  const total = data?.metadata.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));

  // PERMISSION-GATED: Create requires `workspace:create`.
  const canCreate = useCan("workspace", "create");

  const deleteWorkspace = useDeleteWorkspace();
  const [deleteTarget, setDeleteTarget] = useState<WorkspaceDescribeRes | null>(null);

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    await deleteWorkspace.trigger(deleteTarget.id);
    toast.success(`Workspace "${deleteTarget.name}" deleted.`);
    setDeleteTarget(null);
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Workspaces</h1>
        <Alert variant="error">
          <AlertTitle>Failed to load workspaces</AlertTitle>
          <AlertDescription>
            {isNetworkError(error)
              ? "Unable to connect to the OxideAuth API. Please check your connection and try again."
              : error instanceof Error
                ? error.message
                : "Please try again."}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const hasSearch = deferredSearch.trim().length > 0;
  const showEmpty = !isLoading && workspaces?.length === 0;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Workspaces</h1>
          <p className="text-sm text-muted-foreground">
            {isLoading ? "Loading..." : `${total} workspace${total !== 1 ? "s" : ""}`}
          </p>
        </div>
        {canCreate && (
          <Button render={<Link href="/workspaces/new" />}>
            <PlusIcon className="mr-2 size-4" />
            Create Workspace
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search workspaces by name…"
          className="pl-10 pr-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            onClick={() => setSearch("")}
          >
            <XIcon className="size-4" />
          </button>
        )}
      </div>

      {/* Empty / no-results states */}
      {showEmpty && !hasSearch ? (
        <Card className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <Building2Icon className="size-10 text-muted-foreground/40" />
          <div>
            <Text variant="h3">No workspaces yet</Text>
            <Text variant="muted" className="mt-2">
              Create your first workspace to get started.
            </Text>
          </div>
          {canCreate && (
            <Button render={<Link href="/workspaces/new" />}>
              <PlusIcon />
              Create Workspace
            </Button>
          )}
        </Card>
      ) : showEmpty && hasSearch ? (
        <div className="rounded-lg border border-dashed py-12 text-center">
          <p className="text-sm text-muted-foreground">
            No workspaces match your filters.
          </p>
          <Button variant="outline" className="mt-3" onClick={() => setSearch("")}>
            Clear filters
          </Button>
        </div>
      ) : (
        <WorkspaceTable
          workspaces={workspaces}
          onDelete={(workspace) => setDeleteTarget(workspace)}
        />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t pt-4">
          <p className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeftIcon className="size-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
              <ChevronRightIcon className="size-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Delete confirmation dialog */}
      <Dialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Workspace</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{deleteTarget?.name}&quot;?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={deleteWorkspace.isMutating}
            >
              {deleteWorkspace.isMutating ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
