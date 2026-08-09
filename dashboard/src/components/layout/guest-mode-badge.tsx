"use client";

import { useGuestMode } from "@/hooks/use-guest-mode";
import { Badge } from "@/components/ui/badge";

/**
 * Guest Mode indicator badge — displayed in the dashboard header when the
 * current session is in guest/demo mode. Per FR-012, it must be visible on
 * every protected page and visually distinguish guest from authenticated mode.
 */
export function GuestModeBadge() {
  const { isGuest } = useGuestMode();

  if (!isGuest) return null;

  return (
    <Badge variant="secondary" className="ml-2 font-normal">
      Guest Mode
    </Badge>
  );
}
