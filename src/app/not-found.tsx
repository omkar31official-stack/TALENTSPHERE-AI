'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Home } from 'lucide-react';
import { MagneticButton } from '@/components/shared/magnetic-button';
import { ParticlesBg } from '@/components/shared/particles-bg';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative">
      <ParticlesBg />
      <div className="relative z-10 text-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-[7rem] md:text-[10rem] font-bold leading-none bg-gradient-to-r from-violet-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            404
          </h1>
          <p className="text-lg md:text-xl text-gray-500 mb-10">
            This page does not exist in our galaxy
          </p>
          <div className="flex gap-4 justify-center">
            <MagneticButton onClick={() => router.back()}>
              <span className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Go Back
              </span>
            </MagneticButton>
            <MagneticButton onClick={() => router.push('/')}>
              <span className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                Home
              </span>
            </MagneticButton>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
