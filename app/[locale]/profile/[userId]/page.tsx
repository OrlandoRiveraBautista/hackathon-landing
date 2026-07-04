import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { MemberProfileScreen } from "@/components/MemberProfileScreen";
import { getSession } from "@/lib/auth/session";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale, localizedPath } from "@/lib/i18n";
import { getMemberByUserId, getOrCreateMember } from "@/lib/members";
import { toPublicMemberProfile } from "@/lib/members/shared";
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
  const email = session?.user?.email;

  if (!email) {
    redirect(localizedPath(locale, "/login"));
  }

  const signup = await getWaitlistSignupByEmail(email);
  if (!signup) {
    redirect(`${localizedPath(locale, "/login")}?error=not_registered`);
  }

  const isOwnProfile = session.user.id === userId;

  if (isOwnProfile) {
    const member = await getOrCreateMember(session.user.id, signup);

    return (
      <MemberProfileScreen
        isOwnProfile
        member={member}
        waitlistStatus={signup.status}
        userImage={session.user.image}
      />
    );
  }

  const member = await getMemberByUserId(userId);
  if (!member) {
    notFound();
  }

  return (
    <MemberProfileScreen
      isOwnProfile={false}
      member={toPublicMemberProfile(member)}
      waitlistStatus={null}
      userImage={null}
    />
  );
}
