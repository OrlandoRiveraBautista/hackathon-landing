import { montserrat, outfit } from "@/lib/theme";

type PlatformInputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
  hint?: string;
};

export function PlatformInput({
  label,
  value,
  onChange,
  placeholder,
  multiline = false,
  hint,
}: PlatformInputProps) {
  return (
    <div className="group relative">
      <label
        className="block rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-3.5 transition-all duration-200 focus-within:border-[#aaff00]/30 focus-within:bg-[#aaff00]/[0.02] focus-within:shadow-[0_0_0_3px_rgba(170,255,0,0.06)]"
        style={{ backdropFilter: "blur(8px)" }}
      >
        <span
          className="mb-2 block text-[9px] font-black tracking-[0.26em] text-white/30"
          style={{ fontFamily: montserrat }}
        >
          {label}
        </span>
        {multiline ? (
          <textarea
            rows={4}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="mt-1 w-full resize-y bg-transparent text-sm text-white outline-none placeholder:text-white/20"
            style={{ fontFamily: outfit, minHeight: "96px" }}
          />
        ) : (
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="mt-1 w-full bg-transparent text-sm text-white outline-none placeholder:text-white/20"
            style={{ fontFamily: outfit }}
          />
        )}
      </label>
      {hint && (
        <p className="mt-1.5 px-1 text-[11px] text-white/25" style={{ fontFamily: outfit }}>
          {hint}
        </p>
      )}
    </div>
  );
}
