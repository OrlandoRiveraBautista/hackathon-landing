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
  const isWide = maxWidth === "2xl";

  return (
    <main className="flex min-h-[100dvh] flex-col bg-[#050505] text-white lg:flex-row lg:overflow-hidden">

      {/* ── Brand panel: hero strip on mobile / full left column on desktop ── */}
      <div className="auth-panel-in relative w-full overflow-hidden lg:flex lg:w-[48%] xl:w-[52%]">
        {/* Dark base */}
        <div className="absolute inset-0 bg-[#050a05]" />

        {/* Animated blobs */}
        <div
          className="auth-blob-1 pointer-events-none absolute -top-32 -left-32 h-[520px] w-[520px] rounded-full opacity-30"
          style={{
            background: "radial-gradient(circle, rgba(170,255,0,0.55) 0%, rgba(100,200,0,0.2) 45%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <div
          className="auth-blob-2 pointer-events-none absolute top-1/2 -right-24 h-[420px] w-[420px] -translate-y-1/2 rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, rgba(0,220,130,0.6) 0%, rgba(0,180,100,0.2) 50%, transparent 70%)",
            filter: "blur(70px)",
          }}
        />
        <div
          className="auth-blob-3 pointer-events-none absolute -bottom-24 left-1/4 h-[360px] w-[360px] rounded-full opacity-25"
          style={{
            background: "radial-gradient(circle, rgba(170,255,0,0.4) 0%, rgba(50,150,0,0.15) 55%, transparent 72%)",
            filter: "blur(55px)",
          }}
        />

        {/* Mesh grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(170,255,0,0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(170,255,0,0.5) 1px, transparent 1px)
            `,
            backgroundSize: "48px 48px",
          }}
        />

        {/* Radial vignette */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_50%,transparent_40%,rgba(0,0,0,0.65)_100%)]" />

        {/* Bottom fade to form panel — mobile only */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-[#050505] to-transparent lg:hidden" />

        {/* Panel content */}
        <div className="relative z-10 flex w-full flex-col gap-6 p-6 sm:p-8 lg:min-h-screen lg:justify-between lg:gap-0 lg:p-10 xl:p-14">

          {/* Logo row */}
          <div className="flex items-center gap-3">
            <div className="auth-logo-float">
              <Image
                src={SITE_LOGO}
                alt="Build Pa'l Norte"
                width={40}
                height={40}
                className="rounded-xl shadow-[0_0_24px_rgba(170,255,0,0.35)]"
                priority
              />
            </div>
            <div>
              <p className="text-sm font-black tracking-tight text-white" style={{ fontFamily: montserrat }}>
                Build Pa&apos;l Norte
              </p>
              <p className="text-[11px] text-white/40" style={{ fontFamily: outfit }}>
                {eyebrow}
              </p>
            </div>
          </div>

          {/* ── Desktop hero copy ── */}
          <div className="hidden lg:block">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#aaff00]/20 bg-[#aaff00]/8 px-4 py-1.5">
              <span className="auth-badge-dot relative h-1.5 w-1.5 rounded-full bg-[#aaff00]" />
              <span className="text-[10px] font-black tracking-[0.28em] text-[#aaff00]" style={{ fontFamily: montserrat }}>
                {eyebrow}
              </span>
            </div>

            <h2 className="auth-shimmer-text text-4xl font-black leading-tight tracking-tight xl:text-5xl" style={{ fontFamily: montserrat }}>
              Code.<br />Create.<br />Compete.
            </h2>

            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/50" style={{ fontFamily: outfit }}>
              A 24-hour hackathon in Matamoros where young builders turn wild ideas into working prototypes.
            </p>

            <div className="mt-8 flex items-center gap-6 border-t border-white/8 pt-8">
              {[
                { value: "24H", label: "to build" },
                { value: "JUL 25", label: "event day" },
                { value: "MAM", label: "Matamoros" },
              ].map(({ value, label }) => (
                <div key={value}>
                  <p className="text-xl font-black text-[#aaff00]" style={{ fontFamily: montserrat }}>{value}</p>
                  <p className="text-[11px] uppercase tracking-wider text-white/35" style={{ fontFamily: outfit }}>{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Mobile compact tagline ── */}
          <div className="mt-4 lg:hidden">
            <h2 className="auth-shimmer-text text-[2rem] font-black leading-tight tracking-tight sm:text-4xl" style={{ fontFamily: montserrat }}>
              Code. Create. Compete.
            </h2>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5">
              {[
                { value: "24H", label: "to build" },
                { value: "JUL 25", label: "event day" },
                { value: "MAM", label: "Matamoros" },
              ].map(({ value, label }) => (
                <div key={value} className="flex items-center gap-1.5">
                  <span className="text-sm font-black text-[#aaff00]" style={{ fontFamily: montserrat }}>{value}</span>
                  <span className="text-[10px] text-white/35" style={{ fontFamily: outfit }}>{label}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className={`auth-form-in relative flex w-full flex-1 flex-col items-center justify-start px-5 pb-10 pt-6 sm:px-8 sm:py-10 lg:justify-center ${isWide ? "lg:px-10" : "lg:px-12 xl:px-16"}`}>
        {/* Subtle corner glow */}
        <div
          className="pointer-events-none absolute top-0 right-0 h-72 w-72 rounded-full opacity-25"
          style={{ background: "radial-gradient(circle, rgba(170,255,0,0.12) 0%, transparent 70%)", filter: "blur(40px)" }}
        />

        <div className={`relative w-full ${isWide ? "max-w-2xl" : "max-w-sm"}`}>
          {children}
          {footer && <div className="auth-item-in-4">{footer}</div>}
        </div>
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
    <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-[0_32px_64px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.05)] backdrop-blur-sm sm:p-8">
      {/* Top-edge highlight */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#aaff00]/25 to-transparent" />

      <div className="auth-item-in-1 mb-5 inline-flex items-center gap-2 rounded-full border border-[#aaff00]/25 bg-[#aaff00]/8 px-3 py-1">
        <span className="auth-badge-dot relative h-1.5 w-1.5 rounded-full bg-[#aaff00]" />
        <span className="text-[10px] font-black tracking-[0.28em] text-[#aaff00]" style={{ fontFamily: montserrat }}>
          {eyebrow}
        </span>
      </div>

      <div className="auth-item-in-2">{children}</div>
    </section>
  );
}
