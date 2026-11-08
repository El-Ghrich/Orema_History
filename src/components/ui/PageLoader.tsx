'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

type Phase = 'filling' | 'wiping' | 'done';

/**
 * PageLoader — plays once per browser session.
 *
 * Visual design:
 *  1. FILLING  — logo shown in greyscale; true-colour version rises from bottom
 *                via clip-path inset(), like ink filling a stamp.
 *  2. WIPING   — the ENTIRE loader panel slides upward out of the viewport,
 *                revealing the page content beneath (Aspen Search–style curtain).
 *  3. DONE     — component unmounts, session flag set to skip next time.
 */
export default function PageLoader() {
  const [phase, setPhase] = useState<Phase>('filling');
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const didWipe = useRef(false);

  // ── Skip on subsequent visits within the same tab session ─────────────────
  const [skip] = useState(() => {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem('intro-played') === '1';
  });

  // ── Simulated progress (0 → 100) ──────────────────────────────────────────
  useEffect(() => {
    if (skip) {
      setPhase('done');
      return;
    }

    let p = 0;

    const drive = () => {
      // Fast start, gradual deceleration near completion for drama
      const step = p < 50 ? 2.8 : p < 75 ? 1.3 : p < 90 ? 0.6 : 0.2;
      p = Math.min(100, p + step);
      setProgress(Math.round(p));

      if (p >= 100 && !didWipe.current) {
        didWipe.current = true;
        clearInterval(intervalRef.current!);
        // Hold at 100 % for a beat, then swipe
        setTimeout(() => setPhase('wiping'), 400);
      }
    };

    intervalRef.current = setInterval(drive, 20); // ~50 fps

    // Let the real load event accelerate progress to near-100
    const onLoad = () => { p = Math.max(p, 90); };
    if (document.readyState === 'complete') {
      p = 90;
    } else {
      window.addEventListener('load', onLoad, { once: true });
    }

    return () => {
      clearInterval(intervalRef.current!);
      window.removeEventListener('load', onLoad);
    };
  }, [skip]);

  if (phase === 'done') return null;

  // Clip-path that rises from the bottom:
  // inset(TOP% 0 0 0) → as progress 0→100, TOP goes 100→0
  const fillClip = `inset(${100 - progress}% 0 0 0)`;

  return (
    <AnimatePresence>
      {(phase === 'filling' || phase === 'wiping') && (
        <motion.div
          key="page-loader"
          className="fixed inset-0 z-[9999] overflow-hidden flex flex-col items-center justify-center select-none"
          style={{ background: '#0D0D0C' }}
          aria-hidden="true"
          // ── WIPE: entire panel slides straight up, revealing page below ──
          animate={phase === 'wiping' ? { y: '-100%' } : { y: 0 }}
          transition={
            phase === 'wiping'
              ? {
                  duration: 0.9,
                  ease: [0.76, 0, 0.24, 1], // sharp ease-in-out — cinematic
                }
              : { duration: 0 }
          }
          onAnimationComplete={() => {
            if (phase === 'wiping') {
              sessionStorage.setItem('intro-played', '1');
              setPhase('done');
            }
          }}
        >
          {/* ── Ambient glow that pulses behind logo ──────────────────── */}
          <motion.div
            animate={{ opacity: [0.08, 0.28, 0.08], scale: [1, 1.08, 1] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute w-[480px] h-[480px] rounded-full pointer-events-none"
            style={{
              background:
                'radial-gradient(circle, rgba(240,157,26,0.18) 0%, transparent 68%)',
            }}
          />

          {/* ── Logo container ─────────────────────────────────────────── */}
          <div className="relative w-32 h-32 sm:w-44 sm:h-44 z-10">
            {/* Layer 1 — greyscale base (the "empty" / unfilled logo) */}
            <Image
              src="/logo.png"
              alt="شعار الأرشيف"
              fill
              className="object-contain"
              style={{
                filter: 'grayscale(1) brightness(0.5)',
                opacity: 0.35,
              }}
              priority
            />

            {/* Layer 2 — true-colour logo, revealed bottom-to-top via clip */}
            <div
              className="absolute inset-0"
              style={{ clipPath: fillClip }}
            >
              <Image
                src="/logo.png"
                alt=""
                fill
                className="object-contain"
                // No filter — show the logo's actual colours
                priority
              />
            </div>
          </div>

          {/* ── Thin progress bar ──────────────────────────────────────── */}
          <div className="relative z-10 mt-10 w-28 sm:w-36 h-[2px] rounded-full bg-white/[0.08] overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: `${progress}%`,
                background: '#f09d1a',
                transition: 'width 0.04s linear',
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
