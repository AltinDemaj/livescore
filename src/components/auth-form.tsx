"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Zap } from "lucide-react";
import Link from "next/link";

interface AuthFormProps {
  mode: "sign-in" | "sign-up";
  onSubmit: (email: string, password: string) => Promise<{ error: { message: string } | null }>;
}

export function AuthForm({ mode, onSubmit }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await onSubmit(email, password);

    if (result.error) {
      setError(result.error.message);
    } else if (mode === "sign-up") {
      setSuccess(true);
    }

    setLoading(false);
  };

  if (success) {
    return (
      <div className="text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mx-auto">
          <Zap className="h-6 w-6 text-primary" />
        </div>
        <h2 className="text-lg font-semibold">Check your email</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          We&apos;ve sent you a confirmation link to <strong>{email}</strong>.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary mx-auto">
          <Zap className="h-6 w-6 text-primary-foreground" />
        </div>
        <h1 className="text-xl font-bold">
          {mode === "sign-in" ? "Welcome back" : "Create account"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {mode === "sign-in"
            ? "Sign in to access your favorites"
            : "Sign up to save your favorite teams"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-11 bg-card"
          />
        </div>
        <div>
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="h-11 bg-card"
          />
        </div>

        {error && (
          <div className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">
            {error}
          </div>
        )}

        <Button type="submit" className="w-full h-11" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {mode === "sign-in" ? "Sign In" : "Sign Up"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {mode === "sign-in" ? (
          <>
            Don&apos;t have an account?{" "}
            <Link href="/auth/sign-up" className="font-medium text-primary hover:underline">
              Sign up
            </Link>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <Link href="/auth/sign-in" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
