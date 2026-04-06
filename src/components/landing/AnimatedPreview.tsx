"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Pause, Play } from "lucide-react";

const COLORS = [
  { bg: "#dbeafe", text: "#1e40af" },  // blue
  { bg: "#dcfce7", text: "#166534" },  // green
  { bg: "#ede9fe", text: "#5b21b6" },  // violet
  { bg: "#fef3c7", text: "#92400e" },  // amber
  { bg: "#fce7f3", text: "#9d174d" },  // pink
  { bg: "#ccfbf1", text: "#115e59" },  // teal
];

const DAYS = ["M", "T", "W", "Th", "F"];
const DAY_INDEX: Record<string, number> = { M: 0, T: 1, W: 2, Th: 3, F: 4 };
const TIME_LABELS = ["9 AM", "10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM"];

type Pattern = "MWF" | "TTh" | "M" | "T" | "W" | "Th" | "F";

interface Block {
  id: string;
  code: string;
  time: string;
  pattern: Pattern;
  row: number;   // time row index 0-6
  span: number;  // how many rows tall (1 = normal, 2 = lab)
  color: number;
}

// Instance positions: always render 3 copies per block with stable keys
const INSTANCE_COLS: Record<string, [number, number, number]> = {
  MWF: [0, 2, 4],
  TTh: [1, 3, 3],
  M:   [0, 0, 0],
  T:   [1, 1, 1],
  W:   [2, 2, 2],
  Th:  [3, 3, 3],
  F:   [4, 4, 4],
};
const INSTANCE_VISIBLE: Record<string, [boolean, boolean, boolean]> = {
  MWF: [true, true, true],
  TTh: [true, true, false],
  M:   [true, false, false],
  T:   [true, false, false],
  W:   [true, false, false],
  Th:  [true, false, false],
  F:   [true, false, false],
};

// 4 schedule states — blocks swap patterns (MWF↔TTh) for lateral movement
const STATES: Block[][] = [
  [
    { id: "A", code: "PHIL 1000", time: "1 PM",    pattern: "MWF", row: 4, span: 1, color: 0 },
    { id: "B", code: "CS 1501",   time: "2:30 PM", pattern: "TTh", row: 5, span: 1, color: 1 },
    { id: "C", code: "MATH 0220", time: "9 AM",    pattern: "MWF", row: 0, span: 1, color: 3 },
    { id: "D", code: "CHEM 0110", time: "11 AM",   pattern: "TTh", row: 2, span: 1, color: 4 },
    { id: "E", code: "ECON 0100", time: "10 AM",   pattern: "MWF", row: 1, span: 1, color: 5 },
    { id: "F", code: "CHEM Lab",  time: "3 PM",    pattern: "Th",  row: 5, span: 2, color: 2 },
  ],
  [
    { id: "A", code: "PHIL 1000", time: "9 AM",    pattern: "TTh", row: 0, span: 1, color: 0 },
    { id: "B", code: "CS 1501",   time: "11 AM",   pattern: "MWF", row: 2, span: 1, color: 1 },
    { id: "C", code: "MATH 0220", time: "1 PM",    pattern: "TTh", row: 4, span: 1, color: 3 },
    { id: "D", code: "CHEM 0110", time: "10 AM",   pattern: "MWF", row: 1, span: 1, color: 4 },
    { id: "E", code: "ECON 0100", time: "2 PM",    pattern: "TTh", row: 5, span: 1, color: 5 },
    { id: "F", code: "CHEM Lab",  time: "3 PM",    pattern: "W",   row: 5, span: 2, color: 2 },
  ],
  [
    { id: "A", code: "PHIL 1000", time: "10 AM",   pattern: "MWF", row: 1, span: 1, color: 0 },
    { id: "B", code: "CS 1501",   time: "9 AM",    pattern: "TTh", row: 0, span: 1, color: 1 },
    { id: "C", code: "MATH 0220", time: "2 PM",    pattern: "MWF", row: 5, span: 1, color: 3 },
    { id: "D", code: "CHEM 0110", time: "12 PM",   pattern: "TTh", row: 3, span: 1, color: 4 },
    { id: "E", code: "ECON 0100", time: "11 AM",   pattern: "MWF", row: 2, span: 1, color: 5 },
    { id: "F", code: "CHEM Lab",  time: "1 PM",    pattern: "T",   row: 4, span: 2, color: 2 },
  ],
  [
    { id: "A", code: "PHIL 1000", time: "3 PM",    pattern: "TTh", row: 6, span: 1, color: 0 },
    { id: "B", code: "CS 1501",   time: "10 AM",   pattern: "MWF", row: 1, span: 1, color: 1 },
    { id: "C", code: "MATH 0220", time: "12 PM",   pattern: "TTh", row: 3, span: 1, color: 3 },
    { id: "D", code: "CHEM 0110", time: "9 AM",    pattern: "MWF", row: 0, span: 1, color: 4 },
    { id: "E", code: "ECON 0100", time: "1 PM",    pattern: "MWF", row: 4, span: 1, color: 5 },
    { id: "F", code: "CHEM Lab",  time: "11 AM",   pattern: "F",   row: 2, span: 2, color: 2 },
  ],
];

