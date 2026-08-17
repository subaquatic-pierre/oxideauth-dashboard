"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useProfile } from "@/hooks/use-profiles";
import { useTheme } from "@/components/providers/theme-provider";
import { Text } from "@/components/ui/text";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SunIcon, MoonIcon, MonitorIcon } from "lucide-react";

const themeOptions = [
  { value: "light", label: "Light", icon: SunIcon },
  { value: "dark", label: "Dark", icon: MoonIcon },
  { value: "system", label: "System", icon: MonitorIcon },
] as const;

function getInitials(name?: string): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (
    parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
  ).toUpperCase();
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg bg-muted/50 px-4 py-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="min-w-0 truncate text-sm font-medium">{value ?? "—"}</span>
    </div>
  );
}

export default function SettingsPage() {
  const { user } = useAuth();
  const { data: profile } = useProfile(user?.email ?? null);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setMounted(true); }, []);

  return (
    <div className="space-y-6">
      <div>
        <Text variant="h2">Settings</Text>
        <Text variant="muted">Manage your dashboard preferences.</Text>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Your sign-in identity.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-4 rounded-lg bg-muted/50 px-4 py-3">
            <Avatar size="lg">
              {user?.avatar_url ? (
                <AvatarImage src={user.avatar_url} alt={user.name} />
              ) : null}
              <AvatarFallback className="text-sm font-medium">
                {getInitials(user?.name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="font-medium">{user?.name ?? "-"}</p>
              <p className="text-sm text-muted-foreground">
                {user?.email ?? "-"}
              </p>
            </div>
          </div>
          <DetailRow label="Name" value={user?.name} />
          <DetailRow label="Email" value={user?.email} />
          <DetailRow
            label="Status"
            value={
              <span className="flex items-center gap-2">
                <Badge variant={user?.verified ? "default" : "outline"}>
                  {user?.verified ? "Verified" : "Unverified"}
                </Badge>
                <Badge variant={user?.enabled ? "default" : "outline"}>
                  {user?.enabled ? "Enabled" : "Disabled"}
                </Badge>
              </span>
            }
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Workspace profile</CardTitle>
          <CardDescription>How you appear to others in this workspace.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-4 rounded-lg bg-muted/50 px-4 py-3">
            <Avatar size="lg">
              {profile?.avatar_url ? (
                <AvatarImage src={profile.avatar_url} alt={profile.name} />
              ) : null}
              <AvatarFallback className="text-sm font-medium">
                {getInitials(profile?.name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="font-medium">{profile?.name ?? "-"}</p>
              <p className="text-sm text-muted-foreground">
                {profile?.email ?? "-"}
              </p>
            </div>
          </div>
          <DetailRow label="Display name" value={profile?.display_name} />
          <DetailRow label="Job title" value={profile?.job_title} />
          <DetailRow label="Timezone" value={profile?.timezone} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>
            Choose how the dashboard looks for you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Theme</p>
              <p className="text-sm text-muted-foreground">
                Light, dark, or follow your system preference.
              </p>
            </div>
            <Select
              value={mounted ? theme : "system"}
              onValueChange={(v) => {
                if (v) setTheme(v as (typeof themeOptions)[number]["value"]);
              }}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {themeOptions.map(({ value, label, icon: Icon }) => (
                  <SelectItem key={value} value={value}>
                    <Icon className="size-4" />
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
