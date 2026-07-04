import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { MemberLoginScreen } from "@/components/MemberLoginScreen";
import { resolveSafeRedirect } from "@/lib/auth/redirect";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale, localizedPath } from "@/lib/i18n";

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
    <main className="relative flex min-h-[100dvh] flex-col bg-[#050505]">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-12">
        <div className="mb-8 h-10 w-44 animate-pulse rounded-lg bg-white/5" />
        <div className="h-72 animate-pulse rounded-2xl border border-white/10 bg-black/30" />
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

  const nextPath = resolveSafeRedirect(
    next,
    localizedPath(locale, "/members"),
  );

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
