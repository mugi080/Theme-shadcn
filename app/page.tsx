"use client";

import { useState, useEffect } from "react";
import { LIGHT, DARK } from "@/lib/constants";
import { GLOBAL_STYLES } from "@/lib/styles";
import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/layout/HeroSection";
import FeaturesSection from "@/components/layout/FeaturesSection"; // Corrected import
import AnnouncementsSlideshow from "@/components/layout/AnnouncementsSlideshow"; // Fixed import
import CTASection from "@/components/layout/CTASection"; // Corrected import
import Footer from "@/components/layout/Footer"; // Fixed import

export default function HRISLandingPage() {
  const [dark, setDark] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

  const t = dark ? DARK : LIGHT;

  return (
    <div
      style={{
        backgroundColor: t.bg,
        color: t.text,
        transition: "background-color .3s, color .3s",
        minHeight: "100vh",
      }}
    >
      {/* Global styles injected once */}
      <style>{GLOBAL_STYLES}</style>

      {/* ── Layout shell ── */}
      <Navbar dark={dark} onToggleDark={() => setDark(v => !v)} t={t} />

      {/* ── Page sections ── */}
      <HeroSection t={t} visible={visible} />
      <FeaturesSection t={t} />
      <AnnouncementsSlideshow t={t} />
      <CTASection />
      <Footer t={t} />
    </div>
  );
}