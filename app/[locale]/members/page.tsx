import { notFound, redirect } from "next/navigation";
import { isLocale, localizedPath } from "@/lib/i18n";

type MembersPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function MembersPage({ params }: MembersPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }

  redirect(localizedPath(locale, "/profile"));
}
