import Link from "next/link";
import type { ReactNode } from "react";
import {
  platformControlBase,
  platformControlFont,
  platformControlVariants,
  PlatformControlContent,
  type PlatformControlVariant,
} from "./platformControlStyles";

type PlatformLinkButtonProps = {
  href: string;
  children: ReactNode;
  variant?: PlatformControlVariant;
  icon?: ReactNode;
  className?: string;
};

export function PlatformLinkButton({
  href,
  children,
  variant = "primary",
  icon,
  className = "",
}: PlatformLinkButtonProps) {
  return (
    <Link
      href={href}
      className={`${platformControlBase} ${platformControlVariants[variant]} ${className}`}
      style={platformControlFont}
    >
      <PlatformControlContent icon={icon}>{children}</PlatformControlContent>
    </Link>
  );
}
