"use client";

import { ChatMessage, SectionWithProfessor } from "@/types";
import { CourseList } from "@/components/course/CourseList";
import clsx from "clsx";

interface MessageBubbleProps {
  message: ChatMessage;
  addedIds: Set<string>;
  onAddCourse: (section: SectionWithProfessor) => void;
}

export function MessageBubble({ message, addedIds, onAddCourse }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={clsx(
        "animate-slide-up",
        isUser ? "flex justify-end" : "flex justify-start"
      )}
    >
      <div
        className={clsx(
          "max-w-[90%]",
          isUser
            ? "bg-surface border border-border rounded-2xl rounded-br-md px-4 py-2.5"
            : ""
        )}
      >
        <p className={clsx("text-sm leading-relaxed", isUser ? "text-primary" : "text-primary")}>
          {message.content}
        </p>
        {message.courses && message.courses.length > 0 && (
          <CourseList
            sections={message.courses}
            addedIds={addedIds}
            onAdd={onAddCourse}
          />
        )}
      </div>
    </div>
  );
}
