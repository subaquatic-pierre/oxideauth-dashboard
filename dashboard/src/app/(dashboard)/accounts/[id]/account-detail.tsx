"use client";

import { useParams, useRouter } from "next/navigation";
import { useAccount, useDeleteAccount } from "@/hooks/use-accounts";
import { useActiveWorkspaceId } from "@/hooks/use-active-workspace";
import { useCan } from "@/hooks/use-permissions-check";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDateTime } from "@/lib/format";
import {
  ArrowLeftIcon,
  EditIcon,
  TrashIcon,
  MailIcon,
  IdCardIcon,
  FingerprintIcon,
  CalendarIcon,
} from "lucide-react";

function getInitials(name?: string): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg bg-muted/50 px-4 py-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="min-w-0 truncate text-sm font-medium">{value ?? "-"}</span>
    </div>
  );
}

export default function AccountDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const workspaceId = useActiveWorkspaceId();
  const { data: account, isLoading, error } = useAccount(id);
  const deleteAccount = useDeleteAccount();

  // PERMISSION-GATED: Edit requires `account:update`, Delete requires `account:delete`.
  const canEdit = useCan("account", "update");
  const canDelete = useCan("account", "delete");

  async function handleDelete() {
    if (!account) return;
    if (
      !confirm(
        `Delete account "${account.name}" (${account.email})? This cannot be undone.`,
      )
    )
      return;
    await deleteAccount.trigger(account.id);
    router.push("/accounts");
  }

  if (isLoading || (workspaceId && !account && !error)) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  if (error || !account) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/accounts")}
          >
            <ArrowLeftIcon className="size-4" />
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">
            Account not found
          </h1>
        </div>
        <p className="text-muted-foreground">
          The account you&apos;re looking for doesn&apos;t exist or has been
          deleted.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/accounts")}
          >
            <ArrowLeftIcon className="size-4" />
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">{account.name}</h1>
          <div className="flex items-center gap-1.5">
            <Badge
              variant="outline"
              className={
                account.verified
                  ? "border-profit/30 text-profit"
                  : "text-muted-foreground"
              }
            >
              {account.verified ? "Verified" : "Unverified"}
            </Badge>
            <Badge
              variant="outline"
              className={
                account.enabled
                  ? "border-profit/30 text-profit"
                  : "text-muted-foreground"
              }
            >
              {account.enabled ? "Enabled" : "Disabled"}
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {canEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/accounts/${id}/edit`)}
            >
              <EditIcon className="mr-2 size-4" />
              Edit
            </Button>
          )}
          {canDelete && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={deleteAccount.isMutating}
            >
              <TrashIcon className="mr-2 size-4" />
              Delete
            </Button>
          )}
        </div>
      </div>

      {/* Profile card */}
      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Overview of this account.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-4 rounded-lg bg-muted/50 px-4 py-3">
            <Avatar size="lg">
              {account.avatar_url ? (
                <AvatarImage src={account.avatar_url} alt={account.name} />
              ) : null}
              <AvatarFallback className="text-sm font-medium">
                {getInitials(account.name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="font-medium">{account.name}</p>
              <p className="text-sm text-muted-foreground">{account.email}</p>
            </div>
          </div>
          {account.description && (
            <p className="text-sm text-muted-foreground">
              {account.description}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Details card */}
      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
          <CardDescription>Account properties and metadata.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <DetailRow
            label="ID"
            value={
              <span className="inline-flex items-center gap-1.5">
                <IdCardIcon className="size-3.5 text-muted-foreground" />
                <span className="font-mono text-xs">{account.id}</span>
              </span>
            }
          />
          <DetailRow
            label="Email"
            value={
              <span className="inline-flex items-center gap-1.5">
                <MailIcon className="size-3.5 text-muted-foreground" />
                {account.email}
              </span>
            }
          />
          <DetailRow label="Name" value={account.name} />
          <DetailRow
            label="Status"
            value={
              <span className="flex items-center gap-1.5">
                <Badge
                  variant="outline"
                  className={
                    account.verified
                      ? "border-profit/30 text-profit"
                      : "text-muted-foreground"
                  }
                >
                  {account.verified ? "Verified" : "Unverified"}
                </Badge>
                <Badge
                  variant="outline"
                  className={
                    account.enabled
                      ? "border-profit/30 text-profit"
                      : "text-muted-foreground"
                  }
                >
                  {account.enabled ? "Enabled" : "Disabled"}
                </Badge>
              </span>
            }
          />
          {account.avatar_url && (
            <DetailRow label="Avatar URL" value={account.avatar_url} />
          )}
          {account.tags && account.tags.length > 0 && (
            <DetailRow
              label="Tags"
              value={
                <span className="flex flex-wrap justify-end gap-1.5">
                  {account.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </span>
              }
            />
          )}
          <DetailRow
            label="Created at"
            value={
              <span className="inline-flex items-center gap-1.5">
                <CalendarIcon className="size-3.5 text-muted-foreground" />
                {account.created_at ? formatDateTime(account.created_at) : "-"}
              </span>
            }
          />
          <DetailRow
            label="Updated at"
            value={
              <span className="inline-flex items-center gap-1.5">
                <FingerprintIcon className="size-3.5 text-muted-foreground" />
                {account.updated_at ? formatDateTime(account.updated_at) : "-"}
              </span>
            }
          />
        </CardContent>
      </Card>
    </div>
  );
}
