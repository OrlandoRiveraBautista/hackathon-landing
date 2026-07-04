import { montserrat } from "@/lib/theme";

type MemberAvatarProps = {
  name: string;
  imageUrl?: string | null;
  size?: "sm" | "md" | "lg" | "xl";
};

const sizeConfig = {
  sm: { dim: 32, className: "h-8 w-8", text: "text-xs" },
  md: { dim: 40, className: "h-10 w-10", text: "text-sm" },
  lg: { dim: 76, className: "h-[76px] w-[76px]", text: "text-xl" },
  xl: { dim: 112, className: "h-28 w-28", text: "text-3xl" },
} as const;

export function MemberAvatar({ name, imageUrl, size = "lg" }: MemberAvatarProps) {
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  const { dim, className, text } = sizeConfig[size];

  return (
    <div
      className={`relative flex-shrink-0 overflow-hidden rounded-2xl border border-white/10 ${className} shadow-[0_8px_32px_rgba(0,0,0,0.5)]`}
    >
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element -- external OAuth avatars
        <img
          src={imageUrl}
          alt={name}
          width={dim}
          height={dim}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover"
        />
      ) : (
        <div
          className={`flex h-full w-full items-center justify-center bg-gradient-to-br from-[#aaff00]/20 via-[#00dc82]/10 to-[#050505] ${text} font-black text-[#aaff00]`}
          style={{ fontFamily: montserrat }}
        >
          {initials}
        </div>
      )}
    </div>
  );
}
