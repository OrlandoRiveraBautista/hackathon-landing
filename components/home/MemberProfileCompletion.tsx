import Link from "next/link";
import { montserrat, outfit } from "@/lib/theme";

type CompletionItem = {
  id: string;
  label: string;
  done: boolean;
};

type MemberProfileCompletionProps = {
  label: string;
  title: string;
  subtitle: string;
  completeLabel: string;
  items: CompletionItem[];
  percent: number;
  editHref: string;
  editLabel: string;
};

export function MemberProfileCompletion({
  label,
  title,
  subtitle,
  completeLabel,
  items,
  percent,
  editHref,
  editLabel,
}: MemberProfileCompletionProps) {
  const isComplete = percent === 100;

  return (
    <div
      className="auth-item-in-3 relative overflow-hidden rounded-2xl"
      style={{
        border: isComplete ? "1px solid rgba(170,255,0,0.12)" : "1px solid rgba(170,255,0,0.10)",
        background: isComplete ? "rgba(170,255,0,0.025)" : "rgba(170,255,0,0.02)",
        backdropFilter: "blur(8px) saturate(160%)",
        WebkitBackdropFilter: "blur(8px) saturate(160%)",
        boxShadow: isComplete
          ? "0 0 0 1px rgba(170,255,0,0.06) inset, 0 4px 24px rgba(0,0,0,0.4)"
          : "0 0 0 1px rgba(170,255,0,0.04) inset, 0 4px 24px rgba(0,0,0,0.4)",
      }}
    >
      {/* Top accent */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background: isComplete
            ? "linear-gradient(90deg, transparent 0%, rgba(170,255,0,0.5) 50%, transparent 100%)"
            : "linear-gradient(90deg, transparent 0%, rgba(170,255,0,0.25) 50%, transparent 100%)",
        }}
      />

      <div className="p-6">
        {/* Header row */}
        <div className="mb-4 flex items-center justify-between">
          <p
            className="text-[9px] font-black tracking-[0.28em] text-white/25"
            style={{ fontFamily: montserrat }}
          >
            {label}
          </p>
          <div className="flex items-center gap-2.5">
            <div className="h-1 w-20 overflow-hidden rounded-full bg-white/[0.06]">
              <div
                className="h-full rounded-full bg-[#aaff00] transition-all duration-700"
                style={{ width: `${percent}%` }}
              />
            </div>
            <span
              className="text-[11px] font-black tabular-nums text-[#aaff00]/70"
              style={{ fontFamily: montserrat }}
            >
              {percent}%
            </span>
          </div>
        </div>

        {/* Title */}
        <p
          className="text-sm font-black tracking-tight text-white/90"
          style={{ fontFamily: montserrat }}
        >
          {isComplete ? completeLabel : title}
        </p>
        {!isComplete && (
          <p className="mt-1 text-xs text-white/35" style={{ fontFamily: outfit }}>
            {subtitle}
          </p>
        )}

        {/* Checklist */}
        {!isComplete && (
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex items-center gap-2 rounded-lg border border-white/[0.05] bg-white/[0.02] px-3 py-2"
              >
                <span
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                    item.done
                      ? "border-[#aaff00]/30 bg-[#aaff00]/15 text-[#aaff00]"
                      : "border-white/[0.08] bg-transparent"
                  }`}
                >
                  {item.done && (
                    <svg viewBox="0 0 12 12" fill="none" className="h-2.5 w-2.5">
                      <path
                        d="M2 6l2.5 2.5L10 3.5"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </span>
                <span
                  className={`text-[11px] ${item.done ? "text-white/45 line-through decoration-white/20" : "text-white/40"}`}
                  style={{ fontFamily: outfit }}
                >
                  {item.label}
                </span>
              </li>
            ))}
          </ul>
        )}

        {/* CTA */}
        {!isComplete && (
          <Link
            href={editHref}
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#aaff00]/70 transition-colors hover:text-[#aaff00]"
            style={{ fontFamily: outfit }}
          >
            {editLabel}
            <svg viewBox="0 0 16 16" fill="none" className="h-3 w-3">
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        )}
      </div>
    </div>
  );
}
