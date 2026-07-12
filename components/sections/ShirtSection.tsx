"use client";

import { motion } from "motion/react";
import { HackathonShirtCard } from "@/components/shirt/HackathonShirtCard";
import { useDictionary } from "@/components/LocaleProvider";

type ShirtSectionProps = {
  onRegisterClick: () => void;
};

export function ShirtSection({ onRegisterClick }: ShirtSectionProps) {
  const { shirt } = useDictionary();

  return (
    <section className="relative overflow-hidden border-t border-[#aaff00]/10 bg-black px-4 py-16 sm:px-6 sm:py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_100%,rgba(170,255,0,0.05)_0%,transparent_70%)]" />

      <div className="relative mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <HackathonShirtCard
            copy={shirt}
            variant="landing"
            onRegister={onRegisterClick}
          />
        </motion.div>
      </div>
    </section>
  );
}
