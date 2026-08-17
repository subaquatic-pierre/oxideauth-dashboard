"use client";

import useSWR, { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";
import { profileService } from "@/services";
import { useActiveWorkspaceId } from "@/hooks/use-active-workspace";
import type { Profile, ProfileFormData, ProfileListParams } from "@/types/profile";

export function useProfiles(filters?: ProfileListParams) {
  const workspaceId = useActiveWorkspaceId();
  const key = workspaceId
    ? ["profiles", "list", workspaceId, filters ?? {}]
    : null;
  return useSWR<Profile[]>(key, () => profileService.list(filters));
}

export function useProfile(id: string | null | undefined) {
  const workspaceId = useActiveWorkspaceId();
  const key = workspaceId && id ? ["profiles", "detail", workspaceId, id] : null;
  return useSWR<Profile>(key, () => profileService.describe(id as string));
}

export function useUpdateProfile(id: string) {
  const { mutate } = useSWRConfig();

  return useSWRMutation(
    ["profiles", "update", id],
    async (
      _key: string[],
      { arg }: { arg: Partial<ProfileFormData> },
    ) => {
      return profileService.update(id, arg);
    },
    {
      onSuccess: () => {
        // Invalidate both list and detail caches for profiles.
        mutate((key) => Array.isArray(key) && key[0] === "profiles");
      },
    },
  );
}
