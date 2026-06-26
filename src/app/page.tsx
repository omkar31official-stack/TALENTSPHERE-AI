'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { HeroSection } from '@/components/landing/hero-section';
import { FeaturesSection } from '@/components/landing/features-section';
import { ParticlesBg } from '@/components/shared/particles-bg';

const IntroAnimation = dynamic(
  () => import('@/components/landing/intro-animation').then((m) => m.IntroAnimation),
  { ssr: false }
);

const MatrixRain = dynamic(
  () => import('@/components/shared/matrix-rain').then((m) => m.MatrixRain),
  { ssr: false }
);

export default function Home() {
  const [introComplete, setIntroComplete] = useState(false);
  const handleIntroComplete = useCallback(() => setIntroComplete(true), []);

  return (
    <main className="relative min-h-screen bg-background">
      {!introComplete && <IntroAnimation onComplete={handleIntroComplete} />}
      <MatrixRain />
      <ParticlesBg />
      <HeroSection />
      <FeaturesSection />
    </main>
  );
}
