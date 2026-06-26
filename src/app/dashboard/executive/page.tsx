'use client';

import { ExecutiveMode } from '@/components/executive/executive-mode';
import { motion } from 'framer-motion';

export default function ExecutivePage() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <p className="text-[10px] tracking-[0.3em] text-violet-400/60 uppercase mb-2 font-medium">Executive</p>
        <h1 className="text-3xl font-bold mb-1">
          <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Executive Report
          </span>
        </h1>
        <p className="text-sm text-gray-500">High-level hiring summary and recommendations</p>
      </motion.div>
      <ExecutiveMode />
    </div>
  );
}
