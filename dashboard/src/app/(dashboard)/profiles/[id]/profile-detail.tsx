"use client";

import { useParams, useRouter } from "next/navigation";
import { useProfile } from "@/hooks/use-profiles";
import { useActiveWorkspaceId } from "@/hooks/use-active-workspace";
import { useCan } from "@/hooks/use-permissions-check";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDateTime } from "@/lib/format";
import {
  ArrowLeftIcon,
  EditIcon,
  MailIcon,
  IdCardIcon,
  CalendarIcon,
  ClockIcon,
} from "lucide-react";

function getInitials(name?: string): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg bg-muted/50 px-4 py-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="min-w-0 truncate text-sm font-medium">{value ?? "-"}</span>
    </div>
  );
}

export default function ProfileDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const workspaceId = useActiveWorkspaceId();
  const { data: profile, isLoading, error } = useProfile(id);

  // PERMISSION-GATED: Edit requires `profile:update`.
  const canEdit = useCan("profile", "update");

  if (isLoading || (workspaceId && !profile && !error)) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/profiles")}
          >
            <ArrowLeftIcon className="size-4" />
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">
            Profile not found
          </h1>
        </div>
        <p className="text-muted-foreground">
          The profile you&apos;re looking for doesn&apos;t exist or has been
          removed.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/profiles")}
          >
            <ArrowLeftIcon className="size-4" />
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">{profile.name}</h1>
        </div>
        {canEdit && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/profiles/${id}/edit`)}
          >
            <EditIcon className="mr-2 size-4" />
            Edit
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Workspace-facing identity for this person.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-4 rounded-lg bg-muted/50 px-4 py-3">
            <Avatar size="lg">
              {profile.avatar_url ? (
                <AvatarImage src={profile.avatar_url} alt={profile.name} />
              ) : null}
              <AvatarFallback className="text-sm font-medium">
                {getInitials(profile.name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="font-medium">{profile.name}</p>
              <p className="text-sm text-muted-foreground">{profile.email}</p>
            </div>
          </div>
          {profile.description && (
            <p className="text-sm text-muted-foreground">{profile.description}</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
          <CardDescription>Persona fields and metadata.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <DetailRow
            label="ID"
            value={
              <span className="inline-flex items-center gap-1.5">
                <IdCardIcon className="size-3.5 text-muted-foreground" />
                <span className="font-mono text-xs">{profile.id}</span>
              </span>
            }
          />
          <DetailRow
            label="Email"
            value={
              <span className="inline-flex items-center gap-1.5">
                <MailIcon className="size-3.5 text-muted-foreground" />
                {profile.email}
              </span>
            }
          />
          <DetailRow label="Name" value={profile.name} />
          <DetailRow label="Display name" value={profile.display_name ?? "-"} />
          <DetailRow label="Job title" value={profile.job_title ?? "-"} />
          <DetailRow label="Timezone" value={profile.timezone ?? "-"} />
          {profile.avatar_url && (
            <DetailRow label="Avatar URL" value={profile.avatar_url} />
          )}
          {profile.tags && profile.tags.length > 0 && (
            <DetailRow
              label="Tags"
              value={
                <span className="flex flex-wrap justify-end gap-1.5">
                  {profile.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </span>
              }
            />
          )}
          <DetailRow
            label="Created at"
            value={
              <span className="inline-flex items-center gap-1.5">
                <CalendarIcon className="size-3.5 text-muted-foreground" />
                {profile.created_at ? formatDateTime(profile.created_at) : "-"}
              </span>
            }
          />
          <DetailRow
            label="Updated at"
            value={
              <span className="inline-flex items-center gap-1.5">
                <ClockIcon className="size-3.5 text-muted-foreground" />
                {profile.updated_at ? formatDateTime(profile.updated_at) : "-"}
              </span>
            }
          />
        </CardContent>
      </Card>
    </div>
  );
}
