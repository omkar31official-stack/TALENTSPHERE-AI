'use client';

import { motion } from 'framer-motion';
import { GlassCard } from '@/components/shared/glass-card';
import { MagneticButton } from '@/components/shared/magnetic-button';
import { useAppStore } from '@/lib/store';
import { generateDemoData } from '@/lib/matching-engine';
import { useState } from 'react';
import { FileText, Upload, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

export function JobInputStep() {
  const { setJobDescription, jobDescription, setStep } = useAppStore();
  const [text, setText] = useState('');
  const [parsing, setParsing] = useState(false);

  const parseJobDescription = () => {
    setParsing(true);
    setTimeout(() => {
      const demo = generateDemoData();
      const customJD = text.trim() ? {
        ...demo.jd,
        rawText: text,
        title: text.split('\n')[0] || 'Custom Job Position',
      } : demo.jd;
      setJobDescription(customJD);
      setParsing(false);
      setStep(1);
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <GlassCard className="p-8" delay={0.05}>
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Job Description</h2>
            <p className="text-xs text-gray-500">Paste your JD or use demo data to get started</p>
          </div>
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={"Paste your job description here...\n\nOr leave empty and click 'Load Demo' to use sample data for Senior Full-Stack Engineer."}
          className="w-full h-52 bg-white/[0.02] border border-white/[0.08] rounded-2xl p-5 text-sm text-foreground placeholder:text-gray-600 resize-none focus:outline-none focus:border-violet-500/30 focus:ring-1 focus:ring-violet-500/20 transition-all"
        />

        <div className="flex flex-wrap gap-3 mt-6">
          <MagneticButton onClick={parseJobDescription} disabled={parsing}>
            <span className="flex items-center gap-2">
              {parsing ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <Sparkles className="w-4 h-4" />
                  </motion.div>
                  Parsing...
                </>
              ) : (
                <>
                  {text.trim() ? <ArrowRight className="w-4 h-4" /> : <Upload className="w-4 h-4" />}
                  {text.trim() ? 'Parse & Continue' : 'Load Demo Data'}
                </>
              )}
            </span>
          </MagneticButton>
        </div>
      </GlassCard>

      {jobDescription && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <GlassCard className="p-6" delay={0}>
            <div className="flex items-center gap-3 mb-5">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-semibold">Parsed Successfully</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
              <div>
                <span className="text-[10px] tracking-widest text-gray-500 uppercase">Title</span>
                <p className="font-medium mt-1">{jobDescription.title}</p>
              </div>
              <div>
                <span className="text-[10px] tracking-widest text-gray-500 uppercase">Skills ({jobDescription.skills.length})</span>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {jobDescription.skills.slice(0, 6).map((s) => (
                    <span key={s} className="px-2.5 py-1 rounded-lg bg-violet-500/10 border border-violet-500/15 text-violet-300 text-[11px] font-medium">
                      {s}
                    </span>
                  ))}
                  {jobDescription.skills.length > 6 && (
                    <span className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.06] text-gray-500 text-[11px]">
                      +{jobDescription.skills.length - 6}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      )}
    </motion.div>
  );
}
