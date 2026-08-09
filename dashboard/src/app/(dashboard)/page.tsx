"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { useDashboardCounts } from "@/hooks/use-dashboard";
import { useCan } from "@/hooks/use-permissions-check";
import { Text } from "@/components/ui/text";
import { MetricCard } from "@/components/charts/metric-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { isNetworkError } from "@/lib/api";
import {
  Building2Icon,
  UsersIcon,
  FolderKanbanIcon,
  ShieldIcon,
  KeyIcon,
  UserCheckIcon,
  FingerprintIcon,
  PlusIcon,
  Loader2Icon,
} from "lucide-react";

const emptyCounts = {
  workspaces: 0,
  accounts: 0,
  projects: 0,
  roles: 0,
  permissions: 0,
  memberships: 0,
  credentials: 0,
};

export default function DashboardPage() {
  const { user } = useAuth();
  const { counts, isLoading, error } = useDashboardCounts();
  const canCreateWorkspace = useCan("workspace", "create");
  const canCreateAccount = useCan("account", "create");
  const canCreateRole = useCan("role", "create");

  const values = counts ?? emptyCounts;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Text variant="h2">Welcome back, {user?.name ?? "there"}</Text>
          <Text variant="muted">Overview of the active workspace.</Text>
        </div>

        {/* Quick Create */}
        <div className="flex flex-wrap items-center gap-2">
          {canCreateWorkspace && (
            <Button size="sm" render={<Link href="/workspaces/new" />}>
              <PlusIcon />
              New Workspace
            </Button>
          )}
          {canCreateAccount && (
            <Button
              size="sm"
              variant="outline"
              render={<Link href="/accounts/new" />}
            >
              <PlusIcon />
              New Account
            </Button>
          )}
          {canCreateRole && (
            <Button
              size="sm"
              variant="outline"
              render={<Link href="/roles/new" />}
            >
              <PlusIcon />
              New Role
            </Button>
          )}
        </div>
      </div>

      {error && (
        <Alert variant="error">
          <AlertTitle>Failed to load dashboard</AlertTitle>
          <AlertDescription>
            {isNetworkError(error)
              ? "Unable to connect to the OxideAuth API. Please check your connection and try again."
              : error instanceof Error
                ? error.message
                : "Request failed"}
          </AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-2 rounded-xl border p-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-16" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Workspaces"
            value={values.workspaces}
            icon={<Building2Icon className="size-4" />}
            href="/workspaces"
          />
          <MetricCard
            title="Accounts"
            value={values.accounts}
            icon={<UsersIcon className="size-4" />}
            href="/accounts"
          />
          <MetricCard
            title="Projects"
            value={values.projects}
            icon={<FolderKanbanIcon className="size-4" />}
            href="/projects"
          />
          <MetricCard
            title="Roles"
            value={values.roles}
            icon={<ShieldIcon className="size-4" />}
            href="/roles"
          />
          <MetricCard
            title="Permissions"
            value={values.permissions}
            icon={<KeyIcon className="size-4" />}
            href="/permissions"
          />
          <MetricCard
            title="Memberships"
            value={values.memberships}
            icon={<UserCheckIcon className="size-4" />}
            href="/memberships"
          />
          <MetricCard
            title="Credentials"
            value={values.credentials}
            icon={<FingerprintIcon className="size-4" />}
            href="/credentials"
          />
        </div>
      )}

      {!isLoading && !counts && !error && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2Icon className="size-4 animate-spin" />
          Waiting for a workspace to be selected…
        </div>
      )}
    </div>
  );
}
