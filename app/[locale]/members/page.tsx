import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { isLocale, localizedPath, memberProfilePath } from "@/lib/i18n";

type MembersPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function MembersPage({ params }: MembersPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }

  const session = await getSession();
  if (session?.user?.id) {
    redirect(memberProfilePath(locale, session.user.id));
  }

  redirect(localizedPath(locale, "/login"));
}
