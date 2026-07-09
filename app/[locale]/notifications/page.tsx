import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { NotificationCenterScreen } from "@/components/NotificationCenterScreen";
import { getSession } from "@/lib/auth/session";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale, localizedPath } from "@/lib/i18n";
import { getPendingInvitesForUser } from "@/lib/teams/invites";
import { getWaitlistSignupByEmail } from "@/lib/waitlist-admin";

type NotificationsPageProps = {
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
    title: dictionary.notifications.metaTitle,
    description: dictionary.notifications.metaDescription,
  };
}

export default async function NotificationsPage({ params }: NotificationsPageProps) {
  const { locale } = await params;
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

  const invites = await getPendingInvitesForUser(userId);

  return <NotificationCenterScreen initialInvites={invites} />;
}
