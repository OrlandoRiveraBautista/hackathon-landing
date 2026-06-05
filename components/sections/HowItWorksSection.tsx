"use client";

import { FadeIn } from "@/components/FadeIn";
import { SectionHeading } from "@/components/SectionHeading";
import { useDictionary } from "@/components/LocaleProvider";
import { montserrat, outfit } from "@/lib/theme";

export function HowItWorksSection() {
  const { howItWorks } = useDictionary();

  return (
    <section id="how-it-works" className="relative scroll-mt-16 bg-black px-4 py-16 sm:px-6 sm:py-24 md:py-32">
      <div className="mx-auto max-w-5xl">
        <FadeIn>
          <SectionHeading
            label={howItWorks.label}
            title={howItWorks.title}
            subtitle={howItWorks.subtitle}
          />
        </FadeIn>

        <div className="relative mt-12 sm:mt-16">
          <div
            className="absolute left-[27px] top-8 hidden h-[calc(100%-4rem)] w-px bg-gradient-to-b from-[#aaff00]/50 via-[#aaff00]/20 to-transparent md:block"
            aria-hidden="true"
          />

          <div className="space-y-8">
            {howItWorks.steps.map((item, index) => (
              <FadeIn key={item.step} delay={index * 100}>
                <div className="flex gap-4 sm:gap-6 md:gap-10">
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#aaff00]/40 bg-[#aaff00]/10 text-sm font-black text-[#aaff00] sm:h-14 sm:w-14"
                    style={{ fontFamily: montserrat }}
                  >
                    {item.step}
                  </div>
                  <div className="pb-4 pt-2">
                    <h3
                      className="text-xl font-bold text-white"
                      style={{ fontFamily: montserrat }}
                    >
                      {item.title}
                    </h3>
                    <p
                      className="mt-2 max-w-lg text-base leading-relaxed text-white/55"
                      style={{ fontFamily: outfit }}
                    >
                      {item.description}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
