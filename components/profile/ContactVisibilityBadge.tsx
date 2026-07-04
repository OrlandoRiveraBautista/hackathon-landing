import { outfit } from "@/lib/theme";

type ContactVisibilityBadgeProps = {
  isPublic: boolean;
  publicLabel: string;
  privateLabel: string;
};

export function ContactVisibilityBadge({
  isPublic,
  publicLabel,
  privateLabel,
}: ContactVisibilityBadgeProps) {
  return (
    <span
      className={`text-[10px] font-semibold tracking-wide ${
        isPublic ? "text-[#aaff00]/65" : "text-white/25"
      }`}
      style={{ fontFamily: outfit }}
    >
      ({isPublic ? publicLabel : privateLabel})
    </span>
  );
}
