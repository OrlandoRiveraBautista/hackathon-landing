import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OnsiteSelectionPageClient } from "@/components/OnsiteSelectionPageClient";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale } from "@/lib/i18n";

type OnsitePageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: OnsitePageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const { onsiteSelection } = getDictionary(locale);
  return {
    title: onsiteSelection.metaTitle,
    description: onsiteSelection.metaDescription,
  };
}

export default async function OnsitePage({ params }: OnsitePageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return <OnsiteSelectionPageClient />;
}
