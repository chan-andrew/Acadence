"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { ChatMessage, SectionWithProfessor } from "@/types";
import { MessageBubble } from "./MessageBubble";
import { SuggestionChips } from "./SuggestionChips";
import { CourseCardSkeleton } from "@/components/ui/Skeleton";
import { ArrowUp, Loader2 } from "lucide-react";

interface ChatPanelProps {
  messages: ChatMessage[];
  isLoading: boolean;
  aiEnabled: boolean;
  addedIds: Set<string>;
  onSend: (message: string) => void;
  onAddCourse: (section: SectionWithProfessor) => void;
}

export function ChatPanel({
  messages,
  isLoading,
  aiEnabled,
  addedIds,
  onSend,
  onAddCourse,
}: ChatPanelProps) {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    function handleKeyDown(e: globalThis.KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === "/" && document.activeElement === document.body) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [input]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    onSend(trimmed);
    setInput("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full border-r border-border bg-background">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border">
        <h2 className="text-sm font-semibold text-primary">Course Assistant</h2>
        {!aiEnabled && (
          <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">
            AI features require an API key. Using basic search.
          </p>
        )}
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <p className="text-secondary text-sm">
              Ask me to find courses for your schedule.
            </p>
            <p className="text-tertiary text-xs mt-1">
              Try &quot;find morning CS classes&quot; or &quot;humanities electives MWF&quot;
            </p>
          </div>
        )}
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            addedIds={addedIds}
            onAddCourse={onAddCourse}
          />
        ))}
        {isLoading && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-secondary">
              <Loader2 className="w-4 h-4 animate-spin" />
              Searching courses...
            </div>
            <CourseCardSkeleton />
            <CourseCardSkeleton />
          </div>
        )}
      </div>

      {/* Suggestions */}
      <SuggestionChips
        onSelect={(q) => onSend(q)}
        visible={messages.length === 0}
      />

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-2 bg-surface border border-border rounded-xl px-3 py-2 focus-within:border-accent transition-colors duration-150">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about courses..."
            rows={1}
            className="flex-1 bg-transparent text-sm text-primary placeholder:text-tertiary resize-none outline-none max-h-24"
            style={{ minHeight: "20px" }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="p-1.5 rounded-lg bg-accent text-white hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150 shrink-0"
            aria-label="Send message"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ArrowUp className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
