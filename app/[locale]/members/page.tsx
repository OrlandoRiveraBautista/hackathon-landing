import type { Metadata } from "next";
import { MemberPortalScreen } from "@/components/MemberPortalScreen";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale } from "@/lib/i18n";

type MembersPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: MembersPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const dictionary = getDictionary(locale);
  return {
    title: dictionary.members.metaTitle,
    description: dictionary.members.metaDescription,
  };
}

export default function MembersPage() {
  return <MemberPortalScreen />;
}
