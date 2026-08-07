"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Account } from "@/types/account";
import { useDeleteAccount, useUpdateAccount } from "@/hooks/use-accounts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EyeIcon, EditIcon, TrashIcon, UsersIcon } from "lucide-react";

function VerifiedBadge({ verified }: { verified: boolean }) {
  return verified ? (
    <Badge variant="outline" className="border-profit/30 text-profit">
      Verified
    </Badge>
  ) : (
    <Badge variant="outline" className="text-muted-foreground">
      Unverified
    </Badge>
  );
}

function EnabledSwitch({ account }: { account: Account }) {
  const update = useUpdateAccount(account.id);
  const [checked, setChecked] = useState(account.enabled);
  return (
    <Switch
      checked={checked}
      disabled={update.isMutating}
      aria-label={`Toggle ${account.name} enabled`}
      onCheckedChange={(next) => {
        setChecked(next);
        update
          .trigger({ enabled: next })
          .catch(() => setChecked(account.enabled));
      }}
    />
  );
}

interface AccountTableProps {
  accounts?: Account[];
  isLoading?: boolean;
}

export function AccountTable({
  accounts = [],
  isLoading,
}: AccountTableProps) {
  const router = useRouter();
  const deleteAccount = useDeleteAccount();

  async function handleDelete(account: Account) {
    if (
      !confirm(
        `Delete account "${account.name}" (${account.email})? This cannot be undone.`,
      )
    )
      return;
    await deleteAccount.trigger(account.id);
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (accounts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border py-16">
        <UsersIcon className="mb-4 size-12 text-muted-foreground/30" />
        <p className="text-muted-foreground">No accounts found.</p>
        <p className="mt-1 text-xs text-muted-foreground/60">
          Create an account to get started.
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Email</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Verified</TableHead>
          <TableHead>Enabled</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {accounts.map((account) => (
          <TableRow key={account.id}>
            <TableCell>
              <button
                type="button"
                onClick={() => router.push(`/accounts/${account.id}`)}
                className="font-medium hover:underline"
              >
                {account.email}
              </button>
            </TableCell>
            <TableCell>{account.name}</TableCell>
            <TableCell>
              <VerifiedBadge verified={account.verified} />
            </TableCell>
            <TableCell>
              <EnabledSwitch account={account} />
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  title="View"
                  onClick={() => router.push(`/accounts/${account.id}`)}
                >
                  <EyeIcon className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  title="Edit"
                  onClick={() => router.push(`/accounts/${account.id}/edit`)}
                >
                  <EditIcon className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  title="Delete"
                  className="text-loss hover:text-loss"
                  onClick={() => handleDelete(account)}
                  disabled={deleteAccount.isMutating}
                >
                  <TrashIcon className="size-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
