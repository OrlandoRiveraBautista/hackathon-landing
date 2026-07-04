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

        {error && <p className="mt-5 text-sm text-red-400">{error}</p>}

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
      </AuthCard>
    </AuthShell>
  );
}
