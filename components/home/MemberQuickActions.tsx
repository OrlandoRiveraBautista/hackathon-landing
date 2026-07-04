import type { ReactNode } from "react";
import { PlatformActionCard, SectionLabel } from "@/components/platform";
import { outfit } from "@/lib/theme";

type QuickAction = {
  id: string;
  title: string;
  description: string;
  icon: ReactNode;
  href?: string;
  comingSoon?: boolean;
};

type MemberQuickActionsProps = {
  label: string;
  actions: QuickAction[];
  comingSoonLabel: string;
  openLabel: string;
};

export function MemberQuickActions({
  label,
  actions,
  comingSoonLabel,
  openLabel,
}: MemberQuickActionsProps) {
  return (
    <section className="auth-item-in-4 mt-8">
      <SectionLabel>{label}</SectionLabel>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {actions.map((action) => (
          <PlatformActionCard
            key={action.id}
            title={action.title}
            description={action.description}
            icon={action.icon}
            href={action.href}
            comingSoon={action.comingSoon}
            comingSoonLabel={comingSoonLabel}
            openLabel={openLabel}
          />
        ))}
      </div>
    </section>
  );
}
