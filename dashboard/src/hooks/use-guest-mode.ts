"use client";

import { useGuestSession } from "@/providers/guest-session-provider";

/**
 * Thin hook wrapping GuestSessionContext consumption.
 * Exposes `{ isGuest, enterGuestMode, exitGuestMode }` per constitution
 * Principle 2 (Context exposes state + mutation methods).
 */
export function useGuestMode() {
  return useGuestSession();
}
