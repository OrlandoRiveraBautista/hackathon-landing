import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { MemberProfileScreen } from "@/components/MemberProfileScreen";
import { getSession } from "@/lib/auth/session";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale, localizedPath } from "@/lib/i18n";
import { getOrCreateMember } from "@/lib/members";
import { getWaitlistSignupByEmail } from "@/lib/waitlist-admin";

type ProfilePageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: ProfilePageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const dictionary = getDictionary(locale);
  return {
    title: dictionary.profile.metaTitle,
    description: dictionary.profile.metaDescription,
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
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
    redirect(`${localizedPath(locale, "/login")}?error=not_registered`);
  }

  const member = await getOrCreateMember(session.user.id, signup);

  return (
    <MemberProfileScreen
      member={member}
      waitlistStatus={signup.status}
      userImage={session.user.image}
    />
  );
}
