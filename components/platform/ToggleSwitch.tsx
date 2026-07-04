import type { ReactNode } from "react";
import { montserrat, outfit } from "@/lib/theme";

type ToggleSwitchProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
  disabled?: boolean;
};

export function ToggleSwitch({
  checked,
  onChange,
  label,
  description,
  disabled = false,
}: ToggleSwitchProps) {
  return (
    <label
      className={`flex items-center gap-4 rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-4 transition-all duration-200 ${
        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:border-[#aaff00]/20 hover:bg-[#aaff00]/[0.02]"
      }`}
    >
      <div className="relative flex-shrink-0">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only"
        />
        <div
          className={`h-5 w-9 rounded-full transition-all duration-200 ${
            checked ? "bg-[#aaff00]" : "bg-white/10"
          }`}
        />
        <div
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all duration-200 ${
            checked ? "left-[18px]" : "left-0.5"
          }`}
        />
      </div>
      <span>
        <span
          className="block text-[10px] font-black tracking-[0.22em] text-white/40"
          style={{ fontFamily: montserrat }}
        >
          {label}
        </span>
        {description && (
          <span className="mt-0.5 block text-sm text-white/40" style={{ fontFamily: outfit }}>
            {description}
          </span>
        )}
      </span>
    </label>
  );
}
