"use client";

import { useEffect, useCallback, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { TimelineEvent, TimelineMedia } from "@/data/events";
import { X, ChevronRight, ChevronLeft, Images, ArrowLeft } from "lucide-react";

interface MediaDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  event: TimelineEvent | null;
  initialMediaId?: string;
}

export function MediaDrawer({
  isOpen,
  onClose,
  event,
  initialMediaId,
}: MediaDrawerProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Sync with initialMediaId when opened
  useEffect(() => {
    if (event && initialMediaId) {
      const idx = event.media.findIndex((m) => m.id === initialMediaId);
      if (idx !== -1) setActiveIndex(idx);
    } else {
      setActiveIndex(0);
    }
  }, [event, initialMediaId, isOpen]);

  // Keyboard navigation
  const handleNext = useCallback(() => {
    if (!event) return;
    setActiveIndex((prev) => (prev + 1) % event.media.length);
  }, [event]);

  const handlePrev = useCallback(() => {
    if (!event) return;
    setActiveIndex(
      (prev) => (prev - 1 + event.media.length) % event.media.length
    );
  }, [event]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") onClose();
      // In RTL: ArrowRight goes to previous item, ArrowLeft goes to next
      if (e.key === "ArrowLeft") handleNext();
      if (e.key === "ArrowRight") handlePrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, handleNext, handlePrev]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!event) return null;

  const currentMedia: TimelineMedia | undefined = event.media[activeIndex];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 md:p-6 select-none">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/85 dark:bg-[#0D0D0C]/90 backdrop-blur-md"
          />

          {/* Modal / Image Viewer Container (No Text) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-6xl h-full sm:h-auto sm:max-h-[94vh] bg-[#0D0D0C] sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden text-white z-10"
            dir="rtl"
          >
            {/* Minimal Clean Top Bar: Button to Year Page + Close Button */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-black/60 backdrop-blur-md border-b border-white/[0.08] z-20">
              {/* Button to Year Page */}
              <Link
                href={`/archive/${event.year}`}
                onClick={onClose}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-[#f09d1a] hover:text-[#0D0D0C] text-[#f09d1a] border border-[#f09d1a]/50 font-sans text-xs sm:text-sm font-bold transition-all duration-150 active:scale-95"
              >
                <Images className="w-4 h-4" />
                <span>صفحة عام {event.year}</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </Link>

              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                className="p-2 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-all active:scale-95"
                aria-label="إغلاق"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Full-Size Image Display Area (Zero Text) */}
            <div className="relative flex-1 min-h-[50vh] sm:min-h-[65vh] flex items-center justify-center bg-black/40 overflow-hidden">
              {currentMedia?.type === "video" ? (
                <div className="relative w-full h-full max-h-[70vh] flex items-center justify-center p-2 sm:p-6">
                  <video
                    key={currentMedia.url}
                    controls
                    autoPlay
                    playsInline
                    className="max-h-[65vh] w-auto max-w-full rounded-lg shadow-2xl"
                    poster={currentMedia.thumbnail}
                  >
                    <source src={currentMedia.url} type="video/mp4" />
                  </video>
                </div>
              ) : (
                <div className="relative w-full h-full min-h-[50vh] sm:min-h-[65vh] flex items-center justify-center p-2 sm:p-6">
                  {currentMedia?.url && (
                    <div className="relative w-full h-[55vh] sm:h-[68vh]">
                      <Image
                        src={currentMedia.url}
                        alt=""
                        fill
                        className="object-contain"
                        sizes="(max-width: 1200px) 100vw, 1200px"
                        priority
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Prev / Next Navigation Controls */}
              {event.media.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 p-3 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-black/60 hover:bg-[#f09d1a] hover:text-[#0D0D0C] text-white border border-white/10 backdrop-blur-md transition-all active:scale-95 shadow-lg"
                    aria-label="السابق"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 p-3 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-black/60 hover:bg-[#f09d1a] hover:text-[#0D0D0C] text-white border border-white/10 backdrop-blur-md transition-all active:scale-95 shadow-lg"
                    aria-label="التالي"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Bottom Row: Other Images of That Year (Thumbnails Only, No Text) */}
            {event.media.length > 1 && (
              <div className="p-3 sm:p-4 bg-black/70 backdrop-blur-md border-t border-white/[0.08] flex items-center justify-center overflow-x-auto no-scrollbar">
                <div className="flex items-center gap-2 sm:gap-3 py-1">
                  {event.media.map((m, idx) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setActiveIndex(idx)}
                      className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all duration-150 active:scale-95 ${
                        activeIndex === idx
                          ? "border-[#f09d1a] ring-2 ring-[#f09d1a]/50 scale-105"
                          : "border-white/10 opacity-50 hover:opacity-90"
                      }`}
                    >
                      <Image
                        src={m.thumbnail || m.url}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
