"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useDictionary, useLocale } from "@/components/LocaleProvider";
import { GoogleIcon } from "@/components/GoogleIcon";
import { authClient } from "@/lib/auth/client";
import { SITE_LOGO } from "@/lib/brand";
import { localizedPath } from "@/lib/i18n";
import { montserrat, outfit } from "@/lib/theme";

type MemberLoginScreenProps = {
  nextPath: string;
};

export function MemberLoginScreen({ nextPath }: MemberLoginScreenProps) {
  const dictionary = useDictionary();
  const { locale } = useLocale();
  const { login } = dictionary;
  const { data: session } = authClient.useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function signInWithGoogle() {
    setError("");
    setLoading(true);

    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: nextPath,
      });
    } catch {
      setError(login.signInFailed);
      setLoading(false);
    }
  }

  async function signOut() {
    setError("");
    setLoading(true);

    try {
      await authClient.signOut();
      window.location.href = localizedPath(locale, "/login");
    } catch {
      setError(login.signOutFailed);
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-[100dvh] flex-col bg-[#050505] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_45%_at_50%_0%,rgba(170,255,0,0.07)_0%,transparent_65%)]" />

      <div className="relative mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-12">
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
              {login.eyebrow}
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
              {login.eyebrow}
            </span>
          </div>

          <h1
            className="text-2xl font-black tracking-tight text-white"
            style={{ fontFamily: montserrat }}
          >
            {login.title}
          </h1>

          <p
            className="mt-2 text-sm leading-relaxed text-white/55"
            style={{ fontFamily: outfit }}
          >
            {login.subtitle}
          </p>

          {error && <p className="mt-5 text-sm text-red-400">{error}</p>}

          <button
            type="button"
            onClick={signInWithGoogle}
            disabled={loading}
            className="mt-6 flex w-full cursor-pointer items-center justify-center gap-3 rounded-lg border border-[#747775] bg-white px-4 py-2.5 text-sm font-medium text-[#1f1f1f] shadow-sm transition-colors hover:border-[#5f6368] hover:bg-[#f1f3f4] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <GoogleIcon />
            {loading ? login.signingIn : login.signInWithGoogle}
          </button>

          {session?.user && (
            <div className="mt-6 border-t border-white/10 pt-6">
              <p className="text-sm text-white/50">
                {login.signedInAs}{" "}
                <span className="text-white/75">{session.user.email}</span>
              </p>
              <button
                type="button"
                onClick={signOut}
                disabled={loading}
                className="mt-3 cursor-pointer text-sm text-white/70 underline-offset-4 transition-colors hover:text-white hover:underline disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? login.signingOut : login.signOut}
              </button>
            </div>
          )}
        </section>

        <Link
          href={localizedPath(locale)}
          className="mt-6 text-center text-sm text-white/40 transition-colors hover:text-[#aaff00]"
          style={{ fontFamily: outfit }}
        >
          {login.backToHome}
        </Link>
      </div>
    </main>
  );
}
