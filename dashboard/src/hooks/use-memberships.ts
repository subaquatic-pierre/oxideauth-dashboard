"use client"

import useSWR, { useSWRConfig } from "swr"
import useSWRMutation from "swr/mutation"
import { membershipsService } from "@/services"
import { isMembershipsListKey } from "@/lib/swr-helpers"
import type {
  Membership,
  MembershipFilters,
  MembershipFormData,
} from "@/types/membership"

// List memberships for a workspace (optionally filtered).
export function useMemberships(
  workspaceId: string | null,
  filters?: MembershipFilters,
) {
  const key = workspaceId
    ? (["memberships", workspaceId, filters ?? null] as const)
    : null
  return useSWR<Membership[]>(
    key,
    () => membershipsService.list(workspaceId!, filters),
  )
}

// Describe a single membership (includes populated account + roles).
export function useMembership(workspaceId: string | null, id: string | null) {
  const key =
    workspaceId && id ? (["membership", workspaceId, id] as const) : null
  return useSWR<Membership>(
    key,
    () => membershipsService.describe(workspaceId!, id!),
  )
}

export function useCreateMembership() {
  const { mutate } = useSWRConfig()
  return useSWRMutation(
    "membership-create",
    async (
      _key: string,
      { arg }: { arg: { workspaceId: string; data: MembershipFormData } },
    ): Promise<{ workspaceId: string; membership: Membership }> => {
      const membership = await membershipsService.create(
        arg.workspaceId,
        arg.data,
      )
      return { workspaceId: arg.workspaceId, membership }
    },
    {
      onSuccess: (result) => {
        mutate((key) => isMembershipsListKey(key, result.workspaceId))
      },
    },
  )
}

export function useUpdateMembership(id: string) {
  const { mutate } = useSWRConfig()
  return useSWRMutation(
    ["membership-update", id],
    async (
      _key: string[],
      {
        arg,
      }: {
        arg: { workspaceId: string; data: Partial<MembershipFormData> }
      },
    ): Promise<{ workspaceId: string; id: string; membership: Membership }> => {
      const membership = await membershipsService.update(
        arg.workspaceId,
        id,
        arg.data,
      )
      return { workspaceId: arg.workspaceId, id, membership }
    },
    {
      onSuccess: (result) => {
        mutate(["membership", result.workspaceId, result.id], result.membership, {
          revalidate: false,
        })
        mutate((key) => isMembershipsListKey(key, result.workspaceId))
      },
    },
  )
}

export function useDeleteMembership() {
  const { mutate } = useSWRConfig()
  return useSWRMutation(
    "membership-delete",
    async (
      _key: string,
      { arg }: { arg: { workspaceId: string; id: string } },
    ): Promise<{ workspaceId: string; id: string }> => {
      await membershipsService.delete(arg.workspaceId, arg.id)
      return { workspaceId: arg.workspaceId, id: arg.id }
    },
    {
      onSuccess: (result) => {
        mutate(["membership", result.workspaceId, result.id], null, {
          revalidate: false,
        })
        mutate((key) => isMembershipsListKey(key, result.workspaceId))
      },
    },
  )
}
