import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { isLocale, localizedPath, memberHomePath } from "@/lib/i18n";
import { getWaitlistSignupByEmail } from "@/lib/waitlist-admin";

type ProfileIndexPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function ProfileIndexPage({ params }: ProfileIndexPageProps) {
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

  redirect(memberHomePath(locale));
}
