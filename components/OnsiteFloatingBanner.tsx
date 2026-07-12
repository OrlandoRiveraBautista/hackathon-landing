"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { ArrowRight, MapPin, Users, X } from "lucide-react";
import { useDictionary, useLocale } from "@/components/LocaleProvider";
import { onsiteSelectionPath } from "@/lib/i18n";
import { montserrat, outfit } from "@/lib/theme";

const DISMISS_KEY = "buildpalnorte-onsite-banner-dismissed";

type SelectionPreview = {
  announced: boolean;
  selectedCount: number;
  interestedCount: number;
};

type OnsiteFloatingBannerProps = {
  visible?: boolean;
};

export function OnsiteFloatingBanner({ visible = true }: OnsiteFloatingBannerProps) {
  const { locale } = useLocale();
  const { onsiteBanner } = useDictionary();
  const [preview, setPreview] = useState<SelectionPreview | null>(null);
  const [ready, setReady] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    setDismissed(sessionStorage.getItem(DISMISS_KEY) === "1");
    setReady(true);
  }, []);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/onsite/selection")
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (!cancelled && data) {
          setPreview({
            announced: data.announced === true,
            selectedCount:
              typeof data.selectedCount === "number"
                ? data.selectedCount
                : Array.isArray(data.selected)
                  ? data.selected.length
                  : 0,
            interestedCount:
              typeof data.interestedCount === "number" ? data.interestedCount : 0,
          });
        }
      })
      .catch(() => {
        if (!cancelled) setPreview(null);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  function dismiss() {
    sessionStorage.setItem(DISMISS_KEY, "1");
    setDismissed(true);
  }

  const statusLine = preview?.announced
    ? onsiteBanner.announcedStat.replace("{count}", String(preview.selectedCount))
    : preview
      ? onsiteBanner.pendingStat.replace("{count}", String(preview.interestedCount))
      : onsiteBanner.capacityNote;

  const show = visible && ready && !dismissed;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="pointer-events-none fixed inset-x-0 bottom-0 z-[55] flex justify-center px-3 pb-3 sm:px-4 sm:pb-5"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 28 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            className="pointer-events-auto relative w-full max-w-4xl overflow-hidden rounded-2xl border border-[#aaff00]/30 bg-[#050505]/92 shadow-[0_0_60px_rgba(170,255,0,0.18),0_20px_50px_rgba(0,0,0,0.65)] backdrop-blur-xl sm:rounded-[22px]"
            role="region"
            aria-label={onsiteBanner.label}
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#aaff00]/70 to-transparent" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_120%_at_50%_0%,rgba(170,255,0,0.12)_0%,transparent_70%)]" />

            <button
              type="button"
              onClick={dismiss}
              className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-black/40 text-white/45 transition-colors hover:border-white/20 hover:text-white/80"
              aria-label={onsiteBanner.dismiss}
            >
              <X size={14} strokeWidth={2.5} />
            </button>

            <div className="relative grid gap-4 p-4 pr-12 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-6 sm:p-5 sm:pr-14">
              <div className="min-w-0">
                <span
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#aaff00]/25 bg-[#aaff00]/10 px-3 py-1 text-[9px] font-black tracking-[0.28em] text-[#aaff00] sm:text-[10px]"
                  style={{ fontFamily: montserrat }}
                >
                  <MapPin size={11} strokeWidth={2.5} />
                  {onsiteBanner.label}
                </span>

                <h2
                  className="mt-2 text-lg font-black tracking-tight text-white sm:text-xl"
                  style={{ fontFamily: montserrat }}
                >
                  {onsiteBanner.title}{" "}
                  <span className="text-[#aaff00]">{onsiteBanner.accentWord}</span>
                </h2>

                <p
                  className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-white/55 sm:text-sm"
                  style={{ fontFamily: outfit }}
                >
                  {onsiteBanner.body}
                </p>

                <p
                  className="mt-2 inline-flex items-center gap-1.5 text-[10px] font-black tracking-[0.14em] text-white/40 sm:text-[11px]"
                  style={{ fontFamily: montserrat }}
                >
                  <Users size={12} className="shrink-0 text-[#aaff00]/80" />
                  {statusLine}
                </p>
              </div>

              <Link
                href={onsiteSelectionPath(locale)}
                className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#aaff00] px-5 py-3 text-[11px] font-black tracking-[0.14em] text-black transition-all duration-200 hover:bg-[#c8ff40] hover:shadow-[0_0_32px_rgba(170,255,0,0.35)] sm:min-w-[220px] sm:rounded-2xl sm:px-6 sm:py-3.5 sm:text-xs"
                style={{ fontFamily: montserrat }}
              >
                {onsiteBanner.cta}
                <ArrowRight
                  size={16}
                  strokeWidth={2.5}
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
