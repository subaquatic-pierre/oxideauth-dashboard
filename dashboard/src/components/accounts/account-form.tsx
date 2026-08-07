"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeftIcon, XIcon } from "lucide-react";
import type { Account, AccountFormData } from "@/types/account";

interface AccountFormProps {
  account?: Account;
  onSubmit: (data: AccountFormData) => Promise<void>;
  isPending: boolean;
  error: Error | null;
}

export function AccountForm({
  account,
  onSubmit,
  isPending,
  error,
}: AccountFormProps) {
  const router = useRouter();
  const isEditing = !!account;

  // ── State ────────────────────────────────────────────────────────────
  const [email, setEmail] = React.useState(account?.email ?? "");
  const [name, setName] = React.useState(account?.name ?? "");
  const [password, setPassword] = React.useState("");
  const [description, setDescription] = React.useState(
    account?.description ?? "",
  );
  const [avatarUrl, setAvatarUrl] = React.useState(account?.avatar_url ?? "");
  const [tags, setTags] = React.useState<string[]>(account?.tags ?? []);
  const [enabled, setEnabled] = React.useState(account?.enabled ?? true);
  const [verified, setVerified] = React.useState(account?.verified ?? false);
  const [tagInput, setTagInput] = React.useState("");

  // ── Validation ───────────────────────────────────────────────────────
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!email.trim()) {
      next.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      next.email = "Enter a valid email address";
    }
    if (!name.trim()) next.name = "Name is required";
    if (!isEditing && !password) next.password = "Password is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  // ── Tags ─────────────────────────────────────────────────────────────
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

  // ── Submit ───────────────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    const data: AccountFormData = {
      email: email.trim(),
      name: name.trim(),
      ...(!isEditing
        ? { password }
        : password
          ? { password }
          : {}),
      ...(description.trim() ? { description: description.trim() } : {}),
      ...(avatarUrl.trim() ? { avatar_url: avatarUrl.trim() } : {}),
      tags,
      ...(isEditing ? { enabled, verified } : {}),
    };

    await onSubmit(data);
  }

  // ── Render ───────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() =>
            router.push(isEditing ? `/accounts/${account!.id}` : "/accounts")
          }
        >
          <ArrowLeftIcon className="size-4" />
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">
          {isEditing ? `Edit "${account!.name}"` : "Create Account"}
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
            <CardDescription>
              {isEditing
                ? "Update account information and status."
                : "Create a new account in this workspace."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">
                Email
                <span className="ml-1 text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="e.g. alice@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isEditing}
                required
                aria-invalid={!!errors.email}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email}</p>
              )}
            </div>

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">
                Name
                <span className="ml-1 text-destructive">*</span>
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

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">
                Password
                {!isEditing && (
                  <span className="ml-1 text-destructive">*</span>
                )}
              </Label>
              <Input
                id="password"
                type="password"
                placeholder={
                  isEditing
                    ? "Leave blank to keep the current password"
                    : "e.g. SecureP@ssw0rd!"
                }
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                aria-invalid={!!errors.password}
              />
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Optional description of this account"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Avatar URL */}
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

            {/* Tags */}
            <div className="space-y-2">
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
                  placeholder={tags.length === 0 ? "Add a tag (press Enter)..." : ""}
                  className="min-w-[80px] flex-1 border-0 bg-transparent py-0.5 text-sm outline-none placeholder:text-muted-foreground"
                />
              </div>
            </div>

            {/* Status toggles (edit mode only) */}
            {isEditing && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-2">
                  <Switch
                    id="enabled"
                    checked={enabled}
                    onCheckedChange={setEnabled}
                  />
                  <Label htmlFor="enabled" className="cursor-pointer">
                    Account enabled
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="verified"
                    checked={verified}
                    onCheckedChange={setVerified}
                  />
                  <Label htmlFor="verified" className="cursor-pointer">
                    Email verified
                  </Label>
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3">
                <p className="text-sm text-destructive">
                  {error instanceof Error
                    ? error.message
                    : "Failed to save account"}
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                router.push(isEditing ? `/accounts/${account!.id}` : "/accounts")
              }
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending
                ? "Saving..."
                : isEditing
                  ? "Save Changes"
                  : "Create Account"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
