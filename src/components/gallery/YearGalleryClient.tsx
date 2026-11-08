"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar, MapPin, Sparkles } from "lucide-react";
import { Masonry } from "@/components/ui/Masonry";
import { YearGalleryInfo } from "@/data/archiveGallery";
import { useTheme } from "@/context/ThemeContext";

interface YearGalleryClientProps {
  galleryInfo: YearGalleryInfo;
  allYears: string[];
}

export function YearGalleryClient({
  galleryInfo,
  allYears,
}: YearGalleryClientProps) {
  const { isDark } = useTheme();

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] select-none flex flex-col transition-colors duration-200">
      {/* Subtle ambient radial background glow */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_15%,var(--aura-color)_0%,transparent_60%)] z-0" />

      {/* ================= STICKY HEADER ================= */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/80 dark:bg-[#0D0D0C]/85 border-b border-black/[0.06] dark:border-white/[0.08] px-4 sm:px-8 py-3.5 transition-colors duration-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Back to Timeline Button */}
          <Link
            href="/"
            className="group inline-flex items-center gap-2 px-3.5 py-1.5 min-h-[38px] rounded-full bg-white dark:bg-[#171715] border border-black/10 dark:border-white/10 text-xs sm:text-sm font-sans text-[#68645C] dark:text-[#8C867B] hover:text-[#f09d1a] hover:border-[#f09d1a]/40 transition-all duration-150 active:scale-95 shadow-sm"
          >
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 text-[#f09d1a]" />
            <span>العودة للجدول الزمني</span>
          </Link>

          {/* Minimal Brand: Logo + "الأرشيف" */}
          <Link
            href="/"
            className="flex items-center gap-2.5 hover:opacity-90 transition-opacity"
          >
            <Image
              src="/logo.png"
              alt="الشعار"
              width={60}
              height={60}
              className="h-6 sm:h-7 w-auto object-contain "
              priority
            />
          </Link>
        </div>
      </header>

      {/* ================= MAIN CONTENT ================= */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 pt-6 sm:pt-8 pb-20 flex flex-col">
        {/* Year Switcher Pills */}
        <div className="w-full flex items-center justify-start sm:justify-center overflow-x-auto no-scrollbar gap-2 pb-5 pt-1">
          {allYears.map((yearStr) => {
            const isActive = yearStr === galleryInfo.year;
            return (
              <Link
                key={yearStr}
                href={`/archive/${yearStr}`}
                className={`shrink-0 px-4 py-1.5 min-h-[36px] flex items-center justify-center rounded-full font-mono text-xs sm:text-sm tabular-nums transition-all duration-150 active:scale-95 ${
                  isActive
                    ? "bg-[#f09d1a] text-[#0D0D0C] font-bold shadow-md shadow-[#f09d1a]/25 scale-105"
                    : "bg-white/80 dark:bg-[#171715] text-[#68645C] dark:text-[#8C867B] hover:text-[var(--text-primary)] hover:bg-white dark:hover:bg-[#21211E] border border-black/[0.08] dark:border-white/[0.08]"
                }`}
              >
                {yearStr}
              </Link>
            );
          })}
        </div>

        {/* Year Info Banner */}
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-white/70 dark:bg-[#171715]/70 border border-black/[0.06] dark:border-white/[0.08] p-5 sm:p-10 mb-8 backdrop-blur-md shadow-lg dark:shadow-2xl">
          {/* Ghost Year Background Watermark */}
          <div
            className="absolute -left-4 -bottom-8 pointer-events-none select-none font-mono text-8xl sm:text-9xl font-black text-black/[0.02] dark:text-white/[0.02] tabular-nums"
            dir="ltr"
          >
            {galleryInfo.year}
          </div>
            {/* Hint Notice */}
            <div className=" flex items-center  text-[11px] sm:text-xs text-[#68645C]/80 dark:text-[#8C867B]/80 font-sans">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f09d1a]" />
              <span>
                الصور تظهر بالأبيض والأسود، وعند التمرير بمؤشر الفأرة (Hover) تظهر بألوانها الأصلية. انقر على أي صورة للتكبير والمعاينة.
              </span>
            </div>
          </div>

        {/* ================= MASONRY GALLERY ================= */}
        <div className="w-full relative flex-1 min-h-[400px]">
          <Masonry
            items={galleryInfo.items}
            columns="auto"
            columnWidth={260}
            gap={16}
            radius={16}
            animateFrom="bottom"
            duration={0.5}
            bounce={0.12}
            blurToFocus={true}
            hoverEffect="lift"
            focusOnHover={true}
            captions="hover"
            lightbox={true}
            draggable={true}
            className="w-full"
          />
        </div>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="relative z-10 border-t border-black/[0.06] dark:border-white/[0.08] bg-white/50 dark:bg-[#0D0D0C]/80 py-6 px-4 text-center">
        <p className="font-sans text-xs text-[#68645C]/70 dark:text-[#8C867B]/70 tracking-normal">
          الأرشيف التاريخي الموحد (1998 — 2005) • جميع المقتنيات والوثائق محفوظة
        </p>
      </footer>
    </div>
  );
}
