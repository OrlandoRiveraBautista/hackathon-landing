import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import { MemberDirectoryScreen } from "@/components/MemberDirectoryScreen";
import { getSession } from "@/lib/auth/session";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale, localizedPath, parseMembersDirectorySearch } from "@/lib/i18n";
import { searchMembers } from "@/lib/members";
import { toPublicMemberProfile } from "@/lib/members/shared";
import { getTeamByUserId } from "@/lib/teams";
import { getWaitlistSignupByEmail } from "@/lib/waitlist-admin";

type MembersPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string; openToTeams?: string }>;
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
    title: dictionary.members.directory.metaTitle,
    description: dictionary.members.directory.metaDescription,
  };
}

export default async function MembersPage({ params, searchParams }: MembersPageProps) {
  const { locale } = await params;
  const rawSearchParams = await searchParams;
  const { q, openToTeams } = parseMembersDirectorySearch(rawSearchParams);

  if (!isLocale(locale)) {
    notFound();
  }

  const session = await getSession();
  const userId = session?.user?.id;
  const email = session?.user?.email;

  if (!email || !userId) {
    redirect(localizedPath(locale, "/login"));
  }

  const signup = await getWaitlistSignupByEmail(email);
  if (!signup) {
    redirect(`${localizedPath(locale, "/login")}?error=not_registered`);
  }

  const [result, myTeam] = await Promise.all([
    searchMembers({ query: q, openToTeams }),
    getTeamByUserId(userId),
  ]);

  const captainTeam =
    myTeam && myTeam.captainUserId === userId ? myTeam : null;

  return (
    <Suspense fallback={null}>
      <MemberDirectoryScreen
        initialMembers={result.members.map(toPublicMemberProfile)}
        initialTotal={result.total}
        initialTotalPages={result.totalPages}
        initialQuery={q}
        initialOpenToTeams={openToTeams}
        captainTeamId={captainTeam?.id ?? null}
        captainTeamMemberIds={captainTeam?.members.map((m) => m.userId) ?? null}
        captainTeamMaxMembers={captainTeam?.maxMembers ?? null}
        viewerUserId={userId}
      />
    </Suspense>
  );
}