const CHAT_MESSAGES = [
  { query: "Find me a humanities elective MWF after 1pm", result: "PHIL 1000", subtitle: "Intro to Philosophy" },
  { query: "Move PHIL to Wednesday morning", result: "PHIL 1000", subtitle: "Moved to Wed 9 AM" },
  { query: "I need a CS class TTh afternoon", result: "CS 0445", subtitle: "Data Structures" },
  { query: "Swap MATH and CHEM around", result: "MATH 0220", subtitle: "Schedule rebalanced" },
];

export function AnimatedPreview() {
  const [stateIdx, setStateIdx] = useState(0);
  const [chatAnim, setChatAnim] = useState(false);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);

  const togglePause = useCallback(() => {
    setPaused((p) => {
      pausedRef.current = !p;
      return !p;
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (pausedRef.current) return;
      setChatAnim(true);
      setTimeout(() => {
        if (pausedRef.current) { setChatAnim(false); return; }
        setStateIdx((prev) => (prev + 1) % STATES.length);
        setChatAnim(false);
      }, 300);
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  const blocks = STATES[stateIdx];
  const chat = CHAT_MESSAGES[stateIdx];

  // Grid cell sizing: 5 columns, 7 rows
  const colW = 100 / 5;   // 20%
  const headerH = 20;      // px for day headers
  const rowH = 100 / 7;   // ~14.28% of available height

  return (
    <div
      className="rounded-xl border border-border bg-surface overflow-hidden shadow-lg relative group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Window chrome */}
      <div className="h-8 border-b border-border bg-surface flex items-center gap-1.5 px-4">
        <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
        <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
      </div>

      <div className="grid grid-cols-3 h-72">
        {/* Chat panel */}
        <div className="border-r border-border p-4 overflow-hidden">
          <div
            className={`space-y-3 transition-all duration-300 ${
              chatAnim ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
            }`}
          >
            <div className="bg-accent-soft rounded-lg p-2 text-xs text-accent">
              {chat.query}
            </div>
            <div className="text-xs text-secondary">
              Here are some options that match:
            </div>
            <div className="border border-border rounded-lg p-2 space-y-1">
              <div className="text-xs font-mono font-bold">{chat.result}</div>
              <div className="text-[10px] text-secondary">{chat.subtitle}</div>
            </div>
          </div>
        </div>

        {/* Calendar grid */}
        <div className="col-span-2 p-3">
          <div ref={gridRef} className="relative h-full">
            {/* Day headers */}
            <div className="flex" style={{ height: headerH }}>
              {DAYS.map((day, i) => (
                <div
                  key={day}
                  className="text-[10px] text-tertiary font-medium text-center"
                  style={{ width: `${colW}%` }}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Time row lines */}
            <div className="absolute left-0 right-0" style={{ top: headerH, bottom: 0 }}>
              {TIME_LABELS.map((_, i) => (
                <div
                  key={i}
                  className="absolute left-0 right-0 border-t border-border/40"
                  style={{ top: `${i * rowH}%` }}
                />
              ))}
            </div>

            {/* Animated course blocks — 3 stable instances per block */}
            <div className="absolute left-0 right-0" style={{ top: headerH, bottom: 0 }}>
              {blocks.flatMap((block) => {
                const c = COLORS[block.color];
                const cols = INSTANCE_COLS[block.pattern];
                const vis = INSTANCE_VISIBLE[block.pattern];
                return [0, 1, 2].map((i) => (
                  <div
                    key={`${block.id}-${i}`}
                    className="absolute rounded-md p-1.5 shadow-sm"
                    style={{
                      left: `${cols[i] * colW + 0.5}%`,
                      top: `${block.row * rowH + 0.5}%`,
                      width: `${colW - 1}%`,
                      height: `${rowH * block.span - 1}%`,
                      backgroundColor: c.bg,
                      color: c.text,
                      opacity: vis[i] ? 1 : 0,
                      transition: "left 500ms cubic-bezier(0.4, 0, 0.2, 1), top 500ms cubic-bezier(0.4, 0, 0.2, 1), opacity 500ms cubic-bezier(0.4, 0, 0.2, 1), height 500ms cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  >
                    <div className="text-[8px] font-bold leading-tight truncate">
                      {block.code}
                    </div>
                    <div className="text-[7px] leading-tight opacity-70">
                      {block.time}
                    </div>
                  </div>
                ));
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Pause/Play button */}
      <button
        onClick={togglePause}
        className={`absolute bottom-3 right-3 w-7 h-7 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center transition-opacity duration-200 cursor-pointer ${
          hovered || paused ? "opacity-100" : "opacity-0"
        }`}
        aria-label={paused ? "Play" : "Pause"}
      >
        {paused ? (
          <Play className="w-3.5 h-3.5 text-white/90" />
        ) : (
          <Pause className="w-3.5 h-3.5 text-white/90" />
        )}
      </button>
    </div>
  );
}
