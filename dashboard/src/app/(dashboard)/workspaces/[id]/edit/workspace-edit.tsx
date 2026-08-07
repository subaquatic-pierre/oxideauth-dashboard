"use client";

import { useParams, useRouter } from "next/navigation";
import { useWorkspace, useUpdateWorkspace } from "@/hooks/use-workspaces";
import { useToast } from "@/components/ui/toast";
import { WorkspaceForm } from "@/components/workspaces/workspace-form";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import type { WorkspaceFormData } from "@/types/workspace";

export default function EditWorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { data: workspace, isLoading, error: loadError } = useWorkspace(id);
  const updateWorkspace = useUpdateWorkspace(id);
  const toast = useToast();

  async function handleSubmit(data: WorkspaceFormData) {
    try {
      await updateWorkspace.trigger(data);
      toast.success(`Workspace "${workspace?.name ?? id}" updated.`);
      router.push(`/workspaces/${id}`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update workspace.",
      );
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  if (loadError || !workspace) {
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

  const errorMessage =
    updateWorkspace.error instanceof Error ? updateWorkspace.error.message : null;

  return (
    <WorkspaceForm
      key={workspace.id}
      initialData={workspace}
      onSubmit={handleSubmit}
      isSubmitting={updateWorkspace.isMutating}
      error={errorMessage}
    />
  );
}
