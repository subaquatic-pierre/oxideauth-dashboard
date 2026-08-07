"use client";

import { useParams, useRouter } from "next/navigation";
import { useAccount, useUpdateAccount } from "@/hooks/use-accounts";
import { useActiveWorkspaceId } from "@/hooks/use-active-workspace";
import { AccountForm } from "@/components/accounts/account-form";
import { Skeleton } from "@/components/ui/skeleton";
import type { AccountFormData } from "@/types/account";

export default function EditAccountPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const workspaceId = useActiveWorkspaceId();
  const { data: account, isLoading, error } = useAccount(workspaceId, id);
  const updateAccount = useUpdateAccount(id);

  async function handleSubmit(data: AccountFormData) {
    await updateAccount.trigger(data);
    router.push(`/accounts/${id}`);
  }

  if (isLoading || (workspaceId && !account && !error)) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (error || !account) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Account not found</h1>
        <p className="text-muted-foreground">
          The account you&apos;re looking for doesn&apos;t exist or has been
          deleted.
        </p>
      </div>
    );
  }

  return (
    <AccountForm
      account={account}
      onSubmit={handleSubmit}
      isPending={updateAccount.isMutating}
      error={updateAccount.error}
    />
  );
}
