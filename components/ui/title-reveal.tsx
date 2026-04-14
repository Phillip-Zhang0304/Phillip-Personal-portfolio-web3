"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { ReactNode, RefObject } from "react";
import { useEffect } from "react";

type OnceTitleRevealProps = {
  children: ReactNode;
  className?: string;
};

type ScrollTitleRevealProps = {
  children: ReactNode;
  targetRef: RefObject<HTMLElement | HTMLDivElement | null>;
  className?: string;
  enabled?: boolean;
  distance?: number;
  startOffset?: number;
  smooth?: boolean;
  finishProgress?: number;
};

export function OnceTitleReveal({
  children,
  className = ""
}: OnceTitleRevealProps) {
  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className={className}
      initial={{ opacity: 0, y: 144 }}
      transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function ScrollTitleReveal({
  children,
  targetRef,
  className = "",
  enabled = true,
  distance = 400,
  startOffset = 0,
  smooth = true,
  finishProgress = 1
}: ScrollTitleRevealProps) {
  const progress = useMotionValue(0);
  const smoothProgress = useSpring(progress, {
    stiffness: 180,
    damping: 28,
    mass: 0.6
  });
  const sourceProgress = smooth ? smoothProgress : progress;
  const finish = Math.max(0.05, Math.min(1, finishProgress));
  const y = useTransform(sourceProgress, [0, finish], [distance, 0]);
  const opacity = useTransform(sourceProgress, [0, finish], [0, 1]);

  useEffect(() => {
    if (!enabled) {
      progress.set(0);
      return;
    }

    const updateProgress = () => {
      const element = targetRef.current;
      if (!element) {
        progress.set(0);
        return;
      }

      const rect = element.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 1;
      const raw = (viewportHeight - rect.top - startOffset) / viewportHeight;
      const next = Math.max(0, Math.min(1, raw));
      progress.set(next);
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);

    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, [enabled, progress, startOffset, targetRef]);

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: distance }}
      style={enabled ? { y, opacity } : { opacity: 0, y: distance }}
    >
      {children}
    </motion.div>
  );
}
