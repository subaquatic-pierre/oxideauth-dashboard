"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAccounts } from "@/hooks/use-accounts";
import { useActiveWorkspaceId } from "@/hooks/use-active-workspace";
import { useCan } from "@/hooks/use-permissions-check";
import { AccountTable } from "@/components/accounts/account-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { isNetworkError } from "@/lib/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusIcon, UsersIcon } from "lucide-react";
import type { AccountListQuery } from "@/services";

export default function AccountsPage() {
  const router = useRouter();
  const workspaceId = useActiveWorkspaceId();

  // PERMISSION-GATED: Create requires `account:create`.
  const canCreate = useCan("account", "create");

  // Filters
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [verified, setVerified] = useState("all");
  const [enabled, setEnabled] = useState("all");

  const filters = useMemo<AccountListQuery | undefined>(() => {
    const fields: Record<string, unknown> = {};
    if (email.trim()) fields.email = email.trim();
    if (name.trim()) fields.name = name.trim();
    if (verified !== "all") fields.verified = verified === "true";
    if (enabled !== "all") fields.enabled = enabled === "true";
    if (Object.keys(fields).length === 0) return undefined;
    return {
      filter: { fields },
      options: { limit: 100, order_bys: "!created_at" },
    };
  }, [email, name, verified, enabled]);

  const { data, error, isLoading } = useAccounts(workspaceId, filters);
  const accounts = data?.accounts ?? [];

  const hasFilters = Boolean(email.trim() || name.trim() || verified !== "all" || enabled !== "all");

  function clearFilters() {
    setEmail("");
    setName("");
    setVerified("all");
    setEnabled("all");
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Text variant="h2">Accounts</Text>
        <Alert variant="error">
          <AlertTitle>Failed to load accounts</AlertTitle>
          <AlertDescription>
            {isNetworkError(error)
              ? "Unable to connect to the OxideAuth API. Please check your connection and try again."
              : error instanceof Error
                ? error.message
                : "Please try again."}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Text variant="h2">Accounts</Text>
          <Text variant="muted">
            {isLoading
              ? "Loading..."
              : error
                ? "Failed to load accounts"
                : `${accounts.length} account${accounts.length !== 1 ? "s" : ""} in this workspace`}
          </Text>
        </div>
        {canCreate && (
          <Button onClick={() => router.push("/accounts/new")}>
            <PlusIcon className="mr-2 size-4" />
            Create Account
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="grid gap-3 rounded-lg border bg-card p-3 sm:grid-cols-2 lg:grid-cols-4">
        <Input
          placeholder="Filter by email..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-label="Filter by email"
        />
        <Input
          placeholder="Filter by name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-label="Filter by name"
        />
        <Select
          value={verified}
          onValueChange={(v) => {
            if (v) setVerified(v);
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Verified" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any verification</SelectItem>
            <SelectItem value="true">Verified</SelectItem>
            <SelectItem value="false">Unverified</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={enabled}
          onValueChange={(v) => {
            if (v) setEnabled(v);
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Enabled" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any status</SelectItem>
            <SelectItem value="true">Enabled</SelectItem>
            <SelectItem value="false">Disabled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Empty / no-results states */}
      {!isLoading && accounts.length === 0 && hasFilters ? (
        <div className="rounded-lg border border-dashed py-12 text-center">
          <p className="text-sm text-muted-foreground">
            No accounts match your filters.
          </p>
          <Button variant="outline" className="mt-3" onClick={clearFilters}>
            Clear filters
          </Button>
        </div>
      ) : !isLoading && accounts.length === 0 ? (
        <Card className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <UsersIcon className="size-10 text-muted-foreground/40" />
          <div>
            <Text variant="h3">No accounts yet</Text>
            <Text variant="muted" className="mt-2">
              Create your first account to get started.
            </Text>
          </div>
          {canCreate && (
            <Button onClick={() => router.push("/accounts/new")}>
              <PlusIcon />
              Create Account
            </Button>
          )}
        </Card>
      ) : (
        <AccountTable accounts={accounts} isLoading={isLoading} />
      )}
    </div>
  );
}
