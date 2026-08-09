"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import useSWR from "swr";
import { abortInFlightRequests } from "@/lib/api";
import { getStoredAuth } from "@/utils/auth";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building2Icon, Loader2Icon } from "lucide-react";
import { workspaceService } from "@/services";
import type { WorkspaceDescribeRes } from "@/types/workspace";

interface Workspace {
  id: string;
  name: string;
}

const ACTIVE_WORKSPACE_KEY = "active_workspace_id";

export function WorkspaceSelector() {
  const wsSvc = workspaceService;
  const { data, isLoading } = useSWR<{ workspaces: WorkspaceDescribeRes[] }>(
    ["workspaces", "list"],
    () => wsSvc.list().then((res: { workspaces: WorkspaceDescribeRes[] }) => ({ workspaces: res.workspaces })),
  );

  const { workspaces } = data ?? { workspaces: [] };

  const [activeId, setActiveId] = useState<string | null>(() =>
    typeof window !== "undefined"
      ? localStorage.getItem(ACTIVE_WORKSPACE_KEY)
      : null,
  );

  // Resolve the active workspace using three-tier priority (FR-006):
  // 1. localStorage ("active_workspace_id") — persisted user selection
  // 2. token claims ".ws" — workspace from JWT auth context
  // 3. workspaces[0] — first available workspace (final fallback)
  const activeWorkspace = useMemo(() => {
    if (!workspaces || workspaces.length === 0) return null;

    const stored =
      activeId ??
      (typeof window !== "undefined"
        ? localStorage.getItem(ACTIVE_WORKSPACE_KEY)
        : null);
    if (stored) {
      const found = workspaces.find((w) => w.id === stored);
      if (found) return found;
    }

    // Fall back to token claims workspace (FR-006)
    if (typeof window !== "undefined") {
      const claimsWs = getStoredAuth()?.claims?.ws;
      if (claimsWs) {
        const found = workspaces.find((w) => w.id === claimsWs);
        if (found) return found;
      }
    }

    return workspaces[0];
  }, [workspaces, activeId]);

  // Persist the active workspace selection (external system sync only)
  useEffect(() => {
    if (activeWorkspace) {
      localStorage.setItem(ACTIVE_WORKSPACE_KEY, activeWorkspace.id);
      // Notify workspace-scoped hooks (e.g. useActiveWorkspaceId) of the
      // change. Dispatched AFTER localStorage update and
      // abortInFlightRequests() (called synchronously in handleChange) so
      // that post-switch re-fetches use the new AbortController.
      window.dispatchEvent(new Event("oxideauth:workspace-change"));
    }
  }, [activeWorkspace]);

  function handleChange(value: string | null) {
    if (!value) return;
    // Abort in-flight requests for the previous workspace before switching,
    // so stale responses never overwrite the new workspace's data (FR-008).
    abortInFlightRequests();
    setActiveId(value);
  }

  if (isLoading) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="gap-2 text-muted-foreground"
        disabled
      >
        <Loader2Icon className="size-4 animate-spin" />
        <span className="hidden sm:inline">Workspaces</span>
      </Button>
    );
  }

  if (!workspaces || workspaces.length === 0) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="gap-2 text-muted-foreground"
        render={<Link href="/workspaces" />}
      >
        <Building2Icon className="size-4" />
        <span className="hidden sm:inline">No workspaces</span>
      </Button>
    );
  }

  return (
    <Select value={activeWorkspace?.name} onValueChange={handleChange}>
      <SelectTrigger size="sm" className="gap-2 text-muted-foreground">
        <Building2Icon className="size-4" />
        <SelectValue placeholder="Select workspace" />
      </SelectTrigger>
      <SelectContent>
        {workspaces.map((w) => (
          <SelectItem key={w.id} value={w.id}>
            {w.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}