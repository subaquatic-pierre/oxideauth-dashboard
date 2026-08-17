"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { useGuestMode } from "@/hooks/use-guest-mode";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { WorkspaceSelector } from "@/components/workspace-selector";
import { WorkspaceDescribeRes } from "@/types/workspace";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isLoggingIn, loginError } = useAuth();
  const { enterGuestMode } = useGuestMode();
  const [email, setEmail] = useState("user@email.com");
  const [password, setPassword] = useState("password");
  const [workspace, setWorkspace] = useState<WorkspaceDescribeRes | null>(null);

  const registered = searchParams.get("registered") === "1";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (workspace) {
        await login(email, password, workspace.id);
      }
      router.push("/");
    } catch {
      // error is exposed via loginError
    }
  }

  function handleGuestAccess() {
    enterGuestMode();
    router.push("/");
  }

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl">Sign in</CardTitle>
        <CardDescription>Enter your credentials to continue</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {registered && (
            <div className="rounded-lg border border-profit/20 bg-profit/5 px-3 py-2 text-sm text-profit">
              Account created successfully. Please sign in.
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              className="h-10"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-10"
            />
          </div>
          {loginError && (
            <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2">
              <p className="text-sm text-destructive">{loginError}</p>
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="password">Workspace</Label>
            <div className="h-10">
              <WorkspaceSelector onWorkspaceChange={(ws) => setWorkspace(ws)} />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={isLoggingIn}>
            {isLoggingIn ? "Signing in..." : "Sign in"}
          </Button>
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Register
            </Link>
          </p>
          <Separator />
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGuestAccess}
          >
            Continue as Guest
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <Card>
          <CardContent className="flex items-center justify-center py-16">
            <div className="size-6 animate-spin rounded-full border-4 border-muted border-t-primary" />
          </CardContent>
        </Card>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
