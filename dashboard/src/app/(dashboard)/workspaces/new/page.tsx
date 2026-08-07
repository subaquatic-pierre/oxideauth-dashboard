"use client";

import { useRouter } from "next/navigation";
import { useCreateWorkspace } from "@/hooks/use-workspaces";
import { useToast } from "@/components/ui/toast";
import { WorkspaceForm } from "@/components/workspaces/workspace-form";
import type { WorkspaceFormData } from "@/types/workspace";

export default function NewWorkspacePage() {
  const router = useRouter();
  const createWorkspace = useCreateWorkspace();
  const toast = useToast();

  async function handleSubmit(data: WorkspaceFormData) {
    try {
      const workspace = await createWorkspace.trigger(data);
      toast.success(`Workspace "${workspace.name}" created.`);
      router.push(`/workspaces/${workspace.id}`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create workspace.",
      );
    }
  }

  const errorMessage =
    createWorkspace.error instanceof Error ? createWorkspace.error.message : null;

  return (
    <WorkspaceForm
      onSubmit={handleSubmit}
      isSubmitting={createWorkspace.isMutating}
      error={errorMessage}
    />
  );
}
