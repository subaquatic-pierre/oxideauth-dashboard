"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useWorkspace, useDeleteWorkspace } from "@/hooks/use-workspaces";
import { useCan } from "@/hooks/use-permissions-check";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatDateTime } from "@/lib/format";
import { ArrowLeftIcon, EditIcon, TrashIcon } from "lucide-react";

export default function WorkspaceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { data: workspace, isLoading, error } = useWorkspace(id);
  const deleteWorkspace = useDeleteWorkspace();
  const [confirmOpen, setConfirmOpen] = useState(false);

  // PERMISSION-GATED: Edit requires `workspace:update`, Delete requires `workspace:delete`.
  const canEdit = useCan("workspace", "update");
  const canDelete = useCan("workspace", "delete");

  async function handleDelete() {
    await deleteWorkspace.trigger(id);
    setConfirmOpen(false);
    router.push("/workspaces");
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (error || !workspace) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push("/workspaces")}>
            <ArrowLeftIcon className="size-4" />
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Workspace not found</h1>
        </div>
        <p className="text-muted-foreground">
          The workspace you&apos;re looking for doesn&apos;t exist or has been deleted.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.push("/workspaces")}>
            <ArrowLeftIcon className="size-4" />
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">{workspace.name}</h1>
          <Badge variant="outline" className="font-mono text-xs">
            {workspace.slug}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          {canEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/workspaces/${workspace.id}/edit`)}
            >
              <EditIcon className="mr-2 size-4" />
              Edit
            </Button>
          )}
          {canDelete && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setConfirmOpen(true)}
            >
              <TrashIcon className="mr-2 size-4" />
              Delete
            </Button>
          )}
        </div>
      </div>

      {/* Details */}
      <Card>
        <CardHeader>
          <CardTitle>Workspace Details</CardTitle>
          <CardDescription>
            {workspace.description ?? "No description."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Name
              </p>
              <p className="font-medium">{workspace.name}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Slug
              </p>
              <p className="font-mono font-medium">{workspace.slug}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                ID
              </p>
              <p className="font-mono text-sm">{workspace.id}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Created At
              </p>
              <p className="font-medium">{formatDateTime(workspace.created_at)}</p>
            </div>
          </div>

          <Separator />

          {/* Tags */}
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Tags
            </p>
            {workspace.tags && workspace.tags.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {workspace.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No tags.</p>
            )}
          </div>

          {/* Config */}
          {workspace.config && Object.keys(workspace.config).length > 0 && (
            <>
              <Separator />
              <div className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Config
                </p>
                <pre className="overflow-x-auto rounded-lg bg-muted p-3 font-mono text-xs">
                  {JSON.stringify(workspace.config, null, 2)}
                </pre>
              </div>
            </>
          )}

          {/* Meta */}
          {workspace.meta && Object.keys(workspace.meta).length > 0 && (
            <>
              <Separator />
              <div className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Meta
                </p>
                <pre className="overflow-x-auto rounded-lg bg-muted p-3 font-mono text-xs">
                  {JSON.stringify(workspace.meta, null, 2)}
                </pre>
              </div>
            </>
          )}

          <Separator />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Updated At
              </p>
              <p className="font-medium">{workspace.updated_at ? formatDateTime(workspace.updated_at) : "—"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete confirmation dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Workspace</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{workspace.name}&quot;? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
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
