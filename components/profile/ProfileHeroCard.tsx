import type { ReactNode } from "react";
import { ProfileCoverBanner } from "./ProfileCoverBanner";

type ProfileHeroCardProps = {
  avatar: ReactNode;
  badges?: ReactNode;
  name: ReactNode;
  meta?: ReactNode;
  footer?: ReactNode;
  animationClass?: string;
};

export function ProfileHeroCard({
  avatar,
  badges,
  name,
  meta,
  footer,
  animationClass = "auth-item-in-1",
}: ProfileHeroCardProps) {
  return (
    <div
      className={`${animationClass} relative overflow-hidden rounded-3xl border border-t-0 border-white/[0.07] shadow-[0_16px_64px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.03)]`}
    >
      <ProfileCoverBanner />
      <div
        className="px-6 pb-7 sm:px-8 sm:pb-8"
        style={{
          background:
            "linear-gradient(to bottom, rgba(5,5,5,0) 0%, rgba(5,5,5,1) 40%)",
        }}
      >
        <div className="-mt-14 mb-5 flex items-end justify-between sm:-mt-16">
          {avatar}
          {badges && (
            <div className="flex flex-wrap items-center gap-2 pb-1.5">
              {badges}
            </div>
          )}
        </div>
        <div className="flex flex-col gap-1">
          {name}
          {meta}
        </div>
        {footer}
      </div>
    </div>
  );
}
