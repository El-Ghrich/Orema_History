"use client";

import { useEffect, useState } from "react";
import { TimelineEvent } from "@/data/events";

interface TimelineNavigationProps {
  events: TimelineEvent[];
  activeId: string;
  onSelectYear: (id: string) => void;
}

export function TimelineNavigation({
  events,
  activeId,
  onSelectYear,
}: TimelineNavigationProps) {
  return (
    <nav
      aria-label="مسار السنوات التاريخية"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[#171715]/90 backdrop-blur-md border border-white/[0.12] rounded-full px-3 py-2 shadow-2xl flex items-center gap-1 sm:gap-2"
    >
      <span className="hidden sm:inline-block font-mono text-[11px] text-[#8C867B] px-2 border-l border-white/10">
        المحطات
      </span>

      {events.map((evt) => {
        const isActive = activeId === evt.id || activeId === evt.slug;
        return (
          <button
            key={evt.id}
            type="button"
            onClick={() => onSelectYear(evt.slug)}
            className={`font-mono text-xs sm:text-sm font-semibold tabular-nums px-3 py-1.5 rounded-full transition-all duration-300 ${
              isActive
                ? "bg-[#E05A2B] text-white shadow-[0_0_12px_rgba(224,90,43,0.4)] scale-105"
                : "text-[#8C867B] hover:text-[#F5F2EB] hover:bg-white/[0.05]"
            }`}
          >
            {evt.year}
          </button>
        );
      })}
    </nav>
  );
}

