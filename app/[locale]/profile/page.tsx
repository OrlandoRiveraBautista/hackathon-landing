import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale } from "@/lib/i18n";
import { ProfilePage } from "@/components/page/Profile";

type ProfilePageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const { profile } = getDictionary(locale);
  return {
    title: profile.title,
    description: profile.subtitle,
  };
}

export default async function ProfileRoutePage({ params }: ProfilePageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const { profile } = getDictionary(locale);

  return <ProfilePage profile={profile} locale={locale} />;
}
