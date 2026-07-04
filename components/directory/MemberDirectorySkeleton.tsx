import { montserrat, outfit } from "@/lib/theme";

export function MemberDirectorySkeleton() {
  return (
    <div
      className="platform-skeleton-card flex h-full min-h-[220px] flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.015] p-5"
      style={{
        backdropFilter: "blur(8px)",
        boxShadow: "0 0 0 1px rgba(255,255,255,0.02) inset",
      }}
    >
      <div className="flex items-start gap-4">
        <div className="platform-skeleton h-10 w-10 shrink-0 rounded-xl" />
        <div className="min-w-0 flex-1 space-y-2.5">
          <div className="platform-skeleton h-4 w-2/3 rounded-md" />
          <div className="platform-skeleton h-3 w-1/2 rounded-md" />
        </div>
      </div>
      <div className="mt-5 space-y-2">
        <div className="platform-skeleton h-3 w-full rounded-md" />
        <div className="platform-skeleton h-3 w-4/5 rounded-md" />
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        <div className="platform-skeleton h-7 w-16 rounded-lg" />
        <div className="platform-skeleton h-7 w-20 rounded-lg" />
        <div className="platform-skeleton h-7 w-14 rounded-lg" />
      </div>
      <div
        className="mt-auto pt-5 text-[10px] text-white/10"
        style={{ fontFamily: montserrat }}
      >
        ···
      </div>
    </div>
  );
}

export function MemberDirectorySkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className={`auth-item-in-${Math.min(index + 2, 6)}`}>
          <MemberDirectorySkeleton />
        </div>
      ))}
    </div>
  );
}
