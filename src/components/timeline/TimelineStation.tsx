"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { TimelineEvent } from "@/data/events";
import {
  Calendar,
  MapPin,
  Film,
  Camera,
  Layers,
  ArrowLeft,
  Sparkles,
} from "lucide-react";

interface TimelineStationProps {
  event: TimelineEvent;
  index: number;
  onOpenMedia: (event: TimelineEvent, mediaId?: string) => void;
}

export function TimelineStation({
  event,
  index,
  onOpenMedia,
}: TimelineStationProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.article
      id={event.slug}
      initial={{ opacity: 0, x: 24 }} // RTL entrance: right to left
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative group scroll-mt-28"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Timeline Node on the Right (RTL) */}
      <div className="absolute -right-[31px] sm:-right-[55px] top-3 flex items-center justify-center">
        <div className="relative">
          <span className="block w-4 h-4 rounded-full bg-[#0D0D0C] border-2 border-[#E05A2B] group-hover:scale-125 group-hover:bg-[#E05A2B] transition-transform duration-300 shadow-[0_0_14px_rgba(224,90,43,0.6)]" />
          <span className="absolute -inset-1 rounded-full bg-[#E05A2B]/20 animate-ping pointer-events-none" />
        </div>
      </div>

      {/* Main Archival Station Card */}
      <div className="bg-[#171715]/90 hover:bg-[#171715] border border-white/[0.08] hover:border-white/[0.18] rounded-2xl p-6 sm:p-10 transition-all duration-300 shadow-xl backdrop-blur-sm">
        

        {/* Visual Showcase: Primary Cover + Fan-out Interactive Previews */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Primary Cover Image with Trigger */}
          <div
            onClick={() => onOpenMedia(event)}
            className="lg:col-span-8 relative aspect-[16/9] rounded-xl overflow-hidden ring-1 ring-white/10 group/cover cursor-pointer"
          >
            <Image
              src={event.coverImage}
              alt={event.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 800px"
              className="object-cover transition-transform duration-700 group-hover/cover:scale-105"
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

            {/* Overlay Badges */}
            <div className="absolute bottom-4 right-4 left-4 flex items-center justify-between text-xs text-white/90">
              <span className="font-mono bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded border border-white/10">
                المصدر الأرشيفي المعتمد
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E05A2B]/90 text-white font-medium shadow-md">
                <Camera className="w-3.5 h-3.5" />
                معاينة {event.media.length} عناصر
              </span>
            </div>
          </div>

          {/* Fan-Out / Stacked Preview Thumbnails */}
          <div className="lg:col-span-4 flex flex-row lg:flex-col gap-3 justify-between">
            {event.previewImages.slice(0, 3).map((imgUrl, pIdx) => {
              // Fan rotation effect based on hover
              const rotationClass =
                pIdx === 0
                  ? isHovered
                    ? "-rotate-2 translate-y-[-2px]"
                    : "rotate-0"
                  : pIdx === 1
                  ? isHovered
                    ? "rotate-1 translate-y-[-4px]"
                    : "rotate-0"
                  : isHovered
                  ? "rotate-2 translate-y-[-2px]"
                  : "rotate-0";

              return (
                <div
                  key={pIdx}
                  onClick={() => onOpenMedia(event)}
                  className={`relative flex-1 aspect-[16/10] rounded-xl overflow-hidden ring-1 ring-white/10 cursor-pointer transition-all duration-300 ${rotationClass} hover:ring-[#E05A2B]/50 hover:scale-[1.03]`}
                >
                  <Image
                    src={imgUrl}
                    alt={`${event.title} - معاينة مصورة ${pIdx + 1}`}
                    fill
                    sizes="(max-width: 768px) 33vw, 300px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 hover:bg-transparent transition-colors" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Media Drawer Quick Action Bar */}
        <div className="mt-7 pt-5 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#8C867B]" />
            <span className="text-xs text-[#8C867B] font-mono">
              وسائط السجل:
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {event.media.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => onOpenMedia(event, m.id)}
                  className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded bg-white/[0.04] hover:bg-white/[0.09] border border-white/[0.08] text-[#F5F2EB]/90 transition-colors"
                >
                  {m.type === "video" ? (
                    <Film className="w-3 h-3 text-[#E05A2B]" />
                  ) : (
                    <Camera className="w-3 h-3 text-[#1A4D2E]" />
                  )}
                  <span>
                    {m.type === "video" ? "مقطع وثائقي" : "صورة فوتوغرافية"}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => onOpenMedia(event)}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#E05A2B] hover:text-white transition-colors group/btn"
          >
            <span>فتح خزانة الوسائط والمخطوطات</span>
            <ArrowLeft className="w-4 h-4 transition-transform group-hover/btn:-translate-x-1" />
          </button>
        </div>
      </div>
    </motion.article>
  );
}

