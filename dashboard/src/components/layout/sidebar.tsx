"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useSidebar } from "@/components/layout/sidebar-provider";
import { useCan } from "@/hooks/use-permissions-check";
import { useGuestMode } from "@/hooks/use-guest-mode";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  ShieldIcon,
  LayoutDashboardIcon,
  Building2Icon,
  UsersIcon,
  FolderKanbanIcon,
  KeyIcon,
  UserCheckIcon,
  FingerprintIcon,
} from "lucide-react";

const resourceLinks = [
  {
    href: "/workspaces",
    label: "Workspaces",
    icon: Building2Icon,
    entity: "workspace",
  },
  { href: "/accounts", label: "Accounts", icon: UsersIcon, entity: "account" },
  {
    href: "/projects",
    label: "Projects",
    icon: FolderKanbanIcon,
    entity: "project",
  },
  { href: "/roles", label: "Roles", icon: ShieldIcon, entity: "role" },
  {
    href: "/permissions",
    label: "Permissions",
    icon: KeyIcon,
    entity: "permission",
  },
  {
    href: "/memberships",
    label: "Memberships",
    icon: UserCheckIcon,
    entity: "membership",
  },
  {
    href: "/credentials",
    label: "Credentials",
    icon: FingerprintIcon,
    entity: "credential",
  },
] as const;

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { collapsed } = useSidebar();
  const { isGuest } = useGuestMode();

  // PERMISSION-GATED: each resource section requires `{entity}:read`.
  // In guest mode, all links are always visible.
  const canRead = {
    workspace: useCan("workspace", "read"),
    account: useCan("account", "read"),
    project: useCan("project", "read"),
    role: useCan("role", "read"),
    permission: useCan("permission", "read"),
    membership: useCan("membership", "read"),
    credential: useCan("credential", "read"),
  };

  // Home / Profile / Settings are always visible; resource links are filtered
  // by the user's `{entity}:read` permissions — except in guest mode where
  // all links are shown for full UI exploration.
  const visibleLinks = isGuest
    ? resourceLinks
    : resourceLinks.filter((link) => canRead[link.entity]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const navButton = (link: {
    href: string;
    label: string;
    icon: typeof ShieldIcon;
  }) => {
    const active = isActive(link.href);
    return (
      <Button
        key={link.href}
        variant={active ? "secondary" : "ghost"}
        size={collapsed ? "icon" : "default"}
        className={cn(
          "w-full justify-start",
          collapsed && "justify-center",
          !active && "text-muted-foreground hover:text-foreground",
          active && "bg-sidebar-accent font-medium",
        )}
        onClick={() => router.push(link.href)}
      >
        <link.icon className={cn("size-4 shrink-0", !collapsed && "mr-3")} />
        {!collapsed && link.label}
      </Button>
    );
  };

  return (
    <aside
      className={cn(
        "hidden border-r bg-sidebar transition-all duration-300 lg:flex lg:flex-col",
        collapsed ? "w-16" : "w-60",
      )}
    >
      {/* Logo area */}
      <div
        className={cn(
          "flex h-14 items-center border-b px-4",
          collapsed && "justify-center px-2",
        )}
      >
        <Link href="/" className="flex items-center gap-2 font-semibold">
          {collapsed ? (
            <Image
              src="/logoIconText.png"
              alt="OxideAuth"
              width={28}
              height={28}
              className="size-7 rounded-lg"
            />
          ) : (
            <Image
              src="/logo.png"
              alt="OxideAuth"
              width={120}
              height={28}
              className="h-7 w-auto"
              priority
            />
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-3">
        {navButton({ href: "/", label: "Home", icon: LayoutDashboardIcon })}
        {visibleLinks.map(navButton)}

        {!collapsed && <Separator className="my-3" />}
      </nav>
    </aside>
  );
}
