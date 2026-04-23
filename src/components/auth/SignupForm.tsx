"use client";

import { FormEvent, useMemo, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { AtSign, Eye, EyeOff, Loader2, Lock, Mail, User } from "lucide-react";
import { AuthInput } from "./AuthInput";

export function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [firstName, setFirstName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pwScore = useMemo(() => {
    let s = 0;
    if (password.length >= 8) s++;
    if (password.length >= 12) s++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) s++;
    if (/\d/.test(password) && /[^A-Za-z0-9]/.test(password)) s++;
    return s;
  }, [password]);

  const canSubmit =
    firstName.trim().length > 0 &&
    username.trim().length >= 3 &&
    email.trim().length > 0 &&
    password.length >= 8;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (loading || !canSubmit) return;

    setError(null);
    setLoading(true);

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: firstName.trim(),
        username: username.trim(),
        email: email.trim(),
        password,
      }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data?.error || "Could not create your account.");
      setLoading(false);
      return;
    }

    const signInRes = await signIn("credentials", {
      identifier: email.trim(),
      password,
      redirect: false,
      callbackUrl,
    });

    setLoading(false);

    if (!signInRes || signInRes.error) {
      setError("Account created. Please sign in.");
      router.push("/login");
      return;
    }

    router.push(signInRes.url || callbackUrl);
    router.refresh();
  };

  return (
    <form onSubmit={onSubmit} className="space-y-3" noValidate>
      <AuthInput
        name="firstName"
        type="text"
        autoComplete="given-name"
        label="First name"
        placeholder="Andrew"
        icon={<User className="h-4 w-4" />}
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        required
        maxLength={50}
      />

      <AuthInput
        name="username"
        type="text"
        autoComplete="username"
        label="Username"
        placeholder="andrew"
        icon={<AtSign className="h-4 w-4" />}
        value={username}
        onChange={(e) => setUsername(e.target.value.replace(/\s/g, ""))}
        required
        minLength={3}
        maxLength={20}
      />

      <AuthInput
        name="email"
        type="email"
        autoComplete="email"
        label="Email"
        placeholder="you@university.edu"
        icon={<Mail className="h-4 w-4" />}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <div>
        <AuthInput
          name="password"
          type={showPw ? "text" : "password"}
          autoComplete="new-password"
          label="Password"
          placeholder="At least 8 characters"
          icon={<Lock className="h-4 w-4" />}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
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
        {password.length > 0 && (
          <div className="mt-1.5 flex items-center gap-1">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`h-0.5 flex-1 rounded-full transition-colors duration-200 ${
                  i < pwScore
                    ? pwScore <= 1
                      ? "bg-danger"
                      : pwScore === 2
                        ? "bg-amber-500"
                        : "bg-success"
                    : "bg-border"
                }`}
              />
            ))}
          </div>
        )}
      </div>

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
        disabled={loading || !canSubmit}
        className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-accent text-sm font-medium text-white shadow-sm transition-colors duration-150 hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Creating account…
          </>
        ) : (
          "Create account"
        )}
      </button>
    </form>
  );
}
