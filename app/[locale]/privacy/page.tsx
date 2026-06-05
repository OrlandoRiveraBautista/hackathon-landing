import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalLayout, LegalSection } from "@/components/LegalLayout";
import { LegalBlocks } from "@/components/LegalBlocks";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale } from "@/lib/i18n";

type PrivacyPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PrivacyPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const { legal } = getDictionary(locale);
  return {
    title: legal.privacy.metaTitle,
    description: legal.privacy.metaDescription,
  };
}

export default async function PrivacyPage({ params }: PrivacyPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const { legal } = getDictionary(locale);

  return (
    <LegalLayout
      title={legal.privacy.title}
      lastUpdated={legal.lastUpdated}
      lastUpdatedLabel={locale === "es" ? "Última actualización:" : "Last updated:"}
    >
      {legal.privacy.sections.map((section) => (
        <LegalSection key={section.title} title={section.title}>
          <LegalBlocks blocks={section.blocks} />
        </LegalSection>
      ))}
    </LegalLayout>
  );
}
