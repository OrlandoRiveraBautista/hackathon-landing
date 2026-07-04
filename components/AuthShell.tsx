import Image from "next/image";
import type { ReactNode } from "react";
import { SITE_LOGO } from "@/lib/brand";
import { montserrat, outfit } from "@/lib/theme";

type AuthShellProps = {
  eyebrow: string;
  maxWidth?: "md" | "2xl";
  footer?: ReactNode;
  children: ReactNode;
};

export function AuthShell({
  eyebrow,
  maxWidth = "md",
  footer,
  children,
}: AuthShellProps) {
  const maxWidthClass = maxWidth === "2xl" ? "max-w-2xl" : "max-w-md";

  return (
    <main className="relative flex min-h-[100dvh] flex-col bg-[#050505] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_45%_at_50%_0%,rgba(170,255,0,0.07)_0%,transparent_65%)]" />

      <div
        className={`relative mx-auto flex w-full ${maxWidthClass} flex-1 flex-col justify-center px-4 py-12`}
      >
        <div className="mb-8 flex items-center gap-3">
          <Image
            src={SITE_LOGO}
            alt="Build Pa'l Norte"
            width={40}
            height={40}
            className="rounded-lg"
            priority
          />
          <div>
            <p
              className="text-sm font-black tracking-tight text-white"
              style={{ fontFamily: montserrat }}
            >
              Build Pa&apos;l Norte
            </p>
            <p className="text-xs text-white/45" style={{ fontFamily: outfit }}>
              {eyebrow}
            </p>
          </div>
        </div>

        {children}
        {footer}
      </div>
    </main>
  );
}

export function AuthCard({
  eyebrow,
  children,
}: {
  eyebrow: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-white/10 bg-black/30 p-8">
      <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#aaff00]/25 bg-[#aaff00]/8 px-3 py-1">
        <span className="h-1.5 w-1.5 rounded-full bg-[#aaff00]" />
        <span
          className="text-[10px] font-black tracking-[0.28em] text-[#aaff00]"
          style={{ fontFamily: montserrat }}
        >
          {eyebrow}
        </span>
      </div>
      {children}
    </section>
  );
}
