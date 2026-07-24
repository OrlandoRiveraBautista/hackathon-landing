import Image from "next/image";
import { SITE_LOGO } from "@/lib/brand";

type BrandLogoProps = {
  size?: number;
  /** Green glow behind the mark — matches main nav. Parent should use `group` for hover. */
  glow?: boolean;
  imageClassName?: string;
  priority?: boolean;
};

export function BrandLogo({
  size = 32,
  glow = true,
  imageClassName = "",
  priority = false,
}: BrandLogoProps) {
  const image = (
    <Image
      src={SITE_LOGO}
      alt=""
      width={size}
      height={size}
      className={`relative rounded-xl ${imageClassName}`.trim()}
      aria-hidden
      priority={priority}
    />
  );

  if (!glow) {
    return <div className="relative shrink-0">{image}</div>;
  }

  return (
    <div className="relative shrink-0">
      <div className="absolute inset-0 rounded-xl bg-[#aaff00]/20 blur-md transition-all duration-300 group-hover:bg-[#aaff00]/35 group-hover:blur-lg" />
      {image}
    </div>
  );
}
