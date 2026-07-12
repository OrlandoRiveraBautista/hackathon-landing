"use client";

import { useCallback, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, useAnimation } from "motion/react";
import ClickSpark from "@/components/reactbits/ClickSpark";
import { montserrat } from "@/lib/theme";

const TECH_TOKENS = [
  "{}",
  "</>",
  "0101",
  "3×",
  "git",
  "=>",
  "{ }",
  "npm",
  "dev",
  "API",
  "⚡",
  "[]",
  "fn()",
  "0110",
  "push",
  "run",
  "tsx",
  "sql",
];

const MAX_VISIBLE_PARTICLES = 18;
const PARTICLES_PER_TAP = 5;
const MIN_SPAWN_GAP_MS = 120;

type ViewportBurst = {
  id: number;
  startX: number;
  startY: number;
  dx: number;
  dy: number;
  text: string;
  rotate: number;
  duration: number;
  size: number;
};

type BoostButtonProps = {
  label: string;
  boostingLabel: string;
  boostedLabel: string;
  tapHint: string;
  interested: boolean;
  loading: boolean;
  tapCount: number;
  onPress: () => void;
};

function vibrate() {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate(10);
  }
}

function BoostParticleOverlay({
  bursts,
  onRemove,
}: {
  bursts: ViewportBurst[];
  onRemove: (id: number) => void;
}) {
  if (typeof document === "undefined") return null;

  return createPortal(
    <div className="pointer-events-none fixed inset-0 z-[200] overflow-hidden">
      {bursts.map((burst) => (
        <span
          key={burst.id}
          onAnimationEnd={() => onRemove(burst.id)}
          className="boost-token font-mono font-bold text-[#aaff00] drop-shadow-[0_0_8px_rgba(170,255,0,0.75)]"
          style={{
            left: burst.startX,
            top: burst.startY,
            fontSize: burst.size,
            ["--dx" as string]: `${burst.dx}px`,
            ["--dy" as string]: `${burst.dy}px`,
            ["--rotate" as string]: `${burst.rotate}deg`,
            ["--duration" as string]: `${burst.duration}s`,
          }}
        >
          {burst.text}
        </span>
      ))}
    </div>,
    document.body,
  );
}

export function BoostButton({
  label,
  boostingLabel,
  boostedLabel,
  tapHint,
  interested,
  loading,
  tapCount,
  onPress,
}: BoostButtonProps) {
  const [bursts, setBursts] = useState<ViewportBurst[]>([]);
  const burstId = useRef(0);
  const lastSpawnAt = useRef(0);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const controls = useAnimation();

  const removeBurst = useCallback((id: number) => {
    setBursts((current) => current.filter((burst) => burst.id !== id));
  }, []);

  const spawnBursts = useCallback(() => {
    const now = performance.now();
    if (now - lastSpawnAt.current < MIN_SPAWN_GAP_MS) {
      return;
    }
    lastSpawnAt.current = now;

    const button = buttonRef.current;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const startX = rect.left + rect.width / 2;
    const startY = rect.top + rect.height / 2;
    const maxReach = Math.max(window.innerWidth, window.innerHeight) * 0.55;

    const next = Array.from({ length: PARTICLES_PER_TAP }, () => {
      const angle = Math.random() * Math.PI * 2;
      const distance = maxReach * (0.35 + Math.random() * 0.65);
      burstId.current += 1;

      return {
        id: burstId.current,
        startX,
        startY,
        dx: Math.cos(angle) * distance,
        dy: Math.sin(angle) * distance,
        text: TECH_TOKENS[Math.floor(Math.random() * TECH_TOKENS.length)],
        rotate: -120 + Math.random() * 240,
        duration: 2.2 + Math.random() * 0.8,
        size: 11 + Math.floor(Math.random() * 5),
      };
    });

    setBursts((current) => [...current, ...next].slice(-MAX_VISIBLE_PARTICLES));
  }, []);

  const handlePress = () => {
    if (loading) return;

    spawnBursts();
    vibrate();
    void controls.start({
      scale: [1, 0.94, 1.04, 1],
      transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
    });
    onPress();
  };

  const displayLabel = loading
    ? boostingLabel
    : interested
      ? boostedLabel
      : label;

  return (
    <>
      <BoostParticleOverlay bursts={bursts} onRemove={removeBurst} />

      <div className="relative w-full [&>div]:!block [&>div]:!w-full">
        <ClickSpark
          sparkColor="#aaff00"
          sparkCount={10}
          sparkRadius={28}
          sparkSize={10}
          duration={480}
        >
          <motion.button
            ref={buttonRef}
            type="button"
            animate={controls}
            onClick={handlePress}
            disabled={loading}
            className={`boost-button w-full disabled:cursor-wait disabled:opacity-60 ${
              interested ? "boost-button--boosted" : "boost-button--idle"
            }`}
            style={{ fontFamily: montserrat }}
            whileHover={loading ? undefined : { scale: 1.01 }}
            whileTap={loading ? undefined : { scale: 0.97 }}
          >
            <span className="boost-button-face">
              <span className="boost-button-shine pointer-events-none" />
              <span className="boost-button-label">
                {displayLabel}
                {!loading && <span className="boost-button-arrow">→</span>}
              </span>
              {tapCount > 0 && (
                <span className="boost-button-count">×{tapCount}</span>
              )}
            </span>
          </motion.button>
        </ClickSpark>

        <p
          className="mt-3 text-center text-[10px] tracking-[0.14em] text-white/35"
          style={{ fontFamily: montserrat }}
        >
          {tapHint}
        </p>
      </div>
    </>
  );
}
