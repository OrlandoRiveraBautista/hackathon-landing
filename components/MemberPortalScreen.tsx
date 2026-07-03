"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useDictionary, useLocale } from "@/components/LocaleProvider";
import { authClient } from "@/lib/auth/client";
import { SITE_LOGO } from "@/lib/brand";
import { localizedPath } from "@/lib/i18n";
import { montserrat, outfit } from "@/lib/theme";

export function MemberPortalScreen() {
  const dictionary = useDictionary();
  const { locale } = useLocale();
  const { members } = dictionary;
  const { data: session } = authClient.useSession();
  const [loading, setLoading] = useState(false);

  async function signOut() {
    setLoading(true);

    try {
      await authClient.signOut();
      window.location.href = localizedPath(locale, "/login");
    } catch {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-[100dvh] flex-col bg-[#050505] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_45%_at_50%_0%,rgba(170,255,0,0.07)_0%,transparent_65%)]" />

      <div className="relative mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-4 py-12">
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
              {members.eyebrow}
            </p>
          </div>
        </div>

        <section className="rounded-2xl border border-white/10 bg-black/30 p-8">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#aaff00]/25 bg-[#aaff00]/8 px-3 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[#aaff00]" />
            <span
              className="text-[10px] font-black tracking-[0.28em] text-[#aaff00]"
              style={{ fontFamily: montserrat }}
            >
              {members.eyebrow}
            </span>
          </div>

          <h1
            className="text-2xl font-black tracking-tight text-white sm:text-3xl"
            style={{ fontFamily: montserrat }}
          >
            {members.title}
          </h1>

          <p
            className="mt-3 max-w-xl text-sm leading-relaxed text-white/55"
            style={{ fontFamily: outfit }}
          >
            {members.subtitle}
          </p>

          {session?.user?.email && (
            <p className="mt-6 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/70">
              {session.user.email}
            </p>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-white/10 pt-6">
            <button
              type="button"
              onClick={signOut}
              disabled={loading}
              className="cursor-pointer rounded-full border border-[#aaff00]/40 bg-[#aaff00]/10 px-5 py-2 text-xs font-black tracking-[0.12em] text-[#aaff00] transition-colors hover:border-[#aaff00]/70 hover:bg-[#aaff00]/20 disabled:cursor-not-allowed disabled:opacity-60"
              style={{ fontFamily: montserrat }}
            >
              {loading ? members.signingOut : members.signOut}
            </button>

            <Link
              href={localizedPath(locale)}
              className="text-sm text-white/40 transition-colors hover:text-[#aaff00]"
              style={{ fontFamily: outfit }}
            >
              {members.backToHome}
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
