"use client";

import { useState, useCallback } from "react";
import { AnimatedHero } from "@/components/AnimatedHero";
import { SponsorModal } from "@/components/SponsorModal";
import { WaitlistModal } from "@/components/WaitlistModal";
import { SiteFooter } from "@/components/SiteFooter";
import { MarqueeTicker } from "@/components/MarqueeTicker";
import { AboutSection } from "@/components/sections/AboutSection";
import { HighlightsSection } from "@/components/sections/HighlightsSection";
import { PrizesSection } from "@/components/sections/PrizesSection";
import { ShirtSection } from "@/components/sections/ShirtSection";
import { HowItWorksSection } from "@/components/sections/HowItWorksSection";
import { OnsiteFloatingBanner } from "@/components/OnsiteFloatingBanner";
import { FaqSection } from "@/components/sections/FaqSection";
import { CtaSection } from "@/components/sections/CtaSection";
import { SponsorsSection } from "@/components/sections/SponsorsSection";
import { SiteNav } from "@/components/SiteNav";
import { WaitlistCountProvider } from "@/components/WaitlistCountProvider";
import { SplashScreen } from "@/components/SplashScreen";

export function LandingPage() {
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const [sponsorOpen, setSponsorOpen] = useState(false);
  const [heroReady, setHeroReady] = useState(false);
  const [splashDone, setSplashDone] = useState(false);

  const handleSplashReady = useCallback(() => setHeroReady(true), []);
  const handleSplashComplete = useCallback(() => setSplashDone(true), []);

  return (
    <WaitlistCountProvider>
      {!splashDone && (
        <SplashScreen
          onReady={handleSplashReady}
          onComplete={handleSplashComplete}
        />
      )}
      <SiteNav onRegisterClick={() => setWaitlistOpen(true)} />
      <AnimatedHero
        onRegisterClick={() => setWaitlistOpen(true)}
        ready={heroReady}
      />
      <MarqueeTicker />
      <AboutSection />
      <SponsorsSection onSponsorClick={() => setSponsorOpen(true)} />
      <HighlightsSection />
      <PrizesSection />
      <ShirtSection onRegisterClick={() => setWaitlistOpen(true)} />
      <HowItWorksSection />
      <FaqSection />
      <CtaSection onRegisterClick={() => setWaitlistOpen(true)} />
      <SiteFooter onSponsorClick={() => setSponsorOpen(true)} />
      <WaitlistModal
        open={waitlistOpen}
        onClose={() => setWaitlistOpen(false)}
      />
      <SponsorModal open={sponsorOpen} onClose={() => setSponsorOpen(false)} />
      <OnsiteFloatingBanner visible={splashDone} />
    </WaitlistCountProvider>
  );
}
