"use client";

import { motion } from "motion/react";
import { Loader2 } from "lucide-react";
import { ONSITE_CAPACITY } from "@/lib/onsite/shared";
import { montserrat, outfit } from "@/lib/theme";

type OnsiteListLabels = {
  tableRank: string;
  tableName: string;
  tableSchool: string;
  tableGithub: string;
  listComingSoonBadge: string;
  pendingTitle: string;
  listLoadingHint: string;
  capacityBadge: string;
};

type OnsiteParticipantRow = {
  name: string;
};

const SKELETON_WIDTHS = [
  "w-[72%]",
  "w-[58%]",
  "w-[80%]",
  "w-[64%]",
  "w-[76%]",
  "w-[55%]",
  "w-[68%]",
  "w-[82%]",
];

function shimmerClass(delayMs: number) {
  return {
    animationDelay: `${delayMs}ms`,
  };
}

function SkeletonRow({ index }: { index: number }) {
  const nameWidth = SKELETON_WIDTHS[index % SKELETON_WIDTHS.length];
  const delay = index * 45;

  return (
    <tr className="border-t border-white/[0.06]">
      <td className="px-5 py-3.5">
        <span
          className="text-[11px] font-black tracking-[0.2em] text-white/15"
          style={{ fontFamily: montserrat }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
      </td>
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-3">
          <div
            className="platform-skeleton h-9 w-9 shrink-0 rounded-full"
            style={shimmerClass(delay)}
          />
          <div
            className={`platform-skeleton h-3.5 rounded-full ${nameWidth}`}
            style={shimmerClass(delay + 80)}
          />
        </div>
      </td>
    </tr>
  );
}

function ListHeader({
  labels,
  comingSoon,
}: {
  labels: OnsiteListLabels;
  comingSoon: boolean;
}) {
  return (
    <thead className="sticky top-0 z-10 bg-[#080808]/95 backdrop-blur-md">
      <tr className="border-b border-white/10 text-[10px] font-black tracking-[0.22em] text-white/40 uppercase">
        <th className="px-5 py-3.5 text-left" style={{ fontFamily: montserrat }}>
          {labels.tableRank}
        </th>
        <th className="px-5 py-3.5 text-left" style={{ fontFamily: montserrat }}>
          {labels.tableName}
        </th>
      </tr>
      {comingSoon && (
        <tr>
          <td colSpan={2} className="border-b border-[#aaff00]/15 bg-[#aaff00]/[0.04] px-5 py-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span
                  className="inline-flex items-center gap-2 rounded-full border border-[#aaff00]/30 bg-[#aaff00]/10 px-3 py-1 text-[9px] font-black tracking-[0.28em] text-[#aaff00]"
                  style={{ fontFamily: montserrat }}
                >
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#aaff00]/60 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[#aaff00]" />
                  </span>
                  {labels.listComingSoonBadge}
                </span>
                <span
                  className="text-sm font-black text-white/80"
                  style={{ fontFamily: montserrat }}
                >
                  {labels.pendingTitle}
                </span>
              </div>
              <span
                className="text-[10px] tracking-[0.18em] text-white/35"
                style={{ fontFamily: outfit }}
              >
                {labels.capacityBadge}
              </span>
            </div>
          </td>
        </tr>
      )}
    </thead>
  );
}

export function OnsiteComingSoonList({
  labels,
  embedded = false,
}: {
  labels: OnsiteListLabels;
  embedded?: boolean;
}) {
  return (
    <motion.div
      className={
        embedded
          ? "relative overflow-hidden bg-[#060606]"
          : "relative overflow-hidden rounded-3xl border border-white/10 bg-[#060606]"
      }
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#aaff00]/[0.06] to-transparent" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(170,255,0,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(170,255,0,0.8) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative max-h-[min(70vh,640px)] overflow-y-auto overflow-x-auto">
        <table className="w-full min-w-[320px] text-left text-sm">
          <ListHeader labels={labels} comingSoon />
          <tbody>
            {Array.from({ length: ONSITE_CAPACITY }, (_, index) => (
              <SkeletonRow key={index} index={index} />
            ))}
          </tbody>
        </table>
      </div>

      <div className="relative flex items-center justify-center gap-2.5 border-t border-white/10 bg-black/40 px-5 py-4">
        <Loader2 size={15} className="animate-spin text-[#aaff00]/80" />
        <p
          className="text-xs tracking-[0.12em] text-white/45"
          style={{ fontFamily: outfit }}
        >
          {labels.listLoadingHint}
        </p>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-14 h-16 bg-gradient-to-t from-[#060606] to-transparent" />
    </motion.div>
  );
}

export function OnsiteAnnouncedList({
  labels,
  participants,
  subtitle,
  embedded = false,
}: {
  labels: Pick<OnsiteListLabels, "tableRank" | "tableName">;
  participants: OnsiteParticipantRow[];
  subtitle: string;
  embedded?: boolean;
}) {
  return (
    <motion.div
      className={
        embedded
          ? "overflow-hidden bg-[#060606]"
          : "overflow-hidden rounded-3xl border border-white/10 bg-[#060606]"
      }
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="border-b border-white/10 px-5 py-4 sm:px-6">
        <p className="text-sm text-white/55" style={{ fontFamily: outfit }}>
          {subtitle}
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[320px] text-left text-sm">
          <ListHeader
            labels={{
              ...labels,
              tableSchool: "",
              tableGithub: "",
              listComingSoonBadge: "",
              pendingTitle: "",
              listLoadingHint: "",
              capacityBadge: "",
            }}
            comingSoon={false}
          />
          <tbody>
            {participants.map((participant, index) => (
              <tr
                key={`${participant.name}-${index}`}
                className="border-t border-white/[0.06] transition-colors hover:bg-white/[0.02]"
              >
                <td className="px-5 py-4">
                  <span
                    className="text-[11px] font-black tracking-[0.2em] text-[#aaff00]/70"
                    style={{ fontFamily: montserrat }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#aaff00]/20 bg-[#aaff00]/10 text-xs font-black text-[#aaff00]"
                      style={{ fontFamily: montserrat }}
                    >
                      {participant.name.trim().charAt(0).toUpperCase()}
                    </div>
                    <span
                      className="font-medium text-white/90"
                      style={{ fontFamily: outfit }}
                    >
                      {participant.name}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
