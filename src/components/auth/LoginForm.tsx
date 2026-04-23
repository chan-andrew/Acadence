"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { AtSign, Eye, EyeOff, Loader2, Lock } from "lucide-react";
import { AuthInput } from "./AuthInput";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setError(null);
    setLoading(true);

    const res = await signIn("credentials", {
      identifier: identifier.trim(),
      password,
      redirect: false,
      callbackUrl,
    });

    setLoading(false);

    if (!res || res.error) {
      setError("Incorrect email/username or password.");
      return;
    }

    router.push(res.url || callbackUrl);
    router.refresh();
  };

  return (
    <form onSubmit={onSubmit} className="space-y-3" noValidate>
      <AuthInput
        name="identifier"
        type="text"
        autoComplete="username"
        label="Email or username"
        placeholder="you@university.edu"
        icon={<AtSign className="h-4 w-4" />}
        value={identifier}
        onChange={(e) => setIdentifier(e.target.value)}
        required
      />

      <AuthInput
        name="password"
        type={showPw ? "text" : "password"}
        autoComplete="current-password"
        label="Password"
        placeholder="••••••••"
        icon={<Lock className="h-4 w-4" />}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        trailing={
          <button
            type="button"
            onClick={() => setShowPw((v) => !v)}
            className="flex h-8 w-8 items-center justify-center rounded-md text-tertiary transition-colors hover:text-secondary"
            aria-label={showPw ? "Hide password" : "Show password"}
            tabIndex={-1}
          >
            {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        }
      />

      {error && (
        <p
          role="alert"
          className="rounded-md border border-danger/30 bg-danger/5 px-3 py-2 text-xs text-danger"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading || !identifier.trim() || !password}
        className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-accent text-sm font-medium text-white shadow-sm transition-colors duration-150 hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Signing in…
          </>
        ) : (
          "Sign in"
        )}
      </button>
    </form>
  );
}
