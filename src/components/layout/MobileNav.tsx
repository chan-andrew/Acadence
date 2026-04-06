"use client";

import { MessageSquare, CalendarDays, BookOpen } from "lucide-react";
import clsx from "clsx";

interface MobileNavProps {
  activeView: "chat" | "browse" | "calendar";
  onToggle: (view: "chat" | "browse" | "calendar") => void;
}

export function MobileNav({ activeView, onToggle }: MobileNavProps) {
  return (
    <div className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-40">
      <div className="flex items-center gap-1 bg-surface border border-border rounded-full p-1 shadow-lg">
        <button
          onClick={() => onToggle("chat")}
          className={clsx(
            "flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-colors duration-150",
            activeView === "chat"
              ? "bg-accent text-white"
              : "text-secondary hover:text-primary"
          )}
        >
          <MessageSquare className="w-4 h-4" />
          Chat
        </button>
        <button
          onClick={() => onToggle("browse")}
          className={clsx(
            "flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-colors duration-150",
            activeView === "browse"
              ? "bg-accent text-white"
              : "text-secondary hover:text-primary"
          )}
        >
          <BookOpen className="w-4 h-4" />
          Browse
        </button>
        <button
          onClick={() => onToggle("calendar")}
          className={clsx(
            "flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-colors duration-150",
            activeView === "calendar"
              ? "bg-accent text-white"
              : "text-secondary hover:text-primary"
          )}
        >
          <CalendarDays className="w-4 h-4" />
          Calendar
        </button>
      </div>
    </div>
  );
}
