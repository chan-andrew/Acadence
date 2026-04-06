"use client";

import { useState, useCallback } from "react";
import { ChatMessage, SectionWithProfessor } from "@/types";

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [aiEnabled, setAiEnabled] = useState(true);

  const sendMessage = useCallback(
    async (
      content: string,
      currentSchedule: string[]
    ): Promise<SectionWithProfessor[]> => {
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
          body: JSON.stringify({ message: content, currentSchedule }),
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

        return data.courses || [];
      } catch {
        const errorMessage: ChatMessage = {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            "Sorry, I had trouble processing that. Please try again.",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
        return [];
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { messages, isLoading, sendMessage, aiEnabled };
}
