import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { TeamScreen } from "@/components/TeamScreen";
import { getSession } from "@/lib/auth/session";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale, localizedPath } from "@/lib/i18n";
import { getOrCreateMemberForUser } from "@/lib/members";
import { getTeamByUserId } from "@/lib/teams";

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

  const [member, team] = await Promise.all([
    getOrCreateMemberForUser(userId, {
      email,
      name: session.user.name,
    }),
    getTeamByUserId(userId),
  ]);

  return <TeamScreen member={member} initialTeam={team} />;
}
