import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { MemberPortalScreen } from "@/components/MemberPortalScreen";
import { getSession } from "@/lib/auth/session";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale, localizedPath } from "@/lib/i18n";
import { getWaitlistSignupByEmail } from "@/lib/waitlist-admin";

type MembersPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: MembersPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const dictionary = getDictionary(locale);
  return {
    title: dictionary.members.metaTitle,
    description: dictionary.members.metaDescription,
  };
}

export default async function MembersPage({ params }: MembersPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }

  const session = await getSession();
  const email = session?.user?.email;

  if (!email) {
    redirect(localizedPath(locale, "/login"));
  }

  const signup = await getWaitlistSignupByEmail(email);
  if (!signup) {
    redirect(
      `${localizedPath(locale, "/login")}?error=not_registered`,
    );
  }

  return <MemberPortalScreen />;
}
