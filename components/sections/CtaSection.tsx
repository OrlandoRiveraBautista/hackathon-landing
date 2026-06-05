"use client";

import ClickSpark from "@/components/reactbits/ClickSpark";
import StarBorder from "@/components/reactbits/StarBorder";
import { FadeIn } from "@/components/FadeIn";
import { useDictionary } from "@/components/LocaleProvider";
import { montserrat, outfit } from "@/lib/theme";

type CtaSectionProps = {
  onRegisterClick: () => void;
};

export function CtaSection({ onRegisterClick }: CtaSectionProps) {
  const { cta } = useDictionary();

  return (
    <section className="relative overflow-hidden bg-black px-4 py-16 sm:px-6 sm:py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(170,255,0,0.08)_0%,transparent_60%)]" />

      <FadeIn>
        <div className="relative mx-auto max-w-2xl text-center">
          <p
            className="text-xs tracking-[0.4em] text-[#aaff00]/80"
            style={{ fontFamily: outfit }}
          >
            {cta.label}
          </p>
          <h2
            className="mt-4 text-2xl font-black tracking-tight text-white sm:text-3xl md:text-5xl"
            style={{ fontFamily: montserrat }}
          >
            {cta.title}
          </h2>
          <p
            className="mt-5 text-base text-white/55 sm:text-lg"
            style={{ fontFamily: outfit }}
          >
            {cta.subtitle}
          </p>

          <div className="mx-auto mt-8 flex w-full max-w-sm items-center sm:mt-10 sm:max-w-none">
            <div className="h-px flex-1 bg-[#aaff00]/50" />
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
                style={{ fontFamily: montserrat }}
              >
                {cta.button}
              </StarBorder>
            </ClickSpark>
            <div className="h-px flex-1 bg-[#aaff00]/50" />
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
