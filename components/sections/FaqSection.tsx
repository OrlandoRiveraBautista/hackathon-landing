"use client";

import { useState } from "react";
import { FadeIn } from "@/components/FadeIn";
import { SectionHeading } from "@/components/SectionHeading";
import { useDictionary } from "@/components/LocaleProvider";
import { montserrat, outfit } from "@/lib/theme";

export function FaqSection() {
  const { faq } = useDictionary();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="relative border-t border-[#aaff00]/10 bg-[#030303] px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-3xl">
        <FadeIn>
          <SectionHeading
            label={faq.label}
            title={faq.title}
            subtitle={faq.subtitle}
          />
        </FadeIn>

        <div className="mt-14 space-y-3">
          {faq.items.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <FadeIn key={item.question} delay={index * 60}>
                <div
                  className={`overflow-hidden rounded-xl border transition-colors duration-300 ${
                    isOpen
                      ? "border-[#aaff00]/30 bg-[#aaff00]/[0.04]"
                      : "border-white/8 bg-black/40"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                    aria-expanded={isOpen}
                  >
                    <span
                      className="text-base font-semibold text-white"
                      style={{ fontFamily: montserrat }}
                    >
                      {item.question}
                    </span>
                    <span
                      className={`shrink-0 text-[#aaff00] transition-transform duration-300 ${
                        isOpen ? "rotate-45" : ""
                      }`}
                      aria-hidden="true"
                    >
                      +
                    </span>
                  </button>
                  <div
                    className={`grid transition-all duration-300 ease-out ${
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p
                        className="px-6 pb-5 text-sm leading-relaxed text-white/60"
                        style={{ fontFamily: outfit }}
                      >
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
