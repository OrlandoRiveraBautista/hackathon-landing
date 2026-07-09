import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { TeamScreen } from "@/components/TeamScreen";
import { getSession } from "@/lib/auth/session";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale, localizedPath } from "@/lib/i18n";
import { getOrCreateMember } from "@/lib/members";
import { getTeamByUserId } from "@/lib/teams";
import { getWaitlistSignupByEmail } from "@/lib/waitlist-admin";

type TeamPageProps = {
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
    title: dictionary.team.metaTitle,
    description: dictionary.team.metaDescription,
  };
}

export default async function TeamPage({ params }: TeamPageProps) {
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

  const [member, team] = await Promise.all([
    getOrCreateMember(userId, signup),
    getTeamByUserId(userId),
  ]);

  return <TeamScreen member={member} initialTeam={team} />;
}
