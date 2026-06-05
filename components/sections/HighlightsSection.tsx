"use client";

import { FadeIn } from "@/components/FadeIn";
import { SectionHeading } from "@/components/SectionHeading";
import { useDictionary } from "@/components/LocaleProvider";
import { montserrat, outfit } from "@/lib/theme";

const HIGHLIGHT_ICONS = {
  ship: (
    <polygon
      points="12,2 22,8 22,20 12,26 2,20 2,8"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    />
  ),
  crew: (
    <>
      <circle cx="12" cy="8" r="4" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M4 24c0-4 4-7 8-7s8 3 8 7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="20" cy="10" r="3" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M24 22c0-2.5-2-4.5-4-4.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </>
  ),
  learn: (
    <>
      <rect x="3" y="6" width="18" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 12v4" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 14h4" stroke="currentColor" strokeWidth="1.5" />
    </>
  ),
  win: (
    <path
      d="M12 2l2.4 7.4H22l-6 4.6 2.3 7L12 17l-6.3 4 2.3-7-6-4.6h7.6z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  ),
} as const;

export function HighlightsSection() {
  const { highlights } = useDictionary();

  return (
    <section id="highlights" className="relative border-t border-[#aaff00]/10 bg-[#030303] px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl">
        <FadeIn>
          <SectionHeading
            label={highlights.label}
            title={highlights.title}
            subtitle={highlights.subtitle}
          />
        </FadeIn>

        <div className="mt-16 grid gap-5 sm:grid-cols-2">
          {highlights.items.map((item, index) => (
            <FadeIn key={item.id} delay={index * 80}>
              <div className="group h-full rounded-2xl border border-white/8 bg-black/60 p-7 transition-colors duration-300 hover:border-[#aaff00]/30 hover:bg-[#aaff00]/[0.03]">
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-[#aaff00]/25 text-[#aaff00] transition-transform duration-300 group-hover:scale-110">
                  <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
                    {HIGHLIGHT_ICONS[item.id]}
                  </svg>
                </div>
                <h3
                  className="text-lg font-bold text-white"
                  style={{ fontFamily: montserrat }}
                >
                  {item.title}
                </h3>
                <p
                  className="mt-3 text-sm leading-relaxed text-white/55"
                  style={{ fontFamily: outfit }}
                >
                  {item.description}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
