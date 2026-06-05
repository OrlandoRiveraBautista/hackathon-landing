"use client";

import { FadeIn } from "@/components/FadeIn";
import { SectionHeading } from "@/components/SectionHeading";
import { useDictionary } from "@/components/LocaleProvider";
import { WaitlistCounter } from "@/components/WaitlistCounter";
import { montserrat, outfit } from "@/lib/theme";

export function AboutSection() {
  const dictionary = useDictionary();
  const { about } = dictionary;

  return (
    <section id="about" className="relative bg-black px-6 py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(170,255,0,0.04)_0%,transparent_70%)]" />

      <div className="relative mx-auto max-w-5xl">
        <FadeIn>
          <SectionHeading
            label={about.label}
            title={about.title}
            subtitle={about.subtitle}
          />
        </FadeIn>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          <FadeIn delay={80}>
            <div className="rounded-2xl border border-[#aaff00]/15 bg-white/[0.02] p-8 backdrop-blur-sm">
              <p
                className="text-xs tracking-[0.35em] text-[#aaff00]"
                style={{ fontFamily: outfit }}
              >
                {about.whatIsIt}
              </p>
              <p
                className="mt-4 text-lg leading-relaxed text-white/70"
                style={{ fontFamily: outfit }}
              >
                {about.whatIsItBody}
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={160}>
            <div className="rounded-2xl border border-[#aaff00]/15 bg-white/[0.02] p-8 backdrop-blur-sm">
              <p
                className="text-xs tracking-[0.35em] text-[#aaff00]"
                style={{ fontFamily: outfit }}
              >
                {about.whoIsItFor}
              </p>
              <p
                className="mt-4 text-lg leading-relaxed text-white/70"
                style={{ fontFamily: outfit }}
              >
                {about.whoIsItForBody}
              </p>
            </div>
          </FadeIn>
        </div>

        <FadeIn delay={240}>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 sm:gap-14">
            {about.stats.map((stat) => (
              <div key={stat.label} className="text-center">
                {stat.source === "waitlist" ? (
                  <WaitlistCounter />
                ) : (
                  <p
                    className={`font-black text-[#aaff00] ${
                      stat.compact
                        ? "text-2xl tracking-tight sm:text-3xl"
                        : "text-4xl sm:text-5xl"
                    }`}
                    style={{ fontFamily: montserrat }}
                  >
                    {stat.value}
                  </p>
                )}
                <p
                  className="mt-2 text-xs tracking-[0.35em] text-white/45"
                  style={{ fontFamily: outfit }}
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
