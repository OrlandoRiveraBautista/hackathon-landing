"use client";

import { useEffect } from "react";
import { GithubIcon, PlatformButton, FeedbackBanner } from "@/components/platform";
import { montserrat, outfit } from "@/lib/theme";

type ProjectSubmitConfirmDialogProps = {
  open: boolean;
  githubUrl: string;
  onClose: () => void;
  onConfirm: () => void;
  confirming: boolean;
  error?: string;
  labels: {
    title: string;
    subtitle: string;
    warnings: string[];
    githubLabel: string;
    cancel: string;
    confirm: string;
    confirming: string;
  };
};

export function ProjectSubmitConfirmDialog({
  open,
  githubUrl,
  onClose,
  onConfirm,
  confirming,
  error,
  labels,
}: ProjectSubmitConfirmDialogProps) {
  useEffect(() => {
    if (!open) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape" && !confirming) {
        onClose();
      }
    }

    document.addEventListener("keydown", handleEscape);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, confirming, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        aria-label={labels.cancel}
        onClick={() => {
          if (!confirming) onClose();
        }}
      />

      <div
        className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0a0a0a]/95 shadow-[0_24px_80px_rgba(0,0,0,0.75),0_0_0_1px_rgba(255,255,255,0.04)_inset]"
        style={{
          backdropFilter: "blur(20px) saturate(160%)",
          WebkitBackdropFilter: "blur(20px) saturate(160%)",
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="submit-confirm-title"
      >
        <div className="border-b border-white/[0.06] px-6 py-5">
          <p
            id="submit-confirm-title"
            className="text-lg font-black tracking-tight text-white"
            style={{ fontFamily: montserrat }}
          >
            {labels.title}
          </p>
          <p className="mt-1 text-sm text-white/45" style={{ fontFamily: outfit }}>
            {labels.subtitle}
          </p>
        </div>

        <div className="space-y-4 px-6 py-5">
          {error && <FeedbackBanner variant="error" message={error} />}

          <ul className="space-y-2.5">
            {labels.warnings.map((warning) => (
              <li
                key={warning}
                className="flex gap-2.5 text-sm leading-relaxed text-white/55"
                style={{ fontFamily: outfit }}
              >
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#aaff00]/70" />
                {warning}
              </li>
            ))}
          </ul>

          <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-3.5">
            <p
              className="mb-1.5 text-[9px] font-black tracking-[0.26em] text-white/30"
              style={{ fontFamily: montserrat }}
            >
              {labels.githubLabel}
            </p>
            <p
              className="flex items-start gap-2 break-all text-sm text-[#aaff00]/80"
              style={{ fontFamily: outfit }}
            >
              <GithubIcon className="mt-0.5 h-4 w-4 flex-shrink-0" />
              {githubUrl}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3 border-t border-white/[0.06] px-6 py-4">
          <PlatformButton onClick={onClose} disabled={confirming} variant="ghost">
            {labels.cancel}
          </PlatformButton>
          <PlatformButton
            onClick={onConfirm}
            disabled={confirming}
            variant="primary"
            icon={<GithubIcon className="h-3.5 w-3.5" />}
          >
            {confirming ? labels.confirming : labels.confirm}
          </PlatformButton>
        </div>
      </div>
    </div>
  );
}
