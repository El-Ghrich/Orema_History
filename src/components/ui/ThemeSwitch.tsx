"use client";

import { useTheme } from "@/context/ThemeContext";
import { Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export function ThemeSwitch() {
  const { theme, isDark, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="fixed bottom-6 right-6 z-50 w-11 h-11 sm:w-12 sm:h-12 rounded-full pointer-events-none" />
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 pointer-events-auto">
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={
          isDark
            ? "التبديل إلى الوضع النهاري (الفاتح)"
            : "التبديل إلى الوضع الليلي (الداكن)"
        }
        title={isDark ? "الوضع النهاري" : "الوضع الليلي"}
        className="group relative flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/90 dark:bg-[#171715]/90 hover:bg-white dark:hover:bg-[#21211E] border border-black/[0.08] dark:border-white/[0.12] text-[#1C1917] dark:text-[#F5F2EB] shadow-[0_4px_24px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.5)] backdrop-blur-md transition-all duration-150 ease-out active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f09d1a] focus-visible:ring-offset-2 select-none"
      >
        <AnimatePresence mode="wait" initial={false}>
          {isDark ? (
            <motion.div
              key="sun"
              initial={{ rotate: -90, opacity: 0, scale: 0.7 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: 90, opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="flex items-center justify-center"
            >
              <Sun className="w-5 h-5 text-[#f09d1a] transition-transform duration-200 group-hover:scale-110" />
            </motion.div>
          ) : (
            <motion.div
              key="moon"
              initial={{ rotate: 90, opacity: 0, scale: 0.7 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: -90, opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="flex items-center justify-center"
            >
              <Moon className="w-5 h-5 text-[#d97706] transition-transform duration-200 group-hover:scale-110" />
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </div>
  );
}

