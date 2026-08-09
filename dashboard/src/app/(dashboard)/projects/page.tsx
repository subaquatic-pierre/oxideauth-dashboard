"use client"

import { useState } from "react"
import Link from "next/link"
import { useProjects } from "@/hooks/use-projects"
import { useCan } from "@/hooks/use-permissions-check"
import { ProjectTable } from "@/components/projects/project-table"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Text } from "@/components/ui/text"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { isNetworkError } from "@/lib/api"
import { errorMessage } from "@/lib/errors"
import { PlusIcon, FolderKanbanIcon } from "lucide-react"
import type { Project } from "@/types/project"

const PAGE_SIZE = 10

export default function ProjectsPage() {
  const [page, setPage] = useState(1)
  const [searchInput, setSearchInput] = useState("")
  const [search, setSearch] = useState("")
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const { projects, total, isLoading, error, deleteProject, isDeleting } =
    useProjects({
      limit: PAGE_SIZE,
      offset: (page - 1) * PAGE_SIZE,
      order_bys: ["!created_at"],
      fields: search ? { name: search } : undefined,
    })

  function applySearch(e?: React.FormEvent) {
    e?.preventDefault()
    setSearch(searchInput.trim())
    setPage(1)
  }

  function clearFilters() {
    setSearchInput("")
    setSearch("")
    setPage(1)
  }

  async function handleDelete() {
    if (!deleteTarget) return
    setDeleteError(null)
    try {
      await deleteProject(deleteTarget.id)
      setDeleteTarget(null)
    } catch (e) {
      setDeleteError(errorMessage(e))
    }
  }

  const showEmpty = !isLoading && projects.length === 0

  // PERMISSION-GATED: Create requires `project:create`.
  const canCreate = useCan("project", "create")

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Text variant="h2">Projects</Text>
          <Text variant="muted">
            Scoped work areas within the current workspace.
          </Text>
        </div>
        {canCreate && (
          <Button render={<Link href="/projects/new" />}>
            <PlusIcon />
            New Project
          </Button>
        )}
      </div>

      {error && (
        <Alert variant="error">
          <AlertTitle>Failed to load projects</AlertTitle>
          <AlertDescription>
            {isNetworkError(error)
              ? "Unable to connect to the OxideAuth API. Please check your connection and try again."
              : errorMessage(error)}
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={applySearch} className="flex items-center gap-2">
        <Input
          placeholder="Filter by name..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="max-w-xs"
        />
        <Button type="submit" variant="outline">
          Search
        </Button>
        {search && (
          <Button type="button" variant="ghost" onClick={clearFilters}>
            Clear
          </Button>
        )}
      </form>

      {showEmpty && !search ? (
        <Card className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <FolderKanbanIcon className="size-10 text-muted-foreground/40" />
          <div>
            <p className="font-medium">No projects yet</p>
            <p className="text-sm text-muted-foreground">
              Create your first project to get started.
            </p>
          </div>
          {canCreate && (
            <Button render={<Link href="/projects/new" />}>
              <PlusIcon />
              Create Project
            </Button>
          )}
        </Card>
      ) : showEmpty && search ? (
        <div className="rounded-lg border border-dashed py-12 text-center">
          <p className="text-sm text-muted-foreground">
            No projects match your filters.
          </p>
          <Button variant="outline" className="mt-3" onClick={clearFilters}>
            Clear filters
          </Button>
        </div>
      ) : (
        <ProjectTable
          projects={projects}
          isLoading={isLoading}
          total={total}
          page={page}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
          onDelete={setDeleteTarget}
        />
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete project"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        isConfirming={isDeleting}
        error={deleteError}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteTarget(null)
            setDeleteError(null)
          }
        }}
        onConfirm={handleDelete}
      />
    </div>
  )
}
