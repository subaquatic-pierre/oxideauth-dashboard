"use client";

import { useMemo, useState } from "react";
import { useProfiles } from "@/hooks/use-profiles";
import { ProfileTable } from "@/components/profiles/profile-table";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { isNetworkError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { UsersIcon } from "lucide-react";
import type { ProfileListParams } from "@/types/profile";

export default function ProfilesPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const filters = useMemo<ProfileListParams | undefined>(() => {
    const next: ProfileListParams = {};
    if (email.trim()) next.email = email.trim();
    if (name.trim()) next.name = name.trim();
    if (Object.keys(next).length === 0) return undefined;
    return next;
  }, [email, name]);

  const { data, error, isLoading } = useProfiles(filters);
  const profiles = data ?? [];

  const hasFilters = Boolean(email.trim() || name.trim());

  function clearFilters() {
    setEmail("");
    setName("");
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Text variant="h2">Profiles</Text>
        <Alert variant="error">
          <AlertTitle>Failed to load profiles</AlertTitle>
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
      <div className="flex items-center justify-between">
        <div>
          <Text variant="h2">Profiles</Text>
          <Text variant="muted">
            {isLoading
              ? "Loading..."
              : `${profiles.length} profile${profiles.length !== 1 ? "s" : ""} in this workspace`}
          </Text>
        </div>
      </div>

      <div className="grid gap-3 rounded-lg border bg-card p-3 sm:grid-cols-2">
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
      </div>

      {!isLoading && profiles.length === 0 && hasFilters ? (
        <div className="rounded-lg border border-dashed py-12 text-center">
          <p className="text-sm text-muted-foreground">
            No profiles match your filters.
          </p>
          <Button variant="outline" className="mt-3" onClick={clearFilters}>
            Clear filters
          </Button>
        </div>
      ) : !isLoading && profiles.length === 0 ? (
        <Card className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <UsersIcon className="size-10 text-muted-foreground/40" />
          <div>
            <Text variant="h3">No profiles yet</Text>
            <Text variant="muted" className="mt-2">
              Add a member via Memberships to create a profile.
            </Text>
          </div>
        </Card>
      ) : (
        <ProfileTable profiles={profiles} isLoading={isLoading} />
      )}
    </div>
  );
}
