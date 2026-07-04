"use client";

import { useEffect, useState } from "react";
import { montserrat, outfit } from "@/lib/theme";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

type MemberEventCardProps = {
  label: string;
  title: string;
  dates: string;
  venue: string;
  schedule: string;
  targetDate: Date;
  countdownLabel: { days: string; hours: string; minutes: string; seconds: string };
};

const COUNTDOWN_UNITS = ["days", "hours", "minutes", "seconds"] as const;

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function getTimeLeft(target: Date): TimeLeft | null {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return null;
  const totalSeconds = Math.floor(diff / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

export function MemberEventCard({
  label,
  title,
  dates,
  venue,
  schedule,
  targetDate,
  countdownLabel,
}: MemberEventCardProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    const tick = () => setTimeLeft(getTimeLeft(targetDate));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  return (
    <div
      className="auth-item-in-2 relative overflow-hidden rounded-2xl"
      style={{
        border: "1px solid rgba(255,255,255,0.07)",
        background: "rgba(255,255,255,0.018)",
        backdropFilter: "blur(8px) saturate(160%)",
        WebkitBackdropFilter: "blur(8px) saturate(160%)",
        boxShadow: "0 0 0 1px rgba(255,255,255,0.03) inset, 0 4px 24px rgba(0,0,0,0.4)",
      }}
    >
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(170,255,0,0.35) 50%, transparent 100%)",
        }}
      />

      <div className="p-6">
        <p
          className="mb-4 text-[9px] font-black tracking-[0.28em] text-white/25"
          style={{ fontFamily: montserrat }}
        >
          {label}
        </p>

        <p
          className="text-base font-black tracking-tight text-white/90"
          style={{ fontFamily: montserrat }}
        >
          {title}
        </p>
        <p className="mt-1 text-xs text-white/40" style={{ fontFamily: outfit }}>
          {dates} · {venue}
        </p>

        {hasMounted && timeLeft === null ? (
          <p className="mt-5 text-xs text-[#aaff00]/70" style={{ fontFamily: outfit }}>
            {schedule}
          </p>
        ) : (
          <div className="mt-5 grid grid-cols-4 gap-2">
            {COUNTDOWN_UNITS.map((unit) => {
              const val = timeLeft?.[unit];
              return (
                <div
                  key={unit}
                  className="flex flex-col items-center gap-1 rounded-xl border border-white/[0.06] bg-white/[0.03] px-2 py-3"
                >
                  <span
                    className={`text-xl font-black tabular-nums leading-none ${val === undefined ? "text-white/20" : "text-white"}`}
                    style={{ fontFamily: montserrat }}
                  >
                    {val === undefined ? "--" : pad(val)}
                  </span>
                  <span
                    className="text-[8px] font-semibold tracking-[0.2em] text-white/30"
                    style={{ fontFamily: montserrat }}
                  >
                    {countdownLabel[unit]}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
