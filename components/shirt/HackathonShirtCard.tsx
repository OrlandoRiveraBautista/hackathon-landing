"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check } from "lucide-react";
import { SHIRT_SIZE_OPTIONS } from "@/lib/shirt-size";
import type { ShirtSize } from "@/lib/shirt-size";
import { montserrat, outfit } from "@/lib/theme";

const SHIRT_IMAGE = "/shirt-design.jpeg";
const SHIRT_LAYOUT_ID = "shirt-design-preview";
const EASE = [0.22, 1, 0.36, 1] as const;

export type HackathonShirtCopy = {
  label: string;
  title: string;
  accentWord: string;
  body: string;
  hint: string;
  sizeLabel: string;
  saveButton: string;
  savingButton: string;
  savedMessage: string;
  registerCta: string;
  registerHint: string;
  signInPrompt: string;
  signInCta: string;
  currentSize: string;
  expandImage: string;
  closeImage: string;
};

type HackathonShirtCardProps = {
  copy: HackathonShirtCopy;
  variant: "landing" | "boost";
  shirtSize?: ShirtSize | null;
  selectedSize?: string;
  onSelectSize?: (size: ShirtSize) => void;
  onSave?: () => void;
  saving?: boolean;
  saved?: boolean;
  signedIn?: boolean | null;
  onRegister?: () => void;
  loginHref?: string;
  className?: string;
};

