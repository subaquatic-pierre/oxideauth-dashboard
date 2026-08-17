import { BaseService } from "./base"
import type { Profile, ProfileFormData, ProfileListParams } from "@/types/profile"
import type { PaginatedResponse } from "@/types/pagination"
import { getActiveWorkspaceId } from "@/lib/workspace"
import { isGuestMode } from "@/lib/guest-mode"
import { mockOk } from "@/lib/mock-ok"
import { MOCK_PROFILES, filterByWorkspace } from "@/lib/mock-data"
import { isUuid } from "@/lib/utils"

/**
 * ProfileService — workspace-facing user directory.
 *
 * Profiles are read/updated/deleted through this service. There is NO
 * `create` method: creating a user goes through `MembershipService.create`
 * (email onboarding), which creates account + profile + membership in one call.
 */
export class ProfileService extends BaseService {
  list(filters?: ProfileListParams): Promise<Profile[]> {
    if (isGuestMode()) {
      const items = filterByWorkspace(MOCK_PROFILES, getActiveWorkspaceId())
      return Promise.resolve(mockOk(items).data as unknown as Profile[])
    }
    return this.post<PaginatedResponse<Profile, "profiles">>("/profiles/list", {
      filter: {
        fields: { ...(filters ?? {}) },
      },
      options: {
        limit: 500,
        offset: 0,
        order_bys: "!created_at",
      },
    }).then((res) => (res.profiles as Profile[]) ?? [])
  }

  // Accepts either a profile UUID `id` or the workspace-facing `email`.
  describe(identifier: string): Promise<Profile> {
    if (isGuestMode()) {
      const profile = filterByWorkspace(
        MOCK_PROFILES,
        getActiveWorkspaceId(),
      ).find((p) => p.id === identifier || p.email === identifier)
      return Promise.resolve(
        mockOk(profile ?? MOCK_PROFILES[0]).data as unknown as Profile,
      )
    }
    return this.post<Profile>("/profiles/describe", profileIdentifier(identifier))
  }

  update(id: string, data: Partial<ProfileFormData>): Promise<Profile> {
    if (isGuestMode()) {
      return Promise.resolve(
        mockOk({ id, ...data }).data as unknown as Profile,
      )
    }
    return this.post<Profile>("/profiles/update", { id, ...data })
  }

  delete(id: string): Promise<void> {
    if (isGuestMode()) {
      return Promise.resolve()
    }
    return this.post<void>("/profiles/delete", { id })
  }
}

function profileIdentifier(idOrEmail: string): Record<string, string> {
  return isUuid(idOrEmail) ? { id: idOrEmail } : { email: idOrEmail }
}
