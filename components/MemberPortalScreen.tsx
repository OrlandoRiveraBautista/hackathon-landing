"use client";

import Link from "next/link";
import { useState } from "react";
import { AuthCard, AuthShell } from "@/components/AuthShell";
import { useDictionary, useLocale } from "@/components/LocaleProvider";
import { authClient } from "@/lib/auth/client";
import { localizedPath } from "@/lib/i18n";
import { montserrat, outfit } from "@/lib/theme";

export function MemberPortalScreen() {
  const dictionary = useDictionary();
  const { locale } = useLocale();
  const { members } = dictionary;
  const { data: session } = authClient.useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function signOut() {
    setError("");
    setLoading(true);

    try {
      await authClient.signOut();
      window.location.href = localizedPath(locale, "/login");
    } catch {
      setError(members.signOutFailed);
      setLoading(false);
    }
  }

  return (
    <AuthShell eyebrow={members.eyebrow} maxWidth="2xl">
      <AuthCard eyebrow={members.eyebrow}>
        <h1
          className="text-2xl font-black tracking-tight text-white sm:text-3xl"
          style={{ fontFamily: montserrat }}
        >
          {members.title}
        </h1>

        <p
          className="mt-3 max-w-xl text-sm leading-relaxed text-white/50"
          style={{ fontFamily: outfit }}
        >
          {members.subtitle}
        </p>

        {session?.user?.email && (
          <div className="mt-6 flex items-center gap-3 rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#aaff00]/15 text-xs font-black text-[#aaff00]" style={{ fontFamily: montserrat }}>
              {session.user.email.charAt(0).toUpperCase()}
            </div>
            <p className="text-sm text-white/70">{session.user.email}</p>
          </div>
        )}

        {error && (
          <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-red-500/20 bg-red-500/8 px-4 py-3">
            <span className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-400" />
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-white/8 pt-6">
          <button
            type="button"
            onClick={signOut}
            disabled={loading}
            className="group relative cursor-pointer overflow-hidden rounded-full border border-[#aaff00]/40 bg-[#aaff00]/10 px-6 py-2.5 text-xs font-black tracking-[0.12em] text-[#aaff00] transition-all duration-200 hover:border-[#aaff00]/70 hover:bg-[#aaff00]/20 hover:shadow-[0_0_20px_rgba(170,255,0,0.2)] disabled:cursor-not-allowed disabled:opacity-60"
            style={{ fontFamily: montserrat }}
          >
            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[#aaff00]/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            {loading ? members.signingOut : members.signOut}
          </button>

          <Link
            href={localizedPath(locale)}
            className="text-sm text-white/40 transition-colors duration-200 hover:text-[#aaff00]"
            style={{ fontFamily: outfit }}
          >
            {members.backToHome}
          </Link>
        </div>
      </AuthCard>
    </AuthShell>
  );
}
