import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { MemberProfileScreen } from "@/components/MemberProfileScreen";
import { getSession } from "@/lib/auth/session";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale, localizedPath } from "@/lib/i18n";
import { getMemberByUserId, getOrCreateMember } from "@/lib/members";
import { toPublicMemberProfile } from "@/lib/members/shared";
import { getTeamByUserId } from "@/lib/teams";
import { getPendingInviteUserIdsForTeam } from "@/lib/teams/invites";
import { getWaitlistSignupByEmail } from "@/lib/waitlist-admin";

type ProfilePageProps = {
  params: Promise<{ locale: string; userId: string }>;
};

function memberMeta(
  dictionary: ReturnType<typeof getDictionary>,
  name: string,
) {
  return {
    title: dictionary.profile.metaTitleMember.replace("{name}", name),
    description: dictionary.profile.metaDescriptionMember.replace("{name}", name),
  };
}

export async function generateMetadata({
  params,
}: ProfilePageProps): Promise<Metadata> {
  const { locale, userId } = await params;
  if (!isLocale(locale)) return {};

  const dictionary = getDictionary(locale);
  const session = await getSession();
  const isOwnProfile = session?.user?.id === userId;

  if (isOwnProfile) {
    return {
      title: dictionary.profile.metaTitle,
      description: dictionary.profile.metaDescription,
    };
  }

  const member = await getMemberByUserId(userId);
  if (!member) {
    return {
      title: dictionary.profile.metaTitle,
      description: dictionary.profile.metaDescription,
    };
  }

  return memberMeta(dictionary, member.name);
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { locale, userId } = await params;
  if (!isLocale(locale)) {
    notFound();
  }

  const session = await getSession();
  const viewerId = session?.user?.id;
  const email = session?.user?.email;

  if (!email || !viewerId) {
    redirect(localizedPath(locale, "/login"));
  }

  const signup = await getWaitlistSignupByEmail(email);
  if (!signup) {
    redirect(`${localizedPath(locale, "/login")}?error=not_registered`);
  }

  const isOwnProfile = viewerId === userId;

  if (isOwnProfile) {
    const member = await getOrCreateMember(viewerId, signup);
    return (
      <MemberProfileScreen
        isOwnProfile
        member={member}
        userImage={session.user.image}
        shirtSize={signup.shirtSize}
      />
    );
  }

  const [member, viewerTeam] = await Promise.all([
    getMemberByUserId(userId),
    getTeamByUserId(viewerId),
  ]);

  if (!member) {
    notFound();
  }

  const captainTeam =
    viewerTeam && viewerTeam.captainUserId === viewerId ? viewerTeam : null;

  const pendingInviteUserIds = captainTeam
    ? await getPendingInviteUserIdsForTeam(captainTeam.id)
    : [];

  return (
    <MemberProfileScreen
      isOwnProfile={false}
      member={toPublicMemberProfile(member)}
      userImage={null}
      captainTeam={
        captainTeam
          ? {
              id: captainTeam.id,
              memberIds: captainTeam.members.map((m) => m.userId),
              maxMembers: captainTeam.maxMembers,
              inviteSent: pendingInviteUserIds.includes(userId),
            }
          : null
      }
    />
  );
}
