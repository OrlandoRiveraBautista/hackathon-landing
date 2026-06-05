"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useDictionary } from "@/components/LocaleProvider";
import { WaitlistCounter } from "@/components/WaitlistCounter";
import { HERO_EASE, prefersReducedMotion } from "@/lib/motion";
import { useIsMobile } from "@/lib/useMediaQuery";
import { outfit } from "@/lib/theme";
import StarBorder from "./reactbits/StarBorder";
import ClickSpark from "./reactbits/ClickSpark";
import Cubes from "./reactbits/Cubes";
import R3FBlob from "./reactbits/R3FBlob";

type AnimatedHeroProps = {
  onRegisterClick: () => void;
};

/* ─────────────────────────────────────────────────────────────────────────
   AnimatedHero
   ───────────────────────────────────────────────────────────────────────── */
export function AnimatedHero({ onRegisterClick }: AnimatedHeroProps) {
  const dictionary = useDictionary();
  const isMobile = useIsMobile();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const cubes = root.querySelector(".hero-cubes-layer");
      const svg = root.querySelector(".hero-svg-layer");
      const blobClaw = root.querySelector(".hero-blob-claw .hero-blob-inner");
      const blobMushroom = root.querySelector(
        ".hero-blob-mushroom .hero-blob-inner",
      );
      const shapes = root.querySelectorAll(".hero-deco-shape");
      const sparkles = root.querySelectorAll(".hero-deco-sparkle");
      const titleLines = root.querySelectorAll(".hero-title-line");
      const fadeItems = root.querySelectorAll(".hero-fade-item");
      const ctaLines = root.querySelectorAll(".hero-cta-line");

      const tl = gsap.timeline({ defaults: { ease: HERO_EASE } });

      tl.to(cubes, { opacity: 1, duration: 1.1 })
        .to(
          svg,
          { opacity: isMobile ? 0.6 : 1, duration: 0.95 },
          "-=0.85",
        )
        .to(
          blobClaw,
          { opacity: 1, y: 0, scale: 1, duration: 1.05 },
          "-=0.7",
        )
        .to(
          blobMushroom,
          { opacity: 1, y: 0, scale: 1, duration: 1.05 },
          "-=0.95",
        )
        .to(
          shapes,
          { opacity: 1, scale: 1, duration: 0.65, stagger: 0.1, ease: "back.out(1.6)" },
          "-=0.55",
        )
        .to(
          sparkles,
          { opacity: 1, scale: 1, duration: 0.5, stagger: 0.07, ease: "back.out(2)" },
          "-=0.4",
        )
        .to(
          titleLines,
          { opacity: 1, y: 0, duration: 0.9, stagger: 0.12 },
          "-=0.35",
        )
        .to(
          fadeItems,
          { opacity: 1, y: 0, duration: 0.85, stagger: 0.08 },
          "-=0.5",
        )
        .to(
          ctaLines,
          { scaleX: 1, duration: 0.55, stagger: 0.08 },
          "-=0.45",
        );
    }, root);

    return () => ctx.revert();
  }, [isMobile]);

  return (
    <div
      ref={rootRef}
      className="relative flex min-h-[100dvh] w-full items-center justify-center overflow-hidden bg-black"
    >
      {/* Cubes background */}
      <div
        className="hero-cubes-layer absolute inset-0 z-0"
        style={{ height: "100%", width: "100%" }}
      >
        <Cubes
          gridSize={isMobile ? 8 : 12}
          maxAngle={isMobile ? 22 : 28}
          radius={isMobile ? 2 : 3}
          borderStyle="1px solid rgba(170,255,0,0.12)"
          faceColor="#070c02"
          rippleColor="#aaff00"
          rippleSpeed={3}
          autoAnimate
          shadow={false}
        />
      </div>

      {/* SVG layer: orbital rings, neon shapes, sparkles */}
      <svg
        viewBox="0 0 800 800"
        className="hero-svg-layer pointer-events-none absolute inset-0 z-10 hidden h-full w-full opacity-60 sm:block sm:opacity-100"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <symbol id="sp" viewBox="-12 -12 24 24">
            <path
              d="M0,-12 L1.5,-1.5 L12,0 L1.5,1.5 L0,12 L-1.5,1.5 L-12,0 L-1.5,-1.5 Z"
              fill="white"
            />
          </symbol>
        </defs>

        <g
          className="hero-deco-orbit"
          fill="none"
          stroke="white"
          strokeWidth="0.8"
          opacity="0.45"
        >
          <ellipse cx="400" cy="370" rx="255" ry="168">
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 400 370"
              to="360 400 370"
              dur="34s"
              repeatCount="indefinite"
            />
          </ellipse>
          <ellipse cx="400" cy="370" rx="215" ry="140">
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="360 400 370"
              to="0 400 370"
              dur="26s"
              repeatCount="indefinite"
            />
          </ellipse>
        </g>

        {/* Left: isometric 3D cube */}
        <g className="hero-deco-shape">
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0,0; 0,-9; 0,0"
            dur="4.5s"
            repeatCount="indefinite"
          />
          <polygon points="148,320 193,296 238,320 193,344" fill="#aaff00" />
          <polygon points="148,320 193,344 193,386 148,362" fill="#77cc00" />
          <polygon points="193,344 238,320 238,362 193,386" fill="#55aa00" />
        </g>

        {/* Top right: flat tilted square */}
        <g className="hero-deco-shape">
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0,0; 0,-7; 0,0"
            dur="3.8s"
            repeatCount="indefinite"
          />
          <rect
            x="510"
            y="140"
            width="54"
            height="54"
            fill="#aaff00"
            transform="rotate(-12 537 167)"
          />
        </g>

        {/* Bottom right: lightning bolt */}
        <g className="hero-deco-shape">
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0,0; 0,8; 0,0"
            dur="5.2s"
            repeatCount="indefinite"
          />
          <polygon
            points="585,478 618,446 640,478 668,446 674,520 642,494 618,528 603,500"
            fill="#aaff00"
          />
        </g>

        {/* Sparkles */}
        <g className="hero-deco-sparkle" transform="translate(293 290)">
          <use href="#sp" width="11" height="11" x="-5.5" y="-5.5">
            <animate
              attributeName="opacity"
              values="1;0.1;1"
              dur="2.7s"
              repeatCount="indefinite"
            />
          </use>
        </g>
        <g className="hero-deco-sparkle" transform="translate(514 308)">
          <use href="#sp" width="22" height="22" x="-11" y="-11">
            <animate
              attributeName="opacity"
              values="1;0.15;1"
              dur="3.1s"
              repeatCount="indefinite"
            />
          </use>
        </g>
        <g className="hero-deco-sparkle" transform="translate(280 488)">
          <use href="#sp" width="9" height="9" x="-4.5" y="-4.5">
            <animate
              attributeName="opacity"
              values="0.8;0.05;0.8"
              dur="2.3s"
              begin="0.6s"
              repeatCount="indefinite"
            />
          </use>
        </g>
        <g className="hero-deco-sparkle" transform="translate(570 482)">
          <use href="#sp" width="14" height="14" x="-7" y="-7">
            <animate
              attributeName="opacity"
              values="0.9;0.1;0.9"
              dur="3.5s"
              begin="1.1s"
              repeatCount="indefinite"
            />
          </use>
        </g>
      </svg>

      {/* Top blob — claw/boomerang shape over "Build" */}
      <div className="hero-blob-claw pointer-events-none absolute z-20">
        <div className="hero-blob-inner">
          <R3FBlob
            variant="claw"
            width={isMobile ? 400 : 440}
            height={isMobile ? 230 : 250}
          />
        </div>
      </div>

      {/* Bottom blob — mushroom/teardrop shape under "Pa'l Norte" */}
      <div className="hero-blob-mushroom pointer-events-none absolute z-20">
        <div className="hero-blob-inner">
          <R3FBlob
            variant="mushroom"
            width={isMobile ? 205 : 210}
            height={isMobile ? 350 : 360}
          />
        </div>
      </div>

      {/* Foreground: title, tagline, button */}
      <div className="relative z-30 flex w-full max-w-2xl flex-col items-center px-4 pt-20 pb-10 text-center sm:px-6 sm:pt-0 sm:pb-0">
        <h1
          className="leading-[0.92] text-white"
          style={{
            fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            fontWeight: 900,
            fontSize: "clamp(2.75rem, 11vw, 7.5rem)",
            letterSpacing: "-0.03em",
          }}
        >
          <span className="hero-title-line block">Build</span>
          <span className="hero-title-line block">Pa&apos;l Norte</span>
        </h1>

        <p
          className="hero-fade-item mt-6 max-w-xs text-sm tracking-[0.15em] text-white sm:mt-10 sm:max-w-none sm:text-[17px] sm:tracking-[0.22em]"
          style={{
            fontFamily: "var(--font-outfit), Outfit, sans-serif",
            fontWeight: 400,
            opacity: 0.9,
          }}
        >
          {dictionary.hero.tagline}
        </p>

        <p
          className="hero-fade-item mt-3 text-xs tracking-[0.2em] text-[#aaff00]/80 sm:mt-4 sm:text-sm sm:tracking-[0.3em]"
          style={{ fontFamily: outfit }}
        >
          {dictionary.hero.location}
        </p>

        <div className="hero-fade-item mt-5 flex flex-col items-center gap-1 sm:mt-6 sm:flex-row sm:items-baseline sm:gap-2">
          <WaitlistCounter size="sm" />
          <span
            className="text-xs tracking-[0.15em] text-white/55 sm:text-sm sm:tracking-[0.2em]"
            style={{ fontFamily: outfit }}
          >
            {dictionary.hero.waitlistLabel}
          </span>
        </div>

        <div className="hero-fade-item mt-8 flex w-full max-w-sm items-center sm:mt-10 sm:max-w-none">
          <div className="hero-cta-line h-px flex-1 bg-[#aaff00]" />
          <ClickSpark
            sparkColor="#aaff00"
            sparkCount={8}
            sparkRadius={22}
            extraScale={1.3}
          >
            <StarBorder
              as="button"
              type="button"
              onClick={onRegisterClick}
              color="#aaff00"
              speed="5s"
              thickness={1}
              className="cursor-pointer"
              style={{
                fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
              }}
            >
              {dictionary.hero.registerNow}
            </StarBorder>
          </ClickSpark>
          <div className="hero-cta-line h-px flex-1 bg-[#aaff00]" />
        </div>
      </div>

      <style>{`
        .hero-blob-claw {
          top: 50%;
          left: 50%;
          transform: translate(-58%, -125%) scale(0.95);
        }
        .hero-blob-mushroom {
          top: 50%;
          left: 50%;
          transform: translate(4%, 2%) scale(0.95);
        }
        @media (min-width: 640px) {
          .hero-blob-claw {
            transform: translate(-58%, -128%) scale(1);
          }
          .hero-blob-mushroom {
            transform: translate(5%, 0%) scale(1);
          }
        }
        @media (min-width: 768px) {
          .hero-blob-claw {
            transform: translate(-58%, -128%) scale(1);
          }
          .hero-blob-mushroom {
            transform: translate(6%, 0%) scale(1);
          }
        }
      `}</style>
    </div>
  );
}
