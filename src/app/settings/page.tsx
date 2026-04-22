"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { ArrowLeft, Moon, Sun } from "lucide-react";
import clsx from "clsx";
import { Header } from "@/components/layout/Header";
import { TermSelector } from "@/components/layout/TermSelector";
import { useTheme } from "@/hooks/useTheme";

export default function SettingsPage() {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();

  const name = session?.user?.name ?? "—";
  const email = session?.user?.email ?? "—";
  const image = session?.user?.image;

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      <Header />

      <div className="flex-1 overflow-auto">
        <div className="max-w-2xl mx-auto px-6 py-10">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs text-secondary hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to schedule
          </Link>

          <h1 className="text-2xl font-semibold text-primary tracking-tight">
            Settings
          </h1>
          <p className="text-sm text-secondary mt-1">
            Manage your account and how Acadence looks.
          </p>

          {/* Account */}
          <section className="mt-10">
            <h2 className="text-[11px] font-medium text-tertiary uppercase tracking-wider mb-3">
              Account
            </h2>
            <div className="flex items-center gap-4 p-4 bg-surface border border-border rounded-xl">
              {image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={image}
                  alt={name}
                  className="w-12 h-12 rounded-full"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-accent-soft text-accent text-sm font-medium flex items-center justify-center">
                  {name.slice(0, 1).toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <p className="text-sm font-medium text-primary truncate">{name}</p>
                <p className="text-xs text-secondary truncate">{email}</p>
              </div>
            </div>
            <p className="text-[11px] text-tertiary mt-2">
              Connected through Google. Sign out below to switch accounts.
            </p>
          </section>

          {/* Appearance */}
          <section className="mt-10">
            <h2 className="text-[11px] font-medium text-tertiary uppercase tracking-wider mb-3">
              Appearance
            </h2>
            <div className="p-4 bg-surface border border-border rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-primary">Theme</p>
                  <p className="text-xs text-secondary mt-0.5">
                    Choose how Acadence looks on this device.
                  </p>
                </div>
                <div className="flex items-center gap-1 p-1 bg-background border border-border rounded-lg">
                  <ThemeOption
                    label="Light"
                    icon={<Sun className="w-3.5 h-3.5" />}
                    active={theme === "light"}
                    onClick={() => setTheme("light")}
                  />
                  <ThemeOption
                    label="Dark"
                    icon={<Moon className="w-3.5 h-3.5" />}
                    active={theme === "dark"}
                    onClick={() => setTheme("dark")}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Schedule */}
          <section className="mt-10">
            <h2 className="text-[11px] font-medium text-tertiary uppercase tracking-wider mb-3">
              Schedule
            </h2>
            <div className="p-4 bg-surface border border-border rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-primary">Active term</p>
                  <p className="text-xs text-secondary mt-0.5">
                    Switch which semester your schedule applies to.
                  </p>
                </div>
                <TermSelector />
              </div>
            </div>
          </section>

          {/* Sign out */}
          <section className="mt-10 mb-16">
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
            >
              Sign out
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}

function ThemeOption({
  label,
  icon,
  active,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors",
        active
          ? "bg-surface text-primary shadow-sm"
          : "text-secondary hover:text-primary"
      )}
      aria-pressed={active}
    >
      {icon}
      {label}
    </button>
  );
}
