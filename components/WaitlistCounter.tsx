"use client";

import { useEffect, useRef, useState } from "react";
import { useWaitlistCount } from "@/components/WaitlistCountProvider";
import { montserrat } from "@/lib/theme";

type WaitlistCounterProps = {
  className?: string;
  size?: "sm" | "lg";
  showPlus?: boolean;
};

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

export function WaitlistCounter({
  className = "",
  size = "lg",
  showPlus = false,
}: WaitlistCounterProps) {
  const { count } = useWaitlistCount();
  const [display, setDisplay] = useState(0);
  const frameRef = useRef<number | null>(null);
  const displayRef = useRef(0);

  useEffect(() => {
    displayRef.current = display;
  }, [display]);

  useEffect(() => {
    if (count === null) return;

    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
    }

    const from = displayRef.current;
    const to = count;
    const duration = 900;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const next = Math.round(from + (to - from) * easeOutCubic(progress));
      setDisplay(next);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        frameRef.current = null;
      }
    };

    frameRef.current = requestAnimationFrame(tick);

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [count]);

  const sizeClass =
    size === "lg"
      ? "text-4xl sm:text-5xl"
      : "text-2xl sm:text-3xl";

  if (count === null) {
    return (
      <span
        className={`inline-block font-black text-[#aaff00]/40 ${sizeClass} ${className}`}
        style={{ fontFamily: montserrat }}
        aria-hidden="true"
      >
        —
      </span>
    );
  }

  const formatted = showPlus && display >= 10 ? `${display}+` : String(display);

  return (
    <span
      className={`inline-block font-black text-[#aaff00] tabular-nums ${sizeClass} ${className}`}
      style={{ fontFamily: montserrat }}
      aria-live="polite"
      aria-label={String(display)}
    >
      {formatted}
    </span>
  );
}
