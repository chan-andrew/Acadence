"use client";

import { useSession } from "next-auth/react";
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

  // "Get started" implies new user → signup; everything else → login.
  const unauthHref = label.toLowerCase().includes("get started")
    ? "/signup"
    : "/login";
  const href = authenticated ? "/dashboard" : unauthHref;

  if (variant === "nav") {
    return (
      <Link
        href={href}
        className="text-sm text-secondary transition-colors hover:text-primary"
      >
        {label}
      </Link>
    );
  }

  if (variant === "footer") {
    return (
      <Link
        href={href}
        className="text-xs text-secondary transition-colors hover:text-primary"
      >
        {label}
      </Link>
    );
  }

  const heroClass = clsx(
    "inline-flex items-center gap-2 mt-8 px-6 py-3 bg-accent text-white rounded-lg font-medium hover:bg-accent-hover transition-colors duration-150"
  );

  return (
    <Link href={href} className={heroClass}>
      {label}
      <ArrowRight className="w-4 h-4" />
    </Link>
  );
}
