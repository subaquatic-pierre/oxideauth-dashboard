"use client"

import useSWR, { useSWRConfig } from "swr"
import useSWRMutation from "swr/mutation"
import { membershipsService } from "@/services"
import { useActiveWorkspaceId } from "@/hooks/use-active-workspace"
import { isMembershipsListKey } from "@/lib/swr-helpers"
import type {
  Membership,
  MembershipFilters,
  MembershipFormData,
} from "@/types/membership"

// List memberships for a workspace (optionally filtered).
export function useMemberships(filters?: MembershipFilters) {
  const workspaceId = useActiveWorkspaceId()
  const key = workspaceId
    ? (["memberships", workspaceId, filters ?? null] as const)
    : null
  return useSWR<Membership[]>(key, () => membershipsService.list(filters))
}

// Describe a single membership (includes populated account + roles).
export function useMembership(id: string | null) {
  const workspaceId = useActiveWorkspaceId()
  const key =
    workspaceId && id ? (["membership", workspaceId, id] as const) : null
  return useSWR<Membership>(key, () => membershipsService.describe(id!))
}

export function useCreateMembership() {
  const { mutate } = useSWRConfig()
  const workspaceId = useActiveWorkspaceId()
  return useSWRMutation(
    "membership-create",
    async (
      _key: string,
      { arg }: { arg: MembershipFormData },
    ): Promise<Membership> => {
      return membershipsService.create(arg)
    },
    {
      onSuccess: () => {
        if (workspaceId) {
          mutate((key) => isMembershipsListKey(key))
        }
      },
    },
  )
}

export function useUpdateMembership(id: string) {
  const { mutate } = useSWRConfig()
  const workspaceId = useActiveWorkspaceId()
  return useSWRMutation(
    ["membership-update", id],
    async (
      _key: string[],
      { arg }: { arg: Partial<MembershipFormData> },
    ): Promise<Membership> => {
      return membershipsService.update(id, arg)
    },
    {
      onSuccess: (membership) => {
        if (workspaceId) {
          mutate(["membership", workspaceId, id], membership, {
            revalidate: false,
          })
          mutate((key) => isMembershipsListKey(key))
        }
      },
    },
  )
}

export function useDeleteMembership() {
  const { mutate } = useSWRConfig()
  const workspaceId = useActiveWorkspaceId()
  return useSWRMutation(
    "membership-delete",
    async (
      _key: string,
      { arg }: { arg: string },
    ): Promise<{ id: string }> => {
      await membershipsService.delete(arg)
      return { id: arg }
    },
    {
      onSuccess: (result) => {
        if (workspaceId) {
          mutate(["membership", workspaceId, result.id], null, {
            revalidate: false,
          })
          mutate((key) => isMembershipsListKey(key))
        }
      },
    },
  )
}
