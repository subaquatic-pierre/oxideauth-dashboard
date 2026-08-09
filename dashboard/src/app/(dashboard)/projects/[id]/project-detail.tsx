"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { useProject, useProjects } from "@/hooks/use-projects"
import { useCan } from "@/hooks/use-permissions-check"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { DetailRow } from "@/components/detail-row"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ArrowLeftIcon, PencilIcon, Trash2Icon, FolderKanbanIcon } from "lucide-react"
import { formatDateTime } from "@/lib/format"

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Request failed"
}

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const id = params.id
  const { project, isLoading, error } = useProject(id)
  const { deleteProject, isDeleting, deleteError } = useProjects()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)

  // PERMISSION-GATED: Edit requires `project:update`, Delete requires `project:delete`.
  const canEdit = useCan("project", "update")
  const canDelete = useCan("project", "delete")

  async function handleDelete() {
    if (!project) return
    setActionError(null)
    try {
      await deleteProject(project.id)
      router.push("/projects")
    } catch (e) {
      setActionError(errorMessage(e))
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-28" />
          <Skeleton className="ml-auto h-8 w-40" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (error || !project) {
    return (
      <Alert variant="error">
        <AlertTitle>Failed to load project</AlertTitle>
        <AlertDescription>
          {error ? errorMessage(error) : "Project not found."}
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground"
          onClick={() => router.push("/projects")}
        >
          <ArrowLeftIcon />
          Back to projects
        </Button>
        <div className="flex items-center gap-2">
          {canEdit && (
            <Button
              variant="outline"
              render={<Link href={`/projects/${project.id}/edit`} />}
            >
              <PencilIcon />
              Edit
            </Button>
          )}
          {canDelete && (
            <Button variant="destructive" onClick={() => setConfirmOpen(true)}>
              <Trash2Icon />
              Delete
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
              <FolderKanbanIcon className="size-5" />
            </div>
            <div>
              <CardTitle className="text-xl">{project.name}</CardTitle>
              <CardDescription>
                <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                  {project.code}
                </code>
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <DetailRow label="ID" value={project.id} mono />
            <DetailRow
              label="Description"
              value={project.description || undefined}
            />
            <DetailRow
              label="Config"
              value={
                project.config ? (
                  <code className="whitespace-pre-wrap text-left">
                    {JSON.stringify(project.config, null, 2)}
                  </code>
                ) : undefined
              }
              mono
            />
            <DetailRow
              label="Tags"
              value={
                project.tags && project.tags.length > 0 ? (
                  <span className="flex flex-wrap justify-end gap-1">
                    {project.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </span>
                ) : undefined
              }
            />
            <DetailRow
              label="Created"
              value={formatDateTime(project.created_at)}
            />
            <DetailRow
              label="Updated"
              value={project.updated_at ? formatDateTime(project.updated_at) : "—"}
            />
          </div>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete project"
        description={`Are you sure you want to delete "${project.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        isConfirming={isDeleting}
        error={actionError ?? (deleteError ? errorMessage(deleteError) : null)}
        onOpenChange={(open) => {
          if (!open) {
            setConfirmOpen(false)
            setActionError(null)
          }
        }}
        onConfirm={handleDelete}
      />
    </div>
  )
}
