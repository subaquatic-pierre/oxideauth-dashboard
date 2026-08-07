"use client";

import { useRouter } from "next/navigation";
import { useCreateAccount } from "@/hooks/use-accounts";
import { AccountForm } from "@/components/accounts/account-form";
import type { AccountFormData } from "@/types/account";

export default function NewAccountPage() {
  const router = useRouter();
  const createAccount = useCreateAccount();

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
