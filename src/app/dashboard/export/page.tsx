'use client';

import { ExportSystem } from '@/components/export/export-system';
import { motion } from 'framer-motion';

export default function ExportPage() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <p className="text-[10px] tracking-[0.3em] text-violet-400/60 uppercase mb-2 font-medium">Output</p>
        <h1 className="text-3xl font-bold mb-1">
          <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Export Data
          </span>
        </h1>
        <p className="text-sm text-gray-500">Download reports and candidate data</p>
      </motion.div>
      <ExportSystem />
    </div>
  );
}
