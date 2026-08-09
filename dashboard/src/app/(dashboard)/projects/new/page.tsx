"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useProjects } from "@/hooks/use-projects"
import { ProjectForm } from "@/components/projects/project-form"
import { Text } from "@/components/ui/text"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type { ProjectFormData } from "@/types/project"
import { errorMessage } from "@/lib/errors"

export default function NewProjectPage() {
  const router = useRouter()
  const { createProject, isCreating, createError } = useProjects()
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(data: ProjectFormData) {
    setError(null)
    try {
      const created = await createProject(data)
      router.push(`/projects/${created.id}`)
    } catch (e) {
      setError(errorMessage(e))
    }
  }

  const displayError = error ?? (createError ? errorMessage(createError) : null)

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Text variant="h2">Create project</Text>
        <Text variant="muted">
          Add a new scoped work area to this workspace.
        </Text>
      </div>

      {displayError && (
        <Alert variant="error">
          <AlertTitle>Failed to create project</AlertTitle>
          <AlertDescription>{displayError}</AlertDescription>
        </Alert>
      )}

      <ProjectForm onSubmit={handleSubmit} isSubmitting={isCreating} />
    </div>
  )
}
