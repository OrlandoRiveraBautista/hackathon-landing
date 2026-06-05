"use client";

import { useState } from "react";
import { AnimatedHero } from "@/components/AnimatedHero";
import { WaitlistModal } from "@/components/WaitlistModal";
import { SiteFooter } from "@/components/SiteFooter";
import { AboutSection } from "@/components/sections/AboutSection";
import { HighlightsSection } from "@/components/sections/HighlightsSection";
import { HowItWorksSection } from "@/components/sections/HowItWorksSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { CtaSection } from "@/components/sections/CtaSection";
import { SiteNav } from "@/components/SiteNav";
import { WaitlistCountProvider } from "@/components/WaitlistCountProvider";

export function LandingPage() {
  const [waitlistOpen, setWaitlistOpen] = useState(false);

  return (
    <WaitlistCountProvider>
      <SiteNav onRegisterClick={() => setWaitlistOpen(true)} />
      <AnimatedHero onRegisterClick={() => setWaitlistOpen(true)} />
      <AboutSection />
      <HighlightsSection />
      <HowItWorksSection />
      <FaqSection />
      <CtaSection onRegisterClick={() => setWaitlistOpen(true)} />
      <SiteFooter />
      <WaitlistModal
        open={waitlistOpen}
        onClose={() => setWaitlistOpen(false)}
      />
    </WaitlistCountProvider>
  );
}
