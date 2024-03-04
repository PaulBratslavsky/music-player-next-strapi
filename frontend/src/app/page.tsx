import React from "react";
import HeroSection from "@/components/custom/HeroSection";
import MusicSection from "@/components/custom/MusicSection";

export default async function Home() {
  return (
    <React.Fragment>
      <HeroSection />
      <MusicSection />
    </React.Fragment>
  );
}
