"use client";

import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";
import { BoostButton } from "@/components/onsite/BoostButton";
import { clampOnsiteBoostTapCount } from "@/lib/onsite-selection";
import { montserrat, outfit } from "@/lib/theme";

type OnsiteBoostPanelProps = {
  eyebrow: string;
  title: string;
  multiplier: string;
  multiplierLabel: string;
  actionLine: string;
  body: string;
  steps: [string, string, string];
  boostButton: string;
  boostButtonBoosted: string;
  boostButtonMaxed: string;
  boostTapHint: string;
  boostDailyProgress: string;
  boostCooldownHint: string;
  boostLimitReached: string;
  boosting: string;
  boostSignInPrompt: string;
  boostSignIn: string;
  boostSignInReturn: string;
  loginHref: string;
  loading: boolean;
  interested: boolean;
  signedIn: boolean | null;
  tapCount: number;
  dailyTapCount: number;
  dailyTapLimit: number;
  dailyLimitReached: boolean;
  cooldownUntil: string | null;
  onBoost: () => void;
};

function StepPill({
  label,
  active,
  done,
  index,
}: {
  label: string;
  active: boolean;
  done: boolean;
  index: number;
}) {
  return (
    <div
      className={`flex min-w-0 flex-1 items-center gap-2 rounded-xl border px-3 py-2 ${
        done
          ? "border-[#aaff00]/35 bg-[#aaff00]/10"
          : active
            ? "border-[#aaff00]/25 bg-white/[0.04]"
            : "border-white/10 bg-black/20"
      }`}
    >
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-black ${
          done
            ? "bg-[#aaff00] text-black"
            : active
              ? "bg-[#aaff00]/20 text-[#aaff00]"
              : "bg-white/10 text-white/35"
        }`}
        style={{ fontFamily: montserrat }}
      >
        {done ? "✓" : index}
      </span>
      <span
        className={`truncate text-[10px] font-black tracking-[0.08em] sm:text-[11px] ${
          done || active ? "text-white/80" : "text-white/35"
        }`}
        style={{ fontFamily: montserrat }}
      >
        {label}
      </span>
    </div>
  );
}

export function OnsiteBoostPanel({
  eyebrow,
  title,
  multiplier,
  multiplierLabel,
  actionLine,
  body,
  steps,
  boostButton,
  boostButtonBoosted,
  boostButtonMaxed,
  boostTapHint,
  boostDailyProgress,
  boostCooldownHint,
  boostLimitReached,
  boosting,
  boostSignInPrompt,
  boostSignIn,
  boostSignInReturn,
  loginHref,
  loading,
  interested,
  signedIn,
  tapCount,
  dailyTapCount,
  dailyTapLimit,
  dailyLimitReached,
  cooldownUntil,
  onBoost,
}: OnsiteBoostPanelProps) {
  const effectiveTapCount = clampOnsiteBoostTapCount(tapCount);
  const dailyProgressLabel = boostDailyProgress
    .replace("{count}", String(dailyTapCount))
    .replace("{limit}", String(dailyTapLimit));
  const stepStates: [boolean, boolean, boolean] = interested
    ? [true, true, false]
    : signedIn
      ? [true, false, false]
      : [false, false, false];

  return (
    <div className="relative overflow-hidden rounded-3xl border-2 border-[#aaff00]/35 bg-[#0a0a0a] shadow-[0_0_60px_rgba(170,255,0,0.12)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#aaff00]/80 to-transparent" />
      <div className="pointer-events-none absolute -top-16 right-0 h-40 w-40 rounded-full bg-[#aaff00]/10 blur-3xl" />

      <div className="relative p-5 sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-stretch lg:gap-6">
          <div className="flex shrink-0 items-center gap-4 lg:w-36 lg:flex-col lg:justify-center lg:border-r lg:border-white/10 lg:pr-6">
            <div className="flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-2xl border border-[#aaff00]/40 bg-[#aaff00]/15 shadow-[0_0_30px_rgba(170,255,0,0.15)]">
              <span
                className="text-3xl font-black leading-none text-[#aaff00]"
                style={{ fontFamily: montserrat }}
              >
                {multiplier}
              </span>
              <span
                className="mt-1 text-center text-[8px] font-black tracking-[0.12em] text-[#aaff00]/80 uppercase"
                style={{ fontFamily: montserrat }}
              >
                {multiplierLabel}
              </span>
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <span
              className="inline-flex items-center gap-1.5 text-[10px] font-black tracking-[0.32em] text-[#aaff00]/90"
              style={{ fontFamily: montserrat }}
            >
              <Zap size={12} fill="currentColor" strokeWidth={0} />
              {eyebrow}
            </span>

            <h2
              className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl"
              style={{ fontFamily: montserrat }}
            >
              {title}
            </h2>

            <p
              className="mt-2 text-sm font-medium text-white/75 sm:text-base"
              style={{ fontFamily: outfit }}
            >
              {actionLine}
            </p>

            <p
              className="mt-1 text-xs text-white/45"
              style={{ fontFamily: outfit }}
            >
              {body}
            </p>

            <div className="mt-4 flex gap-2">
              {steps.map((step, index) => (
                <StepPill
                  key={step}
                  label={step}
                  index={index + 1}
                  done={stepStates[index]}
                  active={
                    !interested &&
                    ((index === 0 && signedIn === false) ||
                      (index === 1 && signedIn === true && !interested))
                  }
                />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 border-t border-white/10 pt-5">
          {loading || signedIn === null ? (
            <div className="h-14 animate-pulse rounded-2xl bg-white/[0.08]" />
          ) : signedIn ? (
            <BoostButton
              label={boostButton}
              boostedLabel={boostButtonBoosted}
              maxedLabel={boostButtonMaxed}
              boostingLabel={boosting}
              tapHint={boostTapHint}
              dailyProgressLabel={dailyProgressLabel}
              cooldownHint={boostCooldownHint}
              limitReachedMessage={boostLimitReached}
              interested={interested}
              loading={false}
              tapCount={effectiveTapCount}
              dailyTapCount={dailyTapCount}
              dailyTapLimit={dailyTapLimit}
              limitReached={dailyLimitReached}
              cooldownUntil={cooldownUntil}
              onPress={onBoost}
            />
          ) : (
            <div className="space-y-3">
              <p
                className="text-center text-xs text-white/50 sm:text-left"
                style={{ fontFamily: outfit }}
              >
                {boostSignInPrompt}
              </p>
              <Link
                href={loginHref}
                className="group inline-flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-[#aaff00]/50 bg-[#aaff00]/10 px-6 py-4 text-sm font-black tracking-[0.12em] text-[#aaff00] transition-all hover:border-[#aaff00] hover:bg-[#aaff00]/15 sm:text-base"
                style={{ fontFamily: montserrat }}
              >
                {boostSignIn}
                <ArrowRight
                  size={18}
                  strokeWidth={2.5}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
              <p
                className="text-center text-[10px] tracking-[0.1em] text-white/35 sm:text-left"
                style={{ fontFamily: outfit }}
              >
                {boostSignInReturn}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
