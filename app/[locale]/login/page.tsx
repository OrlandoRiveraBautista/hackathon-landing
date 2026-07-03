import type { Metadata } from "next";
import { Suspense } from "react";
import { MemberLoginScreen } from "@/components/MemberLoginScreen";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale, localizedPath } from "@/lib/i18n";

type LoginPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ next?: string }>;
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

async function LoginPageInner({
  params,
  searchParams,
}: LoginPageProps) {
  const { locale } = await params;
  const { next } = await searchParams;

  if (!isLocale(locale)) {
    return null;
  }

  const nextPath =
    next && next.startsWith("/") ? next : localizedPath(locale, "/members");

  return <MemberLoginScreen nextPath={nextPath} />;
}

export default function LoginPage(props: LoginPageProps) {
  return (
    <Suspense fallback={null}>
      <LoginPageInner {...props} />
    </Suspense>
  );
}
