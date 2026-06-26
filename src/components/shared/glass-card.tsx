'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  delay?: number;
}

export function GlassCard({ children, className, hover = true, delay = 0 }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={hover ? { y: -3, transition: { duration: 0.2 } } : undefined}
      className={cn(
        'relative rounded-2xl overflow-hidden group',
        className
      )}
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/[0.07] to-white/[0.02] border border-white/[0.08]" />

      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-b from-violet-500/[0.03] to-cyan-500/[0.02]" />

      <div className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.1), transparent 40%, transparent 60%, rgba(6,182,212,0.1))' }} />

      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
