import type { ReactNode } from "react";
import { outfit } from "@/lib/theme";
import { CheckIcon } from "./icons";

type FeedbackBannerProps = {
  variant: "error" | "success";
  message: string;
  icon?: ReactNode;
  className?: string;
};

export function FeedbackBanner({
  variant,
  message,
  icon,
  className = "mt-4",
}: FeedbackBannerProps) {
  const isError = variant === "error";

  return (
    <div
      className={`auth-item-in-3 flex items-start gap-3 rounded-2xl border px-5 py-4 ${
        isError
          ? "border-red-500/20 bg-red-500/[0.07]"
          : "border-[#aaff00]/20 bg-[#aaff00]/[0.06]"
      } ${className}`}
    >
      {icon ?? (
        isError ? (
          <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-400" />
        ) : (
          <CheckIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#aaff00]" />
        )
      )}
      <p
        className={`text-sm ${isError ? "text-red-400" : "text-[#aaff00]"}`}
        style={{ fontFamily: outfit }}
      >
        {message}
      </p>
    </div>
  );
}
