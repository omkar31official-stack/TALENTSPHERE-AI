'use client';

import { motion } from 'framer-motion';
import { GlassCard } from '@/components/shared/glass-card';
import { ScoreRing } from '@/components/shared/score-ring';
import { useAppStore } from '@/lib/store';
import { analyzeCandidates, detectBias, generateExecutiveSummary, generateMarketInsights, generateResumeInsights } from '@/lib/matching-engine';
import { useEffect, useState } from 'react';
import { Shield, AlertTriangle, CheckCircle2, ArrowRight, Brain } from 'lucide-react';
import Link from 'next/link';

export function AIAnalysisStep() {
  const { jobDescription, resumes, setScores, setBiasAnalysis, setExecutiveSummary, setMarketInsights, setResumeInsights, scores, biasAnalysis } = useAppStore();
  const [analyzing, setAnalyzing] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!jobDescription || resumes.length === 0) return;

    const timer = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(timer);
          const analyzedScores = analyzeCandidates(jobDescription, resumes);
          setScores(analyzedScores);
          setBiasAnalysis(detectBias(analyzedScores, resumes));
          setExecutiveSummary(generateExecutiveSummary(analyzedScores, resumes));
          setMarketInsights(generateMarketInsights(resumes));
          resumes.forEach((r) => {
            setResumeInsights(r.id, generateResumeInsights(r, jobDescription));
          });
          setAnalyzing(false);
          return 100;
        }
        return p + 2;
      });
    }, 50);

    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobDescription, resumes]);

  if (analyzing) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-24"
      >
        <div className="relative w-24 h-24 mb-8">
          <div className="absolute inset-0 rounded-full border-4 border-white/[0.06]" />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-full border-4 border-transparent border-t-violet-500"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-2 rounded-full border-4 border-transparent border-t-cyan-500"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Brain className="w-8 h-8 text-violet-400" />
          </div>
        </div>
        <h2 className="text-xl font-bold mb-2">Analyzing Candidates</h2>
        <p className="text-sm text-gray-500 mb-8">AI is processing resumes and computing match scores</p>
        <div className="w-72 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
        <p className="text-[11px] text-gray-600 mt-3 font-mono">{progress}%</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <GlassCard className="p-6" delay={0.05}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <CheckCircle2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Analysis Complete</h2>
            <p className="text-xs text-gray-500">{resumes.length} candidates analyzed</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {scores.slice(0, 6).map((score, i) => {
            const resume = resumes.find((r) => r.id === score.candidateId);
            return (
              <motion.div
                key={score.candidateId}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i }}
                className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12] transition-all"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500/30 to-cyan-500/30 border border-white/10 flex items-center justify-center text-white font-bold text-xs">
                    {resume?.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{resume?.name}</p>
                    <p className="text-[10px] text-gray-500 truncate">{resume?.experience[0]?.title}</p>
                  </div>
                </div>

                <div className="flex justify-center mb-4">
                  <ScoreRing score={score.overallScore} size={72} strokeWidth={5} />
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Skills</span>
                    <span className={score.skillMatch > 70 ? 'text-emerald-400' : score.skillMatch > 40 ? 'text-amber-400' : 'text-red-400'}>
                      {score.skillMatch}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Exp</span>
                    <span className={score.experienceMatch > 70 ? 'text-emerald-400' : score.experienceMatch > 40 ? 'text-amber-400' : 'text-red-400'}>
                      {score.experienceMatch}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Edu</span>
                    <span className={score.educationMatch > 70 ? 'text-emerald-400' : 'text-amber-400'}>
                      {score.educationMatch}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Confidence</span>
                    <span className="text-violet-400">{score.hiringConfidence}%</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </GlassCard>

      {biasAnalysis && (
        <GlassCard className="p-6" delay={0.15}>
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-semibold">Bias Detection</h3>
            <span className={`ml-auto px-3 py-1 rounded-xl text-[10px] font-semibold tracking-wider uppercase ${
              biasAnalysis.overallFairnessScore > 70 ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
            }`}>
              Fairness: {biasAnalysis.overallFairnessScore}%
            </span>
          </div>
          {biasAnalysis.recommendations.slice(0, 3).map((rec, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-gray-500 mb-2">
              <AlertTriangle className="w-4 h-4 mt-0.5 text-amber-400/60 shrink-0" />
              {rec}
            </div>
          ))}
        </GlassCard>
      )}

      <div className="flex justify-center pt-4">
        <Link href="/dashboard/galaxy">
          <motion.button
            whileHover={{ scale: 1.03, boxShadow: '0 0 40px rgba(139,92,246,0.3)' }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-violet-600 via-purple-600 to-cyan-500 text-white font-semibold cursor-pointer shadow-lg shadow-violet-500/20"
          >
            Explore Talent Galaxy
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </Link>
      </div>
    </motion.div>
  );
}
