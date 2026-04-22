"use client";

import { signOut, useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { LogOut, Settings as SettingsIcon } from "lucide-react";

export function UserMenu() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!session?.user) return null;

  const initial = (session.user.name ?? session.user.email ?? "?")
    .slice(0, 1)
    .toUpperCase();

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex items-center rounded-full hover:opacity-80 transition-opacity"
        aria-label="Open user menu"
        aria-expanded={open}
      >
        {session.user.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={session.user.image}
            alt={session.user.name ?? "User"}
            className="w-7 h-7 rounded-full"
          />
        ) : (
          <div className="w-7 h-7 rounded-full bg-accent-soft text-accent text-xs font-medium flex items-center justify-center">
            {initial}
          </div>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-surface border border-border rounded-xl shadow-lg overflow-hidden z-40 animate-scale-in">
          <div className="px-3 py-2.5 border-b border-border">
            {session.user.name && (
              <p className="text-sm font-medium text-primary truncate">
                {session.user.name}
              </p>
            )}
            {session.user.email && (
              <p className="text-xs text-secondary truncate">{session.user.email}</p>
            )}
          </div>
          <Link
            href="/settings"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-3 py-2 text-sm text-primary hover:bg-background transition-colors"
          >
            <SettingsIcon className="w-4 h-4 text-secondary" />
            Settings
          </Link>
          <button
            onClick={() => {
              setOpen(false);
              signOut({ callbackUrl: "/" });
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-primary hover:bg-background transition-colors text-left"
          >
            <LogOut className="w-4 h-4 text-secondary" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
