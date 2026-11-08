"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { TimelineEvent } from "@/data/events";
import { ScrollStack, ScrollStackItem } from "@/components/ui/ScrollStack";
import LineSidebar from "@/components/ui/LineSidebar";
import { MediaDrawer } from "@/components/media/MediaDrawer";
import {
  Menu,
  X,
  Maximize2,
  ChevronDown,
  Images,
  ArrowLeft,
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

interface MinimalTimelineProps {
  events: TimelineEvent[];
}

export function MinimalTimeline({ events }: MinimalTimelineProps) {
  const { isDark } = useTheme();

  // State: whether user is on the Hero section or has scrolled into the Timeline
  const [showHero, setShowHero] = useState(true);
  const [activeYearIndex, setActiveYearIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedEventForMedia, setSelectedEventForMedia] =
    useState<TimelineEvent | null>(null);
  const [selectedMediaId, setSelectedMediaId] = useState<string | undefined>(
    undefined,
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const isHandlingWheel = useRef(false);
  const stackCompletedRef = useRef(false);
  const touchStartY = useRef<number | null>(null);
  const touchStartX = useRef<number | null>(null);

  const totalYears = events.length;
  const currentEvent = events[activeYearIndex] || events[0];
  const yearsList = events.map((e) => e.year);

  // Dynamic colors for LineSidebar based on active theme
  const accentColor = isDark ? "#f09d1a" : "#d97706";
  const textColor = isDark ? "#8C867B" : "#68645C";
  const markerColor = isDark ? "#454542" : "#D1CCC4";

  // Transition to a specific year index
  const goToYear = useCallback(
    (nextIndex: number) => {
      if (nextIndex < 0 || nextIndex >= totalYears || isTransitioning) return;
      setIsTransitioning(true);
      stackCompletedRef.current = false;
      setActiveYearIndex(nextIndex);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 500);
    },
    [totalYears, isTransitioning],
  );

  const handleNextYear = useCallback(() => {
    if (activeYearIndex < totalYears - 1) {
      goToYear(activeYearIndex + 1);
    }
  }, [activeYearIndex, totalYears, goToYear]);

  const handlePrevYear = useCallback(() => {
    if (activeYearIndex > 0) {
      goToYear(activeYearIndex - 1);
    } else {
      // Reached before 1998 -> scroll back up to hero
      setShowHero(true);
    }
  }, [activeYearIndex, goToYear]);

  // When current year's stack completes, transition to next year
  const handleStackComplete = useCallback(() => {
    stackCompletedRef.current = true;
    setTimeout(() => {
      if (stackCompletedRef.current && activeYearIndex < totalYears - 1) {
        goToYear(activeYearIndex + 1);
      }
    }, 700);
  }, [activeYearIndex, totalYears, goToYear]);

  // Wheel listener for hero and timeline navigation
  const handleWheel = (e: React.WheelEvent) => {
    if (isHandlingWheel.current || isTransitioning) return;

    // In Hero: wheeling down enters Timeline
    if (showHero) {
      if (e.deltaY > 15) {
        isHandlingWheel.current = true;
        setShowHero(false);
        setTimeout(() => {
          isHandlingWheel.current = false;
        }, 700);
      }
      return;
    }

    // In Timeline: wheeling up while at first year returns to Hero
    if (activeYearIndex === 0 && e.deltaY < -25) {
      isHandlingWheel.current = true;
      setShowHero(true);
      setTimeout(() => {
        isHandlingWheel.current = false;
      }, 700);
      return;
    }

    // Advancing past stack
    if (e.deltaY > 25 && stackCompletedRef.current) {
      isHandlingWheel.current = true;
      handleNextYear();
      setTimeout(() => {
        isHandlingWheel.current = false;
      }, 800);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showHero) {
        if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") {
          e.preventDefault();
          setShowHero(false);
        }
        return;
      }

      if (e.key === "ArrowDown" || e.key === "ArrowLeft") {
        handleNextYear();
      } else if (e.key === "ArrowUp" || e.key === "ArrowRight") {
        handlePrevYear();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showHero, handleNextYear, handlePrevYear]);

  // Touch gesture support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current === null || touchStartX.current === null) return;
    const diffY = touchStartY.current - e.changedTouches[0].clientY;
    const diffX = touchStartX.current - e.changedTouches[0].clientX;

    if (showHero) {
      // Swiping up on hero enters timeline
      if (diffY > 40) {
        setShowHero(false);
      }
      touchStartY.current = null;
      touchStartX.current = null;
      return;
    }

    // In timeline: horizontal swipe navigates years
    if (Math.abs(diffX) > 55 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 0) {
        handleNextYear(); // Swiped left -> next year
      } else {
        handlePrevYear(); // Swiped right -> prev year
      }
    } else if (diffY < -60 && activeYearIndex === 0) {
      // Swiping down at 1998 -> return to Hero
      setShowHero(true);
    }

    touchStartY.current = null;
    touchStartX.current = null;
  };

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative w-screen h-screen h-[100dvh] overflow-hidden bg-[var(--bg-canvas)] text-[var(--text-primary)] select-none transition-colors duration-200 font-sans"
    >
      {/* =========================================================================
          HERO SECTION:
          - Logo at top right, alone, falling with smooth easing
          - Hero image with curved bottom edge (like a big circle)
          - "الأرشيف" in pure white color and very bold Cairo font
          - No timeline visible in hero section
          ========================================================================= */}
      <AnimatePresence mode="wait">
        {showHero ? (
          <motion.section
            key="hero-stage"
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
            className="absolute inset-0 z-40 flex flex-col justify-between items-center text-center overflow-hidden bg-[#0D0D0C]"
          >
            {/* --- LOGO AT TOP CENTER, ALONE, ANIMATED FALLING FROM TOP --- */}
            <motion.div
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                duration: 1.2,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.25,
              }}
              className="fixed top-6 sm:top-8 -translate-x-1/2 z-50 pointer-events-auto flex items-center justify-center"
            >
              <Image
                src="/logo.png"
                alt="شعار الأرشيف"
                width={100}
                height={100}
                className="h-9 sm:h-12 w-auto object-contain drop-shadow-[0_4px_18px_rgba(240,157,26,0.35)]"
                priority
              />
            </motion.div>

            {/* --- HERO IMAGE BACKGROUND WITH CURVED CIRCLE BOTTOM BORDER --- */}
            <div
              className="absolute inset-0 w-full h-[88vh] sm:h-[85vh] overflow-hidden pointer-events-none z-0"
              style={{
                // Curved bottom border like a majestic big circle arc
                clipPath: "ellipse(90% 100% at 50% 0%)",
              }}
            >
              {/* Actual heroImage background */}
              <Image
                src="/heroImage.jpg"
                alt="خلفية الأرشيف"
                fill
                priority
                className="object-cover object-center filter brightness-[0.62] contrast-[1.08] saturate-[0.88]"
              />

              {/* Atmospheric night vignette & subtle starry dust overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#0D0D0C]/75 via-[#0D0D0C]/35 to-[#0D0D0C] mix-blend-multiply" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(240,157,26,0.12)_0%,transparent_70%)]" />

              {/* Glowing boundary line along the curved bottom edge */}
              <div
                className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-[#f09d1a]/40 to-transparent"
                style={{
                  boxShadow: "0 -4px 30px rgba(240,157,26,0.4)",
                }}
              />
            </div>

            {/* --- HERO CENTER DISPLAY: "الأرشيف" IN PURE WHITE & VERY BOLD CAIRO FONT --- */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 w-full max-w-6xl mx-auto pt-12">
              <div className="relative inline-flex items-center justify-center my-2">
                <h1 className="font-sans font-black text-orange-50 text-[18vw] sm:text-[18vw] lg:text-[10vw] leading-none select-none tracking-normal drop-shadow-[0_25px_60px_rgba(0,0,0,0.95)] opacity-90">
                  الأرشيف
                </h1>
              </div>

              {/* Delhi-style Spaced Archival Timeline Subtitle */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.5, ease: "easeOut" }}
                className="mt-4 sm:mt-8 flex flex-col items-center gap-2.5"
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 sm:w-16 h-[1px] bg-gradient-to-r from-transparent to-[#f09d1a]/60" />
                  <p className="font-sans text-xs sm:text-sm lg:text-base font-bold tracking-[0.45em] sm:tracking-[0.6em] text-[#F5F2EB]/90 uppercase">
                    T I M E L I N E
                  </p>
                  <span className="w-8 sm:w-16 h-[1px] bg-gradient-to-l from-transparent to-[#f09d1a]/60" />
                </div>
                <p className="font-sans text-[11px] sm:text-xs text-[#8C867B] tracking-widest tabular-nums font-semibold">
                  1998 — 2005
                </p>
              </motion.div>
            </div>

            {/* --- BOTTOM SCROLL PROMPT (CLICK OR SCROLL TO ENTER TIMELINE) --- */}
            <motion.button
              type="button"
              onClick={() => setShowHero(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.7 }}
              className="relative z-10 mb-8 sm:mb-12 group flex flex-col items-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f09d1a] rounded-full p-2"
              aria-label="الانتقال إلى المسار الزمني"
            >
              <span className="font-sans text-xs text-[#FAF8F5]/65 group-hover:text-[#f09d1a] transition-colors tracking-wide font-medium">
                اسحب للأسفل للاستكشاف
              </span>
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <ChevronDown className="w-5 h-5 text-[#f09d1a]" />
              </motion.div>
            </motion.button>
          </motion.section>
        ) : (
          /* =========================================================================
              TIMELINE SECTION:
              - Big faded grey current year AT VERY TOP, partially behind the stack
              - Button to go to the year page (Left side on desktop, bottom center on mobile)
              - Clean stack of photos
              - Timeline navigation (LineSidebar on desktop, mobile menu on mobile)
              ========================================================================= */
          <motion.div
            key="timeline-stage"
            initial={{ opacity: 0, y: "15%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "15%" }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 flex flex-col justify-center items-center overflow-hidden"
          >
            {/* Ambient subtle glow */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,var(--aura-color)_0%,transparent_75%)] z-0" />

            {/* --- BIG FADED GREY CURRENT YEAR AT THE VERY TOP OF THE PAGE (PARTLY UNDER STACK) --- */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentEvent.year}
                initial={{ opacity: 0, y: -25, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -25, scale: 1.05 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="absolute -top-4 sm:-top-8 lg:-top-12 left-0 right-0 flex justify-center pointer-events-none select-none z-0 overflow-visible"
                dir="ltr"
              >
                <span className="font-sans font-black text-[34vw] sm:text-[30vw] lg:text-[25vw] leading-none text-neutral-400/[0.14] dark:text-neutral-500/[0.16] tabular-nums tracking-tighter">
                  {currentEvent.year}
                </span>
              </motion.div>
            </AnimatePresence>

            {/* --- DESKTOP LINE SIDEBAR (TIMELINE) --- */}
            <aside className="hidden lg:flex fixed left-10 top-1/2 -translate-y-1/2 z-40 overflow-visible pointer-events-auto">
              <LineSidebar
                items={yearsList}
                accentColor={accentColor}
                textColor={textColor}
                markerColor={markerColor}
                showIndex={false}
                showMarker
                proximityRadius={95}
                maxShift={24}
                falloff="smooth"
                markerLength={36}
                markerGap={6}
                tickScale={0.38}
                scaleTick
                itemGap={20}
                fontSize={1.15}
                smoothing={100}
                activeItemIndex={activeYearIndex}
                onItemClick={(index) => {
                  goToYear(index);
                }}
              />
            </aside>

            {/* --- GO TO YEAR PAGE BUTTON (DESKTOP: LEFT SIDE, MOBILE: BOTTOM CENTER) --- */}
            <div className="fixed z-40 bottom-6 left-1/2 -translate-x-1/2 lg:bottom-12 lg:left-8 lg:translate-x-0 pointer-events-auto">
              <Link
                href={`/archive/${currentEvent.year}`}
                className="group flex items-center gap-2.5 px-5 py-2.5 min-h-[44px] rounded-full bg-white/95 dark:bg-[#171715]/95 hover:bg-[#f09d1a] dark:hover:bg-[#f09d1a] border border-[#f09d1a]/50 text-[#f09d1a] hover:text-[#0D0D0C] dark:hover:text-[#0D0D0C] backdrop-blur-md shadow-xl font-sans text-xs sm:text-sm font-bold transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f09d1a]"
                title={`فتح صفحة عام ${currentEvent.year}`}
              >
                <Images className="w-4 h-4 transition-transform group-hover:scale-110" />
                <span>صفحة عام {currentEvent.year}</span>
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              </Link>
            </div>

            {/* --- MOBILE TIMELINE TOGGLE & FLYOUT (BOTTOM LEFT ON MOBILE) --- */}
            <div className="lg:hidden fixed bottom-6 left-6 z-50">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="flex items-center gap-2 px-3.5 py-2.5 min-h-[44px] min-w-[44px] rounded-full bg-white/95 dark:bg-[#171715]/95 backdrop-blur-md border border-[#f09d1a]/50 text-[#f09d1a] shadow-lg dark:shadow-2xl font-sans text-xs font-bold tabular-nums active:scale-95 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f09d1a]"
                aria-label="عرض قائمة السنوات"
              >
                {mobileMenuOpen ? (
                  <X className="w-3.5 h-3.5" />
                ) : (
                  <Menu className="w-3.5 h-3.5" />
                )}
                <span>{currentEvent.year}</span>
              </button>

              <AnimatePresence>
                {mobileMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-30"
                      onClick={() => setMobileMenuOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 16, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 16, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="relative z-40 mb-3 w-auto min-w-[130px] p-3 px-4 rounded-2xl bg-white/95 dark:bg-[#171715]/95 backdrop-blur-xl border border-black/10 dark:border-white/10 shadow-2xl"
                    >
                      <LineSidebar
                        items={yearsList}
                        accentColor={accentColor}
                        textColor={textColor}
                        markerColor={markerColor}
                        showIndex={false}
                        showMarker
                        proximityRadius={75}
                        maxShift={16}
                        falloff="smooth"
                        markerLength={24}
                        markerGap={6}
                        tickScale={0.38}
                        scaleTick
                        itemGap={12}
                        fontSize={0.95}
                        smoothing={100}
                        activeItemIndex={activeYearIndex}
                        onItemClick={(index) => {
                          goToYear(index);
                          setMobileMenuOpen(false);
                        }}
                      />
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* --- MAIN PHOTO STACK: CARDS SITTING IN FRONT OF LOWER HALF OF YEAR --- */}
            <main className="relative flex-1 w-full h-full overflow-hidden flex flex-col justify-center z-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentEvent.year}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full h-full relative flex flex-col justify-center"
                >
                  <div className="relative w-full h-full">
                    <ScrollStack
                      itemDistance={90}
                      itemStackDistance={22}
                      stackPosition="14%"
                      itemScale={0.06}
                      baseScale={0.88}
                      dimAmount={isDark ? 0.25 : 0.12}
                      tiltAmount={3}
                      holdDistance={160}
                      smoothScroll={true}
                      useWindowScroll={false}
                      onStackComplete={handleStackComplete}
                      onScrollTop={() => {
                        if (activeYearIndex === 0) {
                          setShowHero(true);
                        } else {
                          handlePrevYear();
                        }
                      }}
                      onScrollBottom={handleNextYear}
                      className="w-full h-full no-scrollbar"
                    >
                      {currentEvent.stackCards.map((card, idx) => (
                        <ScrollStackItem
                          key={card.id}
                          itemClassName="h-[52vh] min-h-[320px] max-h-[500px] sm:h-[500px] w-full max-w-[92vw] sm:max-w-2xl lg:max-w-3xl mx-auto overflow-hidden rounded-[22px] sm:rounded-[28px] ring-1 ring-black/[0.08] dark:ring-white/10 group cursor-pointer shadow-xl dark:shadow-2xl active:scale-[0.98] transition-transform"
                        >
                          <div
                            onClick={() => {
                              setSelectedEventForMedia(currentEvent);
                              setSelectedMediaId(currentEvent.media[idx]?.id);
                            }}
                            className="relative w-full h-full bg-[#FAF8F5] dark:bg-[#171715] overflow-hidden"
                          >
                            <Image
                              src={card.image}
                              alt="وثيقة أرشيفية"
                              fill
                              sizes="(max-width: 768px) 92vw, 750px"
                              className="object-cover transition-transform duration-700 group-hover:scale-105"
                              priority={idx === 0}
                            />
                            {/* Subtle dark vignette */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 dark:from-[#0D0D0C]/60 via-transparent to-transparent opacity-50" />

                            {/* Expand pill on hover */}
                            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 dark:bg-[#0D0D0C]/80 backdrop-blur-md text-[11px] font-sans font-medium text-[#1C1917] dark:text-[#F5F2EB]/90 border border-black/10 dark:border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Maximize2 className="w-3 h-3 text-[#f09d1a]" />
                              <span>معاينة</span>
                            </div>
                          </div>
                        </ScrollStackItem>
                      ))}
                    </ScrollStack>
                  </div>
                </motion.div>
              </AnimatePresence>
            </main>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox / Media Drawer Modal for enlarged photo viewing */}
      <MediaDrawer
        isOpen={!!selectedEventForMedia}
        onClose={() => setSelectedEventForMedia(null)}
        event={selectedEventForMedia}
        initialMediaId={selectedMediaId}
      />
    </div>
  );
}
