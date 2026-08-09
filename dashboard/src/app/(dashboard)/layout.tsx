"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useGuestMode } from "@/hooks/use-guest-mode";
import { isGuestMode } from "@/lib/guest-mode";
import { AUTH_EXPIRED_EVENT } from "@/lib/api";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isPending, isAuthenticated } = useAuth();
  const { isGuest } = useGuestMode();
  const router = useRouter();

  // Auth state comes from localStorage, which is unavailable during SSR.
  // Defer auth-conditional rendering until after mount so the server and
  // client render the same initial HTML (avoids hydration mismatch).
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    // Allow guest sessions to access dashboard; only redirect truly
    // unauthenticated users (no guest, no JWT) to the login page.
    if (!isPending && !isAuthenticated && !isGuest) {
      router.push("/login");
    }
  }, [isPending, isAuthenticated, isGuest, router]);

  // Session expiry: the API layer dispatches `auth:expired` on any 401.
  // Bounce the user to the login page — unless in guest mode.
  useEffect(() => {
    function handleAuthExpired() {
      if (!isGuestMode()) {
        router.push("/login");
      }
    }
    window.addEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired);
    return () => window.removeEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired);
  }, [router]);

  // Before mount, always render the empty shell so SSR and client match.
  // After mount, the auth-gated redirect in useEffect takes over if needed.
  if (!mounted) return null;

  if (isPending && !isGuest) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
      </div>
    );
  }

  if (!isAuthenticated && !isGuest) return null;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 overflow-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
