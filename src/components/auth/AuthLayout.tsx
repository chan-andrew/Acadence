"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}

export function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Soft ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60rem 40rem at 50% -10%, rgba(0,51,255,0.08), transparent 60%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35] dark:opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, var(--border) 1px, transparent 0)",
          backgroundSize: "22px 22px",
          maskImage:
            "radial-gradient(ellipse at center, black 35%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 35%, transparent 75%)",
        }}
      />

      <div className="relative z-10 flex min-h-screen flex-col">
        {/* Top bar */}
        <header className="px-6 py-3">
          <div className="mx-auto flex max-w-5xl items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-secondary transition-colors hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4" />
              Home
            </Link>
            <Link
              href="/"
              className="text-base font-semibold tracking-tight text-primary"
            >
              Acadence
            </Link>
          </div>
        </header>

        {/* Card */}
        <main className="flex flex-1 items-center justify-center px-6 pb-6 pt-2">
          <div className="w-full max-w-md animate-scale-in">
            <div className="rounded-2xl border border-border bg-surface/95 px-6 py-6 shadow-lg backdrop-blur-sm sm:px-8 sm:py-7">
              <div className="mb-5 text-center">
                <h1 className="text-xl font-semibold tracking-tight text-primary sm:text-2xl">
                  {title}
                </h1>
                <p className="mt-1.5 text-sm leading-snug text-secondary">
                  {subtitle}
                </p>
              </div>

              {children}
            </div>

            <p className="mt-4 text-center text-sm text-secondary">{footer}</p>
          </div>
        </main>
      </div>
    </div>
  );
}
