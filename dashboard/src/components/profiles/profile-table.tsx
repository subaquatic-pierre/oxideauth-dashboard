"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EyeIcon, PencilIcon, UsersIcon } from "lucide-react";
import type { Profile } from "@/types/profile";

interface ProfileTableProps {
  profiles?: Profile[];
  isLoading?: boolean;
}

export function ProfileTable({ profiles = [], isLoading }: ProfileTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (profiles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border py-16">
        <UsersIcon className="mb-4 size-12 text-muted-foreground/30" />
        <p className="text-muted-foreground">No profiles found.</p>
        <p className="mt-1 text-xs text-muted-foreground/60">
          Add a member via Memberships to create a profile.
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Display name</TableHead>
          <TableHead>Job title</TableHead>
          <TableHead>Email</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {profiles.map((profile) => (
          <TableRow key={profile.id}>
            <TableCell>
              <Link
                href={`/profiles/${profile.id}`}
                className="font-medium hover:underline"
              >
                {profile.name}
              </Link>
            </TableCell>
            <TableCell>{profile.display_name ?? "—"}</TableCell>
            <TableCell>{profile.job_title ?? "—"}</TableCell>
            <TableCell>{profile.email}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  title="View"
                  render={<Link href={`/profiles/${profile.id}`} />}
                >
                  <EyeIcon className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  title="Edit"
                  render={<Link href={`/profiles/${profile.id}/edit`} />}
                >
                  <PencilIcon className="size-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
