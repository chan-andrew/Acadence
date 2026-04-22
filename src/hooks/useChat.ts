"use client";

import { useState, useCallback } from "react";
import { ChatMessage, SectionWithProfessor } from "@/types";
import { useTerm } from "@/hooks/useTerm";

export interface SendMessageResult {
  courses: SectionWithProfessor[];
  intent: "search" | "add" | "remove" | "info" | "general";
  recommendedId: string | null;
}

export function useChat() {
  const { term } = useTerm();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [aiEnabled, setAiEnabled] = useState(true);

  const appendAssistantMessage = useCallback((content: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        role: "assistant",
        content,
        timestamp: new Date(),
      },
    ]);
  }, []);

  const sendMessage = useCallback(
    async (
      content: string,
      currentSchedule: string[]
    ): Promise<SendMessageResult> => {
      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: content, currentSchedule, term }),
        });

        if (!res.ok) throw new Error("Failed to send message");

        const data = await res.json();
        setAiEnabled(data.aiEnabled);

        const assistantMessage: ChatMessage = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: data.response,
          courses: data.courses,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);

        return {
          courses: data.courses || [],
          intent: data.intent || "search",
          recommendedId: data.recommendedId ?? null,
        };
      } catch {
        const errorMessage: ChatMessage = {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            "Sorry, I had trouble processing that. Please try again.",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
        return { courses: [], intent: "search", recommendedId: null };
      } finally {
        setIsLoading(false);
      }
    },
    [term]
  );

  return {
    messages,
    isLoading,
    sendMessage,
    appendAssistantMessage,
    aiEnabled,
  };
}
