"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid credentials");
    } else {
      router.push("/");
      router.refresh();
    }
  }

  async function handleDemoLogin() {
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email: "demo@techintelligence.dev",
      password: "demo",
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Demo login failed");
    } else {
      router.push("/");
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-xl font-semibold text-text-primary mb-1">
            Tech Intelligence OS
          </h1>
          <p className="text-sm text-text-muted">
            Sign in to access your dashboard
          </p>
        </div>

        <div className="bg-glass-bg backdrop-blur-xl border border-glass-border rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-xs font-medium text-text-secondary"
              >
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="block text-xs font-medium text-text-secondary"
              >
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <p className="text-xs text-red-400">{error}</p>
            )}

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border-subtle" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-glass-bg px-2 text-xs text-text-muted">
                or
              </span>
            </div>
          </div>

          <Button
            variant="secondary"
            className="w-full"
            size="lg"
            onClick={handleDemoLogin}
            disabled={loading}
          >
            Use demo account
          </Button>
        </div>

        <p className="mt-5 text-center text-xs text-text-muted">
          Don&apos;t have an account?{" "}
          <span className="text-text-secondary hover:text-text-primary cursor-pointer transition-colors">
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}
