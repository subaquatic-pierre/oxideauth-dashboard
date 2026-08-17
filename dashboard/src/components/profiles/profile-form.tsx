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
import { ArrowLeftIcon, XIcon } from "lucide-react";
import type { Profile, ProfileFormData } from "@/types/profile";

interface ProfileFormProps {
  profile: Profile;
  onSubmit: (data: ProfileFormData) => Promise<void>;
  isPending: boolean;
  error: Error | null;
}

export function ProfileForm({
  profile,
  onSubmit,
  isPending,
  error,
}: ProfileFormProps) {
  const router = useRouter();

  const [email, setEmail] = React.useState(profile.email ?? "");
  const [name, setName] = React.useState(profile.name ?? "");
  const [description, setDescription] = React.useState(
    profile.description ?? "",
  );
  const [displayName, setDisplayName] = React.useState(
    profile.display_name ?? "",
  );
  const [jobTitle, setJobTitle] = React.useState(profile.job_title ?? "");
  const [timezone, setTimezone] = React.useState(profile.timezone ?? "");
  const [avatarUrl, setAvatarUrl] = React.useState(profile.avatar_url ?? "");
  const [tags, setTags] = React.useState<string[]>(profile.tags ?? []);
  const [tagInput, setTagInput] = React.useState("");
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = "Name is required";
    if (!email.trim()) next.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      next.email = "Enter a valid email address";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function addTag() {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !tags.includes(tag)) {
      setTags((prev) => [...prev, tag]);
      setTagInput("");
    }
  }

  function removeTag(tag: string) {
    setTags((prev) => prev.filter((t) => t !== tag));
  }

  function handleTagKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
    if (e.key === "Backspace" && !tagInput && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    const data: ProfileFormData = {
      email: email.trim(),
      name: name.trim(),
      ...(description.trim() ? { description: description.trim() } : {}),
      ...(displayName.trim() ? { display_name: displayName.trim() } : {}),
      ...(jobTitle.trim() ? { job_title: jobTitle.trim() } : {}),
      ...(timezone.trim() ? { timezone: timezone.trim() } : {}),
      ...(avatarUrl.trim() ? { avatar_url: avatarUrl.trim() } : {}),
      tags,
    };

    await onSubmit(data);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push(`/profiles/${profile.id}`)}
        >
          <ArrowLeftIcon className="size-4" />
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">
          Edit &quot;{profile.name}&quot;
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Profile Details</CardTitle>
            <CardDescription>
              Update this person&apos;s workspace profile.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Name<span className="ml-1 text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="e.g. Alice Johnson"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  aria-invalid={!!errors.name}
                />
                {errors.name && (
                  <p className="text-xs text-destructive">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  Email<span className="ml-1 text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="e.g. alice@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  aria-invalid={!!errors.email}
                />
                {errors.email && (
                  <p className="text-xs text-destructive">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="display-name">Display name</Label>
                <Input
                  id="display-name"
                  placeholder="e.g. Alice"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="job-title">Job title</Label>
                <Input
                  id="job-title"
                  placeholder="e.g. Principal"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Input
                  id="timezone"
                  placeholder="e.g. Europe/London"
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="avatar-url">Avatar URL</Label>
                <Input
                  id="avatar-url"
                  type="url"
                  placeholder="https://example.com/avatars/alice.png"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Optional description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label>Tags</Label>
                <div className="flex min-h-9 flex-wrap items-center gap-1.5 rounded-lg border border-input bg-transparent px-2.5 py-1 transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="inline-flex items-center rounded-sm hover:bg-secondary-foreground/20"
                      >
                        <XIcon className="size-3" />
                      </button>
                    </span>
                  ))}
                  <input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    onBlur={addTag}
                    placeholder={
                      tags.length === 0 ? "Add a tag (press Enter)..." : ""
                    }
                    className="min-w-[80px] flex-1 border-0 bg-transparent py-0.5 text-sm outline-none placeholder:text-muted-foreground"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3">
                <p className="text-sm text-destructive">
                  {error instanceof Error
                    ? error.message
                    : "Failed to save profile"}
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/profiles/${profile.id}`)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
