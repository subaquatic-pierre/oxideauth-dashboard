import { ShieldIcon } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-muted/30 p-4">
      <div className="mb-8 flex items-center gap-2">
        <div className="flex size-9 items-center justify-center rounded-lg bg-brand text-primary-foreground">
          <ShieldIcon className="size-5" />
        </div>
        <span className="text-lg font-semibold">OxideAuth</span>
      </div>
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}