export function HackathonShirtCard({
  copy,
  variant,
  shirtSize = null,
  selectedSize = "",
  onSelectSize,
  onSave,
  saving = false,
  saved = false,
  signedIn = null,
  onRegister,
  loginHref,
  className = "",
}: HackathonShirtCardProps) {
  const isLanding = variant === "landing";
  const canPickSize = variant === "boost" && signedIn === true;
  const showLogin = variant === "boost" && signedIn === false;
  const [expanded, setExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    setMounted(true);
  }, []);

  function openLightbox() {
    document.body.style.overflow = "hidden";
    setExpanded(true);
  }

  function closeLightbox() {
    setExpanded(false);
  }

  useEffect(() => {
    if (!expanded) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeLightbox();
      }
    }

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [expanded]);

  const imageAlt = `${copy.title} ${copy.accentWord}`;

  return (
    <>
      <div
        className={`relative overflow-hidden rounded-3xl border border-[#aaff00]/20 bg-[#050505] ${className}`}
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#aaff00]/50 to-transparent" />
        <div className="pointer-events-none absolute -right-16 top-0 h-48 w-48 rounded-full bg-[#aaff00]/8 blur-3xl" />

        <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[minmax(0,220px)_1fr] lg:items-center lg:gap-8">
          <div className="relative mx-auto w-full max-w-[220px] lg:mx-0">
            <button
              type="button"
              onClick={openLightbox}
              className="group block w-full cursor-zoom-in overflow-hidden rounded-2xl border border-white/10 bg-black/40 shadow-[0_20px_60px_rgba(0,0,0,0.45)] transition-colors hover:border-[#aaff00]/35 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#aaff00]"
              aria-label={copy.expandImage}
            >
              {!expanded && (
                <motion.div
                  layoutId={shouldReduceMotion ? undefined : SHIRT_LAYOUT_ID}
                  className="overflow-hidden rounded-2xl"
                  transition={{ type: "spring", stiffness: 320, damping: 34 }}
                >
                  <Image
                    src={SHIRT_IMAGE}
                    alt={imageAlt}
                    width={440}
                    height={520}
                    className="h-auto w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    priority={isLanding}
                  />
                </motion.div>
              )}
              {expanded && (
                <div
                  className="aspect-[440/520] w-full rounded-2xl bg-black/25"
                  aria-hidden
                />
              )}
            </button>
          </div>

          <div className="min-w-0">
            <span
              className="text-[10px] font-black tracking-[0.28em] text-[#aaff00]/90"
              style={{ fontFamily: montserrat }}
            >
              {copy.label}
            </span>

            <h2
              className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl"
              style={{ fontFamily: montserrat }}
            >
              {copy.title}{" "}
              <span className="text-[#aaff00]">{copy.accentWord}</span>
            </h2>

            <p
              className="mt-2 text-sm leading-relaxed text-white/60 sm:text-base"
              style={{ fontFamily: outfit }}
            >
              {copy.body}
            </p>

            <p
              className="mt-2 text-xs text-white/40"
              style={{ fontFamily: outfit }}
            >
              {copy.hint}
            </p>

            {canPickSize && (
              <div className="mt-5 space-y-4">
                {shirtSize && (
                  <p
                    className="inline-flex items-center gap-2 rounded-full border border-[#aaff00]/25 bg-[#aaff00]/10 px-3 py-1.5 text-[10px] font-black tracking-[0.12em] text-[#aaff00]"
                    style={{ fontFamily: montserrat }}
                  >
                    <Check size={12} strokeWidth={2.5} />
                    {copy.currentSize.replace("{size}", shirtSize)}
                  </p>
                )}

                <div>
                  <p
                    className="mb-2 text-[10px] font-black tracking-[0.22em] text-white/35"
                    style={{ fontFamily: montserrat }}
                  >
                    {copy.sizeLabel}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {SHIRT_SIZE_OPTIONS.map((size) => {
                      const active = selectedSize === size;
                      return (
                        <button
                          key={size}
                          type="button"
                          onClick={() => onSelectSize?.(size)}
                          className={`min-w-[3rem] rounded-xl border px-3 py-2 text-xs font-black tracking-[0.12em] transition-all ${
                            active
                              ? "border-[#aaff00] bg-[#aaff00] text-black shadow-[0_0_20px_rgba(170,255,0,0.25)]"
                              : "border-white/10 bg-white/[0.03] text-white/55 hover:border-[#aaff00]/30 hover:text-white"
                          }`}
                          style={{ fontFamily: montserrat }}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onSave}
                  disabled={!selectedSize || saving}
                  className="inline-flex items-center justify-center rounded-xl border border-[#aaff00]/35 bg-[#aaff00]/12 px-5 py-2.5 text-[11px] font-black tracking-[0.14em] text-[#aaff00] transition-all hover:border-[#aaff00]/55 hover:bg-[#aaff00]/20 disabled:cursor-not-allowed disabled:opacity-45"
                  style={{ fontFamily: montserrat }}
                >
                  {saving ? copy.savingButton : copy.saveButton}
                </button>

                {saved && (
                  <p
                    className="text-xs text-[#aaff00]/80"
                    style={{ fontFamily: outfit }}
                  >
                    {copy.savedMessage}
                  </p>
                )}
              </div>
            )}

            {isLanding && (
              <div className="mt-5 space-y-2">
                <button
                  type="button"
                  onClick={onRegister}
                  className="inline-flex items-center justify-center rounded-xl bg-[#aaff00] px-5 py-3 text-[11px] font-black tracking-[0.14em] text-black transition-all hover:bg-[#c8ff40]"
                  style={{ fontFamily: montserrat }}
                >
                  {copy.registerCta}
                </button>
                <p
                  className="text-[11px] text-white/40"
                  style={{ fontFamily: outfit }}
                >
                  {copy.registerHint}
                </p>
              </div>
            )}

            {showLogin && loginHref && (
              <div className="mt-5 space-y-2">
                <p
                  className="text-xs text-white/45"
                  style={{ fontFamily: outfit }}
                >
                  {copy.signInPrompt}
                </p>
                <Link
                  href={loginHref}
                  className="inline-flex items-center justify-center rounded-xl border border-[#aaff00]/35 bg-[#aaff00]/10 px-5 py-2.5 text-[11px] font-black tracking-[0.14em] text-[#aaff00] transition-all hover:border-[#aaff00]/55 hover:bg-[#aaff00]/15"
                  style={{ fontFamily: montserrat }}
                >
                  {copy.signInCta}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {mounted &&
        createPortal(
          <AnimatePresence
            onExitComplete={() => {
              document.body.style.overflow = "";
            }}
          >
            {expanded && (
              <>
                <motion.button
                  type="button"
                  key="shirt-lightbox-backdrop"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: shouldReduceMotion ? 0.15 : 0.35, ease: EASE }}
                  className="fixed inset-0 z-[200] cursor-zoom-out bg-black/90 backdrop-blur-xl"
                  onClick={closeLightbox}
                  aria-label={copy.closeImage}
                />

                <motion.div
                  key="shirt-lightbox-stage"
                  className="pointer-events-none fixed inset-0 z-[201] flex items-center justify-center p-4 sm:p-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: shouldReduceMotion ? 0.15 : 0.25, ease: EASE }}
                >
                  <motion.div
                    layoutId={shouldReduceMotion ? undefined : SHIRT_LAYOUT_ID}
                    initial={shouldReduceMotion ? { opacity: 0, scale: 0.94 } : undefined}
                    animate={shouldReduceMotion ? { opacity: 1, scale: 1 } : undefined}
                    exit={shouldReduceMotion ? { opacity: 0, scale: 0.96 } : undefined}
                    transition={
                      shouldReduceMotion
                        ? { duration: 0.2, ease: EASE }
                        : { type: "spring", stiffness: 320, damping: 34 }
                    }
                    className="pointer-events-auto relative max-h-[min(90vh,900px)] max-w-[min(92vw,720px)] overflow-hidden rounded-2xl shadow-[0_0_80px_rgba(170,255,0,0.18),0_30px_80px_rgba(0,0,0,0.65)]"
                    onClick={(event) => event.stopPropagation()}
                    role="dialog"
                    aria-modal="true"
                    aria-label={copy.expandImage}
                  >
                    <Image
                      src={SHIRT_IMAGE}
                      alt={imageAlt}
                      width={1200}
                      height={1420}
                      className="max-h-[min(90vh,900px)] w-auto max-w-full object-contain"
                      sizes="92vw"
                      priority
                    />
                  </motion.div>
                </motion.div>

                <motion.div
                  key="shirt-lightbox-close"
                  className="fixed right-4 top-4 z-[202] sm:right-6 sm:top-6"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{
                    duration: shouldReduceMotion ? 0.12 : 0.28,
                    delay: shouldReduceMotion ? 0 : 0.12,
                    ease: EASE,
                  }}
                >
                  <button
                    type="button"
                    onClick={closeLightbox}
                    className="rounded-xl border border-white/15 bg-white/[0.06] px-4 py-2 text-[10px] font-black tracking-[0.18em] text-white/70 transition-colors hover:border-white/30 hover:text-white"
                    style={{ fontFamily: montserrat }}
                  >
                    {copy.closeImage}
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
