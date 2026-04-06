"use client";

import { useState, useCallback, useMemo } from "react";
import { SectionWithProfessor } from "@/types";
import { useChat } from "@/hooks/useChat";
import { useSchedule } from "@/hooks/useSchedule";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { CourseBrowser } from "@/components/course/CourseBrowser";
import { WeeklyCalendar } from "@/components/calendar/WeeklyCalendar";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { ToastContainer, useToast } from "@/components/ui/Toast";
import { formatDays, formatTimeRange } from "@/lib/utils/formatTime";
import { MessageSquare, BookOpen } from "lucide-react";
import clsx from "clsx";

type LeftPanel = "chat" | "browse";

export default function DashboardPage() {
  const { messages, isLoading, sendMessage, aiEnabled } = useChat();
  const { sections, conflicts, addSection, removeSection, totalCredits, sectionIds } =
    useSchedule();
  const { toasts, addToast, dismissToast } = useToast();
  const [mobileView, setMobileView] = useState<"chat" | "browse" | "calendar">("chat");
  const [leftPanel, setLeftPanel] = useState<LeftPanel>("chat");
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  const addedIds = useMemo(() => new Set(sectionIds), [sectionIds]);

  const conflictSectionIds = useMemo(() => {
    const ids = new Set<string>();
    conflicts.forEach((c) => {
      ids.add(c.existingSection.id);
      ids.add(c.newSection.id);
    });
    return ids;
  }, [conflicts]);

  const handleSend = useCallback(
    (message: string) => {
      sendMessage(message, sectionIds);
    },
    [sendMessage, sectionIds]
  );

  const handleAddCourse = useCallback(
    (section: SectionWithProfessor) => {
      const result = addSection(section);
      if (result.added) {
        addToast(`${section.course.code} added to schedule`, "success");
        if (result.conflicts.length > 0) {
          const conflict = result.conflicts[0];
          addToast(
            `Time conflict with ${conflict.existingSection.course.code} on ${formatDays(
              conflict.overlappingDays
            )}`,
            "warning"
          );
        }
      }
    },
    [addSection, addToast]
  );

  const handleSectionClick = useCallback(
    (sectionId: string) => {
      setSelectedSection(sectionId === selectedSection ? null : sectionId);
    },
    [selectedSection]
  );

  const selectedSectionData = selectedSection
    ? sections.find((s) => s.id === selectedSection)
    : null;

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      <Header totalCredits={totalCredits} conflictCount={conflicts.length} />

      <div className="flex-1 flex overflow-hidden relative">
        {/* Left panel: Chat or Browse */}
        <div
          className={clsx(
            "w-full md:w-[400px] md:flex md:flex-col shrink-0",
            mobileView === "calendar" ? "hidden md:flex" : "flex flex-col"
          )}
        >
          {/* Tab switcher */}
          <div className="flex border-b border-border bg-surface shrink-0">
            <button
              onClick={() => {
                setLeftPanel("chat");
                if (mobileView !== "calendar") setMobileView("chat");
              }}
              className={clsx(
                "flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors duration-150",
                leftPanel === "chat"
                  ? "text-accent border-b-2 border-accent"
                  : "text-secondary hover:text-primary"
              )}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              AI Chat
            </button>
            <button
              onClick={() => {
                setLeftPanel("browse");
                if (mobileView !== "calendar") setMobileView("browse");
              }}
              className={clsx(
                "flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors duration-150",
                leftPanel === "browse"
                  ? "text-accent border-b-2 border-accent"
                  : "text-secondary hover:text-primary"
              )}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Browse
            </button>
          </div>

          {/* Panel content */}
          <div className="flex-1 overflow-hidden">
            <div className={clsx("h-full", leftPanel === "chat" ? "block" : "hidden")}>
              <ChatPanel
                messages={messages}
                isLoading={isLoading}
                aiEnabled={aiEnabled}
                addedIds={addedIds}
                onSend={handleSend}
                onAddCourse={handleAddCourse}
              />
            </div>
            <div className={clsx("h-full", leftPanel === "browse" ? "block" : "hidden")}>
              <CourseBrowser addedIds={addedIds} onAdd={handleAddCourse} />
            </div>
          </div>
        </div>

        {/* Calendar */}
        <div
          className={clsx(
            "flex-1 flex flex-col overflow-hidden",
            mobileView === "calendar" ? "flex" : "hidden md:flex"
          )}
        >
          <WeeklyCalendar
            sections={sections}
            conflictSectionIds={conflictSectionIds}
            onSectionClick={handleSectionClick}
          />

          {/* Section detail popover */}
          {selectedSectionData && (
            <div className="absolute bottom-16 md:bottom-4 right-4 w-72 bg-surface border border-border rounded-xl shadow-lg p-4 z-30 animate-scale-in">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-mono font-bold text-sm">
                    {selectedSectionData.course.code}
                  </p>
                  <p className="text-sm text-primary">
                    {selectedSectionData.course.title}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedSection(null)}
                  className="text-tertiary hover:text-primary text-xs"
                >
                  Close
                </button>
              </div>
              <div className="mt-2 space-y-1 text-xs text-secondary">
                {selectedSectionData.professor && (
                  <p>Prof. {selectedSectionData.professor.name}</p>
                )}
                <p>
                  {formatDays(selectedSectionData.days)}{" "}
                  {formatTimeRange(
                    selectedSectionData.startTime,
                    selectedSectionData.endTime
                  )}
                </p>
                {selectedSectionData.location && (
                  <p>{selectedSectionData.location}</p>
                )}
                <p>
                  {selectedSectionData.openSeats} / {selectedSectionData.totalSeats} seats open
                </p>
              </div>
              <button
                onClick={() => {
                  removeSection(selectedSectionData.id);
                  setSelectedSection(null);
                  addToast(
                    `${selectedSectionData.course.code} removed`,
                    "info"
                  );
                }}
                className="mt-3 w-full text-xs py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950 transition-colors"
              >
                Remove from schedule
              </button>
            </div>
          )}
        </div>
      </div>

      <MobileNav activeView={mobileView} onToggle={setMobileView} />
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
