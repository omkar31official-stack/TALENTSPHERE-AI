'use client';

import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { MagneticButton } from '@/components/shared/magnetic-button';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight, Zap } from 'lucide-react';

const TalentUniverse = dynamic(
  () => import('@/components/landing/talent-universe').then((m) => m.TalentUniverse),
  { ssr: false }
);

export function HeroSection() {
  const router = useRouter();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <TalentUniverse />

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 backdrop-blur-sm mb-8"
        >
          <Zap className="w-3.5 h-3.5 text-violet-400" />
          <span className="text-xs text-violet-300 font-medium tracking-wide">AI-Powered Talent Intelligence</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold mb-6 tracking-tight leading-[1.05]"
        >
          <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
            Discover
          </span>
          <br />
          <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Extraordinary Talent
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="text-base md:text-lg text-gray-500 mb-12 max-w-xl mx-auto leading-relaxed"
        >
          Discover extraordinary talent before everyone else. AI-powered candidate analysis,
          unbiased ranking, and intelligent insights.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.9 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <MagneticButton onClick={() => router.push('/dashboard')}>
            <span className="flex items-center gap-2">
              Launch Platform
              <ArrowRight className="w-4 h-4" />
            </span>
          </MagneticButton>
          <MagneticButton onClick={() => router.push('/dashboard/workflow')}>
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Try Demo
            </span>
          </MagneticButton>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.3 }}
          className="mt-20 flex justify-center gap-16"
        >
          {[
            { num: '10K+', label: 'Resumes Analyzed' },
            { num: '98%', label: 'Match Accuracy' },
            { num: '3x', label: 'Faster Hiring' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-bold text-white mb-0.5">{stat.num}</div>
              <div className="text-[11px] text-gray-600 tracking-wide">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
