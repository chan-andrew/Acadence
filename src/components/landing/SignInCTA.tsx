"use client";

import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import clsx from "clsx";

interface SignInCTAProps {
  variant: "nav" | "hero" | "footer";
  label: string;
}

export function SignInCTA({ variant, label }: SignInCTAProps) {
  const { status } = useSession();
  const authenticated = status === "authenticated";

  const handleClick = () => {
    if (!authenticated) {
      signIn("google", { callbackUrl: "/dashboard" });
    }
  };

  if (variant === "nav") {
    const className =
      "text-sm text-secondary hover:text-primary transition-colors";
    return authenticated ? (
      <Link href="/dashboard" className={className}>
        {label}
      </Link>
    ) : (
      <button onClick={handleClick} className={className}>
        {label}
      </button>
    );
  }

  if (variant === "footer") {
    const className =
      "text-xs text-secondary hover:text-primary transition-colors";
    return authenticated ? (
      <Link href="/dashboard" className={className}>
        {label}
      </Link>
    ) : (
      <button onClick={handleClick} className={className}>
        {label}
      </button>
    );
  }

  const heroClass = clsx(
    "inline-flex items-center gap-2 mt-8 px-6 py-3 bg-accent text-white rounded-lg font-medium hover:bg-accent-hover transition-colors duration-150"
  );
  return authenticated ? (
    <Link href="/dashboard" className={heroClass}>
      {label}
      <ArrowRight className="w-4 h-4" />
    </Link>
  ) : (
    <button onClick={handleClick} className={heroClass}>
      {label}
      <ArrowRight className="w-4 h-4" />
    </button>
  );
}
