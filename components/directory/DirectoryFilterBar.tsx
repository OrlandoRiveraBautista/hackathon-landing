"use client";

import { montserrat, outfit } from "@/lib/theme";

type DirectoryFilterBarProps = {
  filterAllLabel: string;
  filterOpenTeamsLabel: string;
  activeFilter: "all" | "open";
  onChange: (filter: "all" | "open") => void;
  sectionLabel: string;
  countLabel: string;
  loading?: boolean;
  loadingLabel?: string;
};

export function DirectoryFilterBar({
  filterAllLabel,
  filterOpenTeamsLabel,
  activeFilter,
  onChange,
  sectionLabel,
  countLabel,
  loading,
  loadingLabel,
}: DirectoryFilterBarProps) {
  const filters = [
    { id: "all" as const, label: filterAllLabel },
    { id: "open" as const, label: filterOpenTeamsLabel },
  ];

  return (
    <div className="auth-item-in-2 mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <p
          className="text-[9px] font-black tracking-[0.28em] text-white/25"
          style={{ fontFamily: montserrat }}
        >
          {sectionLabel}
        </p>
        <div className="h-px w-8 bg-gradient-to-r from-white/[0.08] to-transparent sm:w-12" />
        <p
          className="text-[11px] font-semibold text-white/35"
          style={{ fontFamily: outfit }}
        >
          {loading && loadingLabel ? loadingLabel : countLabel}
        </p>
      </div>

      <div
        className="inline-flex rounded-xl border border-white/[0.07] bg-white/[0.025] p-1"
        style={{ backdropFilter: "blur(8px)" }}
        role="tablist"
        aria-label={sectionLabel}
      >
        {filters.map((filter) => {
          const active = activeFilter === filter.id;
          return (
            <button
              key={filter.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onChange(filter.id)}
              className={`rounded-lg px-3.5 py-1.5 text-[11px] font-semibold transition-all duration-200 ${
                active
                  ? "bg-[#aaff00]/12 text-[#aaff00] shadow-[0_0_0_1px_rgba(170,255,0,0.15)_inset]"
                  : "text-white/35 hover:text-white/60"
              }`}
              style={{ fontFamily: outfit }}
            >
              {filter.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
