"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useProject, useProjects } from "@/hooks/use-projects"
import { ProjectForm } from "@/components/projects/project-form"
import { Text } from "@/components/ui/text"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type { ProjectFormData } from "@/types/project"

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Request failed"
}

export default function EditProjectPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const id = params.id
  const { project, isLoading, error } = useProject(id)
  const { updateProject, isUpdating, updateError } = useProjects()
  const [submitError, setSubmitError] = useState<string | null>(null)

  async function handleSubmit(data: ProjectFormData) {
    if (!project) return
    setSubmitError(null)
    try {
      await updateProject({ id: project.id, data })
      router.push(`/projects/${project.id}`)
    } catch (e) {
      setSubmitError(errorMessage(e))
    }
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96 w-full" />
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

  const displayError =
    submitError ?? (updateError ? errorMessage(updateError) : null)

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Text variant="h2">Edit project</Text>
        <Text variant="muted">Update the details for {project.name}.</Text>
      </div>

      {displayError && (
        <Alert variant="error">
          <AlertTitle>Failed to update project</AlertTitle>
          <AlertDescription>{displayError}</AlertDescription>
        </Alert>
      )}

      <ProjectForm
        project={project}
        onSubmit={handleSubmit}
        isSubmitting={isUpdating}
      />
    </div>
  )
}
