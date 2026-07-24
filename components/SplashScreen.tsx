"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { montserrat, accent } from "@/lib/theme";
import { prefersReducedMotion } from "@/lib/motion";
import { PeserosCredit } from "@/components/PeserosCredit";
import { BrandLogo } from "@/components/BrandLogo";

type SplashScreenProps = {
  /** Called once wipe panels start sliding away — triggers hero animation */
  onReady: () => void;
  /** Called once splash is fully off-screen — removes it from the DOM */
  onComplete: () => void;
};

const BOOT_LINES = [
  { text: "INITIALIZING RUNTIME…", color: "accent" },
  { text: "LOADING ASSET MANIFESTS… [OK]", color: "ok" },
  { text: "CONNECTING TO GRID… [OK]", color: "ok" },
  { text: "VERIFYING CLEARANCE… [OK]", color: "ok" },
  { text: "ENVIRONMENT: HACKATHON_MAIN", color: "dim" },
  { text: "ALL SYSTEMS NOMINAL. LAUNCHING.", color: "accent" },
];

/* ── loading bar ─────────────────────────────────────────────── */
function LoadingBar({ progress }: { progress: number }) {
  return (
    <div className="relative h-px w-full overflow-hidden bg-white/10">
      <div
        style={{
          position: "absolute",
          inset: "0 auto 0 0",
          width: `${progress}%`,
          background: `linear-gradient(90deg, rgba(170,255,0,0.4) 0%, ${accent} 100%)`,
          boxShadow: `0 0 10px 1px rgba(170,255,0,0.5)`,
          transition: "width 0.07s linear",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: `${progress}%`,
          height: 12,
          width: 12,
          transform: "translate(-50%, -50%)",
          borderRadius: "9999px",
          background: accent,
          boxShadow: `0 0 12px 4px rgba(170,255,0,0.8)`,
          opacity: progress > 0 && progress < 100 ? 1 : 0,
          transition: "left 0.07s linear, opacity 0.2s",
        }}
      />
    </div>
  );
}

