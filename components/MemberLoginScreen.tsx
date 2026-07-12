"use client";

import Link from "next/link";
import { useState } from "react";
import { AuthCard, AuthShell } from "@/components/AuthShell";
import { useDictionary, useLocale } from "@/components/LocaleProvider";
import { GoogleIcon } from "@/components/GoogleIcon";
import { authClient } from "@/lib/auth/client";
import { isOnsiteSelectionPath, localizedPath } from "@/lib/i18n";
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

  const fromOnsite = isOnsiteSelectionPath(nextPath);

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
        <div className="mt-6 space-y-3">
          {fromOnsite && (
            <Link
              href={nextPath}
              className="block text-center text-sm font-semibold text-[#aaff00] transition-colors duration-200 hover:text-[#c8ff40]"
              style={{ fontFamily: outfit }}
            >
              {login.backToOnsite}
            </Link>
          )}
          <Link
            href={localizedPath(locale)}
            className="block text-center text-sm text-white/40 transition-colors duration-200 hover:text-[#aaff00]"
            style={{ fontFamily: outfit }}
          >
            {login.backToHome}
          </Link>
        </div>
      }
    >
      <AuthCard eyebrow={login.eyebrow}>
        <h1
          className="text-2xl font-black tracking-tight text-white sm:text-3xl"
          style={{ fontFamily: montserrat }}
        >
          {login.title}
        </h1>

        <p
          className="mt-2 text-sm leading-relaxed text-white/50"
          style={{ fontFamily: outfit }}
        >
          {fromOnsite ? login.onsiteSubtitle : login.subtitle}
        </p>

        {error && (
          <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-red-500/20 bg-red-500/8 px-4 py-3">
            <span className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-400" />
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Google sign-in button */}
        <button
          type="button"
          onClick={signInWithGoogle}
          disabled={loading}
          className={`
            group auth-item-in-3 relative mt-6 flex w-full cursor-pointer items-center justify-center gap-3 overflow-hidden
            rounded-xl border border-white/12 bg-white/[0.06] px-5 py-3.5
            text-sm font-semibold text-white/90
            shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]
            transition-all duration-200
            hover:border-[#aaff00]/40 hover:bg-white/[0.1] hover:shadow-[0_0_20px_rgba(170,255,0,0.12),inset_0_1px_0_rgba(255,255,255,0.15)]
            disabled:cursor-not-allowed disabled:opacity-50
          `}
          style={{ fontFamily: outfit }}
        >
          {/* Shimmer on hover */}
          <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

          {loading ? (
            <span className="flex items-center gap-2.5">
              <span className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="h-1.5 w-1.5 rounded-full bg-[#aaff00]"
                    style={{
                      animation: `auth-item-in 0.6s ease-in-out ${i * 0.15}s infinite alternate`,
                    }}
                  />
                ))}
              </span>
              {login.signingIn}
            </span>
          ) : (
            <>
              <GoogleIcon />
              {login.signInWithGoogle}
            </>
          )}
        </button>

        {/* Divider */}
        <div className="mt-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-white/8" />
          <span className="text-[11px] text-white/25" style={{ fontFamily: outfit }}>
            secure sign-in
          </span>
          <div className="h-px flex-1 bg-white/8" />
        </div>

        {/* Trust badges */}
        <div className="mt-4 flex items-center justify-center gap-4 auth-item-in-4">
          {["No password needed", "Google OAuth", "Free access"].map((text) => (
            <div key={text} className="flex items-center gap-1.5">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-[#aaff00]">
                <path d="M2 6l2.5 2.5L10 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-[10px] text-white/30" style={{ fontFamily: outfit }}>
                {text}
              </span>
            </div>
          ))}
        </div>

        {/* Signed-in state */}
        {session?.user && (
          <div className="mt-6 rounded-xl border border-white/8 bg-white/[0.03] p-4">
            <p className="text-xs text-white/40" style={{ fontFamily: outfit }}>
              {login.signedInAs}
            </p>
            <p className="mt-1 text-sm font-medium text-white/80">{session.user.email}</p>
            <button
              type="button"
              onClick={signOut}
              disabled={loading}
              className="mt-3 cursor-pointer text-xs text-white/40 underline underline-offset-4 transition-colors hover:text-[#aaff00] disabled:cursor-not-allowed disabled:opacity-60"
              style={{ fontFamily: outfit }}
            >
              {loading ? login.signingOut : login.signOut}
            </button>
          </div>
        )}
      </AuthCard>
    </AuthShell>
  );
}
