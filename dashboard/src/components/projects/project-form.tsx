"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { TagInput } from "@/components/tag-input"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { Project, ProjectFormData } from "@/types/project"

const DEFAULT_CONFIG = JSON.stringify({ schema_version: "1.0" }, null, 2)

interface ProjectFormProps {
  project?: Project
  onSubmit: (data: ProjectFormData) => Promise<void>
  isSubmitting?: boolean
}

/** Project create/edit form: name, code, description, config (JSON), tags. */
export function ProjectForm({
  project,
  onSubmit,
  isSubmitting = false,
}: ProjectFormProps) {
  const router = useRouter()
  const [name, setName] = useState(project?.name ?? "")
  const [code, setCode] = useState(project?.code ?? "")
  const [description, setDescription] = useState(project?.description ?? "")
  const [configText, setConfigText] = useState(
    project?.config ? JSON.stringify(project.config, null, 2) : DEFAULT_CONFIG,
  )
  const [tags, setTags] = useState<string[]>(project?.tags ?? [])
  const [configError, setConfigError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setConfigError(null)

    let config: Record<string, unknown> | undefined
    if (configText.trim()) {
      try {
        config = JSON.parse(configText)
      } catch {
        setConfigError("Config must be valid JSON.")
        return
      }
    }

    await onSubmit({
      name: name.trim(),
      code: code.trim(),
      description: description.trim() || undefined,
      config,
      tags: tags.length > 0 ? tags : undefined,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{project ? "Edit project" : "Create project"}</CardTitle>
        <CardDescription>
          {project
            ? "Update the project details below."
            : "Projects are scoped work areas within a workspace."}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Web Application"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="code">Code</Label>
              <Input
                id="code"
                placeholder="web-app"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Optional description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="config">Config (JSON)</Label>
            <Textarea
              id="config"
              className="min-h-24 font-mono text-xs"
              value={configText}
              onChange={(e) => {
                setConfigText(e.target.value)
                setConfigError(null)
              }}
            />
            {configError && (
              <p className="text-sm text-destructive">{configError}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <TagInput
              value={tags}
              onChange={setTags}
              placeholder="e.g. frontend, public"
            />
          </div>
        </CardContent>
        <CardFooter className="justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              router.push(project ? `/projects/${project.id}` : "/projects")
            }
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? project
                ? "Saving..."
                : "Creating..."
              : project
                ? "Save changes"
                : "Create project"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
