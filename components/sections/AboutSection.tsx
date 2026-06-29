"use client";

import { motion } from "motion/react";
import { Clock, MapPin, Zap, Info, HelpCircle } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { useDictionary } from "@/components/LocaleProvider";
import { WaitlistCounter } from "@/components/WaitlistCounter";
import { PeserosCredit } from "@/components/PeserosCredit";
import { montserrat, outfit } from "@/lib/theme";

const STAT_ICONS = [Clock, Zap, MapPin];

export function AboutSection() {
  const dictionary = useDictionary();
  const { about } = dictionary;

  const cards = [
    { label: about.whatIsIt, body: about.whatIsItBody, Icon: Info },
    { label: about.whoIsItFor, body: about.whoIsItForBody, Icon: HelpCircle },
  ];

  return (
    <section id="about" className="relative scroll-mt-16 overflow-hidden bg-black px-4 py-16 sm:px-6 sm:py-24 md:py-32">
      {/* Radial glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_50%,rgba(170,255,0,0.06)_0%,transparent_70%)]" />
      {/* Grid pattern overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "linear-gradient(rgba(170,255,0,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(170,255,0,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative mx-auto max-w-5xl">
        <SectionHeading
          label={about.label}
          title={about.title}
          accentWord={about.accentWord}
          subtitle={about.subtitle}
        />

        <motion.div
          className="mx-auto mt-8 max-w-2xl"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <PeserosCredit variant="banner" />
        </motion.div>

        <div className="mt-12 grid gap-5 sm:mt-16 sm:gap-6 md:grid-cols-2">
          {cards.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4, transition: { duration: 0.25 } }}
              className="group relative overflow-hidden rounded-2xl border border-[#aaff00]/15 bg-white/[0.025] p-6 backdrop-blur-sm sm:p-8"
            >
              {/* Hover shimmer */}
              <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{ background: "radial-gradient(circle at 50% 0%, rgba(170,255,0,0.08) 0%, transparent 60%)" }}
              />
              {/* Corner accent lines */}
              <div className="absolute top-0 right-0 h-px w-10 bg-gradient-to-l from-[#aaff00]/60 to-transparent" />
              <div className="absolute top-0 right-0 h-10 w-px bg-gradient-to-b from-[#aaff00]/60 to-transparent" />
              <div className="absolute bottom-0 left-0 h-px w-10 bg-gradient-to-r from-[#aaff00]/30 to-transparent" />
              <div className="absolute bottom-0 left-0 h-10 w-px bg-gradient-to-t from-[#aaff00]/30 to-transparent" />

              <div className="mb-4 inline-flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#aaff00]/25 bg-[#aaff00]/8 text-[#aaff00]">
                  <card.Icon size={16} strokeWidth={1.75} className="drop-shadow-[0_0_6px_rgba(170,255,0,0.5)]" />
                </div>
                <p
                  className="text-[10px] font-black tracking-[0.35em] text-[#aaff00] drop-shadow-[0_0_8px_rgba(170,255,0,0.5)]"
                  style={{ fontFamily: montserrat }}
                >
                  {card.label}
                </p>
              </div>
              <p
                className="text-base leading-relaxed text-white/70 sm:text-lg"
                style={{ fontFamily: outfit }}
              >
                {card.body}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Stats row */}
        <motion.div
          className="mt-10 grid grid-cols-3 gap-4 sm:mt-14 sm:gap-6"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.7, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          {about.stats.map((stat, i) => {
            const StatIcon = STAT_ICONS[i];
            return (
              <motion.div
                key={stat.label}
                className="group relative overflow-hidden rounded-2xl border border-white/8 bg-white/[0.02] p-4 text-center sm:p-6"
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.1, ease: "backOut" }}
                whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
              >
                <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{ boxShadow: "inset 0 0 0 1px rgba(170,255,0,0.2)" }}
                />
                {StatIcon && (
                  <div className="mx-auto mb-2 flex h-7 w-7 items-center justify-center text-[#aaff00]/50">
                    <StatIcon size={16} strokeWidth={1.75} />
                  </div>
                )}
                {stat.source === "waitlist" ? (
                  <WaitlistCounter />
                ) : (
                  <p
                    className={`font-black text-[#aaff00] drop-shadow-[0_0_20px_rgba(170,255,0,0.4)] ${
                      stat.compact
                        ? "text-xl tracking-tight sm:text-2xl"
                        : "text-3xl sm:text-4xl"
                    }`}
                    style={{ fontFamily: montserrat }}
                  >
                    {stat.value}
                  </p>
                )}
                {stat.sublabel && (
                  <p
                    className="mt-1 text-[11px] font-semibold tracking-[0.12em] text-[#aaff00]/75 sm:text-xs"
                    style={{ fontFamily: outfit }}
                  >
                    {stat.sublabel}
                  </p>
                )}
                <p
                  className={`text-[10px] tracking-[0.3em] text-white/40 sm:text-xs ${
                    stat.sublabel ? "mt-1" : "mt-1.5"
                  }`}
                  style={{ fontFamily: outfit }}
                >
                  {stat.label}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
