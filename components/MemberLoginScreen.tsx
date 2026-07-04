"use client";

import Link from "next/link";
import { useState } from "react";
import { AuthCard, AuthShell } from "@/components/AuthShell";
import { useDictionary, useLocale } from "@/components/LocaleProvider";
import { GoogleIcon } from "@/components/GoogleIcon";
import { authClient } from "@/lib/auth/client";
import { localizedPath } from "@/lib/i18n";
import { montserrat, outfit } from "@/lib/theme";

type MemberLoginScreenProps = {
  nextPath: string;
  errorCode?: string | null;
};

function resolveInitialError(
  errorCode: string | null | undefined,
  notRegistered: string,
) {
  if (errorCode === "not_registered") {
    return notRegistered;
  }

  return "";
}

export function MemberLoginScreen({
  nextPath,
  errorCode,
}: MemberLoginScreenProps) {
  const dictionary = useDictionary();
  const { locale } = useLocale();
  const { login } = dictionary;
  const { data: session } = authClient.useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(() =>
    resolveInitialError(errorCode, login.notRegistered),
  );

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
    <AuthShell
      eyebrow={login.eyebrow}
      footer={
        <Link
          href={localizedPath(locale)}
          className="mt-6 block text-center text-sm text-white/40 transition-colors hover:text-[#aaff00]"
          style={{ fontFamily: outfit }}
        >
          {login.backToHome}
        </Link>
      }
    >
      <AuthCard eyebrow={login.eyebrow}>
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
      </AuthCard>
    </AuthShell>
  );
}
