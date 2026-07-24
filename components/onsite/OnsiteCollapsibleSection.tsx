"use client";

import { useId, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { montserrat } from "@/lib/theme";

type OnsiteCollapsibleSectionProps = {
  title: string;
  defaultOpen?: boolean;
  className?: string;
  children: ReactNode;
};

export function OnsiteCollapsibleSection({
  title,
  defaultOpen = false,
  className = "",
  children,
}: OnsiteCollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();

  return (
    <section className={className}>
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#060606]">
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-white/[0.02] sm:px-6 sm:py-5"
          aria-expanded={open}
          aria-controls={panelId}
        >
          <h2
            className="text-xl font-black text-white sm:text-2xl"
            style={{ fontFamily: montserrat }}
          >
            {title}
          </h2>
          <motion.span
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/15 text-white/70"
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            aria-hidden="true"
          >
            <ChevronDown size={18} />
          </motion.span>
        </button>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              id={panelId}
              key="panel"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="border-t border-white/10">{children}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
