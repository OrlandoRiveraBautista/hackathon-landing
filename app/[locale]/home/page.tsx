import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { MemberHomeScreen } from "@/components/MemberHomeScreen";
import { getSession } from "@/lib/auth/session";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale, localizedPath } from "@/lib/i18n";
import { getOrCreateMember } from "@/lib/members";
import { getWaitlistSignupByEmail } from "@/lib/waitlist-admin";

type HomePageProps = {
  params: Promise<{ locale: string }>;
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
    title: dictionary.members.metaTitle,
    description: dictionary.members.metaDescription,
  };
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }

  const session = await getSession();
  const userId = session?.user?.id;
  const email = session?.user?.email;

  if (!userId || !email) {
    redirect(localizedPath(locale, "/login"));
  }

  const signup = await getWaitlistSignupByEmail(email);
  if (!signup) {
    redirect(`${localizedPath(locale, "/login")}?error=not_registered`);
  }

  const member = await getOrCreateMember(userId, signup);

  return (
    <MemberHomeScreen member={member} userImage={session.user.image} />
  );
}
