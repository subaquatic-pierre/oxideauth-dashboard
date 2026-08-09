"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeftIcon } from "lucide-react";
import type { WorkspaceDescribeRes, WorkspaceFormData } from "@/types/workspace";

interface WorkspaceFormProps {
  initialData?: WorkspaceDescribeRes;
  onSubmit: (data: WorkspaceFormData) => Promise<void>;
  isSubmitting: boolean;
  error?: string | null;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function WorkspaceForm({
  initialData,
  onSubmit,
  isSubmitting,
  error,
}: WorkspaceFormProps) {
  const router = useRouter();
  const isEditing = !!initialData;

  const [name, setName] = React.useState(initialData?.name ?? "");
  const [slug, setSlug] = React.useState(initialData?.slug ?? "");
  const [description, setDescription] = React.useState(
    initialData?.description ?? "",
  );
  const [tags, setTags] = React.useState(initialData?.tags?.join(", ") ?? "");
  // Once the user edits the slug manually, stop auto-generating it.
  const [slugTouched, setSlugTouched] = React.useState(isEditing);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  function handleNameChange(value: string) {
    setName(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!slug.trim()) {
      newErrors.slug = "Slug is required";
    } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug.trim())) {
      newErrors.slug = "Slug must be lowercase letters, numbers, and dashes";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    const data: WorkspaceFormData = {
      name: name.trim(),
      slug: slug.trim(),
      description: description.trim() || undefined,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };

    await onSubmit(data);
  }

  const cancelHref = initialData
    ? `/workspaces/${initialData.id}`
    : "/workspaces";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push(cancelHref)}>
          <ArrowLeftIcon className="size-4" />
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">
          {isEditing ? `Edit ${initialData.name}` : "New Workspace"}
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Workspace Details</CardTitle>
            <CardDescription>
              {isEditing
                ? "Update the details of your workspace."
                : "Create a new workspace (tenant)."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">
                Name
                <span className="ml-1 text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Acme Corp"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                required
                aria-invalid={!!errors.name}
              />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">
                Slug
                <span className="ml-1 text-destructive">*</span>
              </Label>
              <Input
                id="slug"
                placeholder="acme-corp"
                value={slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setSlug(e.target.value);
                }}
                required
                aria-invalid={!!errors.slug}
              />
              {errors.slug && (
                <p className="text-xs text-destructive">{errors.slug}</p>
              )}
              <p className="text-xs text-muted-foreground">
                URL-friendly unique identifier. Auto-generated from the name —
                you can override it.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Primary workspace for Acme Corp"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                placeholder="production, primary"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Comma-separated list of tags.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => router.push(cancelHref)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Saving..."
                : isEditing
                  ? "Save Changes"
                  : "Create Workspace"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
