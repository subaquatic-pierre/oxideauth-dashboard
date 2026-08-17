"use client";

import { useParams, useRouter } from "next/navigation";
import { useProfile, useUpdateProfile } from "@/hooks/use-profiles";
import { useActiveWorkspaceId } from "@/hooks/use-active-workspace";
import { ProfileForm } from "@/components/profiles/profile-form";
import { Skeleton } from "@/components/ui/skeleton";
import type { ProfileFormData } from "@/types/profile";

export default function EditProfilePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const workspaceId = useActiveWorkspaceId();
  const { data: profile, isLoading, error } = useProfile(id);
  const updateProfile = useUpdateProfile(id);

  async function handleSubmit(data: ProfileFormData) {
    await updateProfile.trigger(data);
    router.push(`/profiles/${id}`);
  }

  if (isLoading || (workspaceId && !profile && !error)) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Profile not found</h1>
        <p className="text-muted-foreground">
          The profile you&apos;re looking for doesn&apos;t exist or has been
          removed.
        </p>
      </div>
    );
  }

  return (
    <ProfileForm
      profile={profile}
      onSubmit={handleSubmit}
      isPending={updateProfile.isMutating}
      error={updateProfile.error}
    />
  );
}