/* ── main component ──────────────────────────────────────────── */
export function SplashScreen({ onReady, onComplete }: SplashScreenProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const cubeRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const termRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  const [visibleLines, setVisibleLines] = useState<number[]>([]);
  const [progress, setProgress] = useState(0);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion()) {
      onReady();
      onComplete();
      return;
    }

    const els = {
      root: rootRef.current,
      content: contentRef.current,
      cube: cubeRef.current,
      title: titleRef.current,
      bar: barRef.current,
      term: termRef.current,
    };
    if (Object.values(els).some((e) => !e)) return;
    const { root, content, cube, title, bar, term } = els as Required<
      typeof els
    >;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      /* hero animates underneath the whole time */
      tl.call(() => onReady(), undefined, 0);

      /* ── entrance ── */
      tl.fromTo(
        content,
        { opacity: 0 },
        { opacity: 1, duration: 0.2, ease: "power2.out" },
      );
      tl.fromTo(
        cube,
        { opacity: 0, scale: 0.55, y: 14 },
        { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "back.out(1.7)" },
        "-=0.05",
      );
      tl.fromTo(
        title,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" },
        "-=0.3",
      );
      tl.fromTo(
        bar,
        { opacity: 0 },
        { opacity: 1, duration: 0.25, ease: "power2.out" },
        "-=0.15",
      );
      tl.fromTo(
        term,
        { opacity: 0, y: 6 },
        { opacity: 1, y: 0, duration: 0.25, ease: "power2.out" },
        "-=0.1",
      );

      /* ── boot lines stagger ── */
      BOOT_LINES.forEach((_, i) => {
        tl.call(
          () => setVisibleLines((p) => [...p, i]),
          undefined,
          `+=${i === 0 ? 0.05 : 0.16}`,
        );
      });

      /* ── progress bar (in parallel) ── */
      const proxy = { v: 0 };
      tl.to(
        proxy,
        {
          v: 100,
          duration: 1.1,
          ease: "power1.inOut",
          onUpdate() {
            const p = Math.round(proxy.v);
            setProgress(p);
            setPct(p);
          },
          onComplete() {
            setProgress(100);
            setPct(100);
          },
        },
        "<-=0.9",
      );

      /* ── hold at 100% ── */
      tl.to(proxy, { duration: 0.2 });

      /* ── cube pulse ── */
      tl.to(cube, {
        scale: 1.18,
        duration: 0.15,
        ease: "power2.out",
        yoyo: true,
        repeat: 1,
      });

      /* ── exit: fade entire overlay — hero is already animating below ── */
      tl.to(
        root,
        { opacity: 0, duration: 0.38, ease: "power2.inOut" },
        "+=0.05",
      );

      /* ── done: remove from DOM ── */
      tl.call(() => onComplete(), undefined, "+=0.02");
    }, root!);

    return () => ctx.revert();
  }, [onReady, onComplete]);

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[9999] overflow-hidden bg-black"
      role="status"
      aria-label="Loading"
    >
      {/* ── backdrop (glows, grid, scan line) — fades out with splash ── */}
      <div ref={backdropRef} className="absolute inset-0">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#aaff00]/6 blur-[100px]" />
          <div className="absolute left-[20%] top-[15%]  h-56 w-56 rounded-full bg-[#aaff00]/4 blur-[80px]" />
          <div className="absolute right-[18%] bottom-[20%] h-48 w-48 rounded-full bg-[#aaff00]/3 blur-[70px]" />
        </div>

        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(170,255,0,0.12) 1px, transparent 1px)",
            backgroundSize: "36px 36px",
            maskImage:
              "radial-gradient(ellipse 75% 75% at 50% 50%, black 0%, transparent 100%)",
          }}
        />

        <div
          className="pointer-events-none absolute inset-0 overflow-hidden"
          aria-hidden
        >
          <div className="splash-scanline absolute left-0 right-0 h-px" />
        </div>
      </div>

      {/* ── content ── */}
      <div
        ref={contentRef}
        className="relative flex h-full flex-col items-center justify-center px-6"
        style={{ opacity: 0 }}
      >
        {/* cube */}
        <div ref={cubeRef} className="mb-7" style={{ opacity: 0 }}>
          <BrandLogo
            size={56}
            priority
            imageClassName="shadow-[0_0_18px_rgba(170,255,0,0.65)]"
          />
        </div>

        {/* title */}
        <div ref={titleRef} className="mb-1 text-center" style={{ opacity: 0 }}>
          <h1
            className="text-2xl font-black uppercase tracking-[0.35em] sm:text-3xl"
            style={{
              fontFamily: montserrat,
              color: accent,
              textShadow:
                "0 0 32px rgba(170,255,0,0.55), 0 0 70px rgba(170,255,0,0.25)",
            }}
          >
            HACKATHON
          </h1>
          <p
            className="mt-1 text-[11px] tracking-[0.55em] uppercase text-white/35"
            style={{ fontFamily: montserrat }}
          >
            SYSTEM BOOT SEQUENCE
          </p>
        </div>

        <div className="mb-8 h-px w-16 bg-[#aaff00]/20" />

        {/* progress bar */}
        <div
          ref={barRef}
          className="mb-5 w-full max-w-sm"
          style={{ opacity: 0 }}
        >
          <div className="mb-2 flex items-center justify-between">
            <span
              className="text-[9px] tracking-[0.35em] uppercase text-white/30"
              style={{ fontFamily: montserrat }}
            >
              LOADING
            </span>
            <span
              className="text-[9px] tracking-[0.2em] tabular-nums"
              style={{ fontFamily: montserrat, color: accent }}
            >
              {pct}%
            </span>
          </div>
          <LoadingBar progress={progress} />
        </div>

        {/* terminal */}
        <div
          ref={termRef}
          className="w-full max-w-sm overflow-hidden rounded-xl border border-[#aaff00]/15 bg-black/70 p-4 backdrop-blur-sm"
          style={{
            fontFamily: "var(--font-geist-mono), monospace",
            opacity: 0,
          }}
        >
          <div className="mb-2.5 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-red-500/60" />
            <span className="h-2 w-2 rounded-full bg-yellow-400/60" />
            <span className="h-2 w-2 rounded-full bg-[#aaff00]/60" />
            <span
              className="ml-2 text-[9px] tracking-[0.3em] uppercase text-white/25"
              style={{ fontFamily: montserrat }}
            >
              BOOT LOG
            </span>
          </div>
          <div className="space-y-0.5 text-[11px] sm:text-xs">
            {BOOT_LINES.map((line, i) => {
              const on = visibleLines.includes(i);
              return (
                <div
                  key={i}
                  style={{
                    opacity: on ? 1 : 0,
                    transform: on ? "translateY(0)" : "translateY(6px)",
                    transition: "opacity 0.2s, transform 0.2s",
                    color:
                      line.color === "accent"
                        ? accent
                        : line.color === "ok"
                          ? "rgba(170,255,0,0.75)"
                          : "rgba(255,255,255,0.35)",
                  }}
                >
                  <span style={{ color: "rgba(255,255,255,0.2)" }}>&gt; </span>
                  {line.text}
                </div>
              );
            })}
          </div>
        </div>

        <div className="absolute bottom-6 flex flex-col items-center gap-3">
          <PeserosCredit variant="stacked" />
          <p
            className="text-[9px] tracking-[0.3em] uppercase text-white/15"
            style={{ fontFamily: montserrat }}
          >
            V1.0.0 · BUILD 2026
          </p>
        </div>
      </div>

      <style>{`
        .splash-scanline {
          background: linear-gradient(90deg, transparent, rgba(170,255,0,0.55), transparent);
          box-shadow: 0 0 10px 1px rgba(170,255,0,0.3);
          animation: splash-scan 2.5s linear infinite;
        }
        @keyframes splash-scan {
          0%   { top: -1px; opacity: 0; }
          4%   { opacity: 1; }
          96%  { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
}
