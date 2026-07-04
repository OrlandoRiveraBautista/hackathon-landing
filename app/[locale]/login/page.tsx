import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { MemberLoginScreen } from "@/components/MemberLoginScreen";
import { resolveSafeRedirect } from "@/lib/auth/redirect";
import { getSession } from "@/lib/auth/session";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale, localizedPath, memberHomePath } from "@/lib/i18n";
import { getWaitlistSignupByEmail } from "@/lib/waitlist-admin";

type LoginPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ next?: string; error?: string }>;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const dictionary = getDictionary(locale);
  return {
    title: dictionary.login.metaTitle,
    description: dictionary.login.metaDescription,
  };
}

function LoginPageFallback() {
  return (
    <main className="flex min-h-[100dvh] bg-[#050505]">
      <div className="hidden lg:block lg:w-[48%] xl:w-[52%] animate-pulse bg-white/[0.02]" />
      <div className="flex flex-1 flex-col items-center justify-center px-5 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 h-5 w-32 animate-pulse rounded-lg bg-white/5" />
          <div className="h-64 animate-pulse rounded-2xl border border-white/8 bg-white/[0.03]" />
        </div>
      </div>
    </main>
  );
}

async function LoginPageInner({ params, searchParams }: LoginPageProps) {
  const { locale } = await params;
  const { next, error } = await searchParams;

  if (!isLocale(locale)) {
    notFound();
  }

  const session = await getSession();
  const defaultNext = session?.user?.id
    ? memberHomePath(locale)
    : localizedPath(locale, "/home");

  const nextPath = resolveSafeRedirect(next, defaultNext);

  if (!error && session?.user?.email) {
    const signup = await getWaitlistSignupByEmail(session.user.email);
    if (signup) {
      redirect(nextPath);
    }
  }

  return (
    <MemberLoginScreen nextPath={nextPath} errorCode={error ?? null} />
  );
}

export default function LoginPage(props: LoginPageProps) {
  return (
    <Suspense fallback={<LoginPageFallback />}>
      <LoginPageInner {...props} />
    </Suspense>
  );
}
