import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import StatsBar from "../components/StatsBar";
import TrustedBy from "../components/TrustedBy";
import HowItWorks from "../components/HowItWorks";
import RolesSection from "../components/RolesSection";
import FeaturesGrid from "../components/FeaturesGrid";
import PaymentsSection from "../components/PaymentsSection";
import CTABanner from "../components/CTABanner";
import Footer from "../components/Footer";
import Divider from "../components/ui/Divider";

export default function LandingPage() {
  return (
    <div className="bg-[#F6F4EC] text-neutral-900 min-h-screen antialiased selection:bg-orange-200 transition-colors duration-300">
      <Navbar />

      <Hero />
      <Divider tone="light" />

      <StatsBar />
      {/* TrustedBy has its own full-bleed background + border, no inset divider needed */}
      <TrustedBy />

      <HowItWorks />
      <Divider tone="light" />

      <RolesSection />
      <Divider tone="light" />

      <FeaturesGrid />
      <Divider tone="light" />

      <PaymentsSection />

      <CTABanner />
      <Divider tone="light" />

      <Footer />
    </div>
  );
}
