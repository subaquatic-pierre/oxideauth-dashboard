"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCreateAccount } from "@/hooks/use-accounts";
import { useCan } from "@/hooks/use-permissions-check";
import { AccountForm } from "@/components/accounts/account-form";
import type { AccountFormData } from "@/types/account";

export default function NewAccountPage() {
  const router = useRouter();
  const createAccount = useCreateAccount();

  // PERMISSION-GATED: Accounts are system-admin only — redirect if no `account:read`.
  const canRead = useCan("account", "read");
  useEffect(() => {
    if (!canRead) router.replace("/");
  }, [canRead, router]);

  async function handleSubmit(data: AccountFormData) {
    const created = await createAccount.trigger(data);
    router.push(`/accounts/${created.id}`);
  }

  return (
    <AccountForm
      onSubmit={handleSubmit}
      isPending={createAccount.isMutating}
      error={createAccount.error}
    />
  );
}
