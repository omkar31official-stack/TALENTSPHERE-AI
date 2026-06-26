'use client';

import { motion } from 'framer-motion';
import { GlassCard } from '@/components/shared/glass-card';
import { useAppStore } from '@/lib/store';
import { FileBarChart, Award, Target, Users, AlertTriangle, CheckCircle2, TrendingUp } from 'lucide-react';

export function ExecutiveMode() {
  const { executiveSummary, scores, resumes } = useAppStore();

  if (!executiveSummary) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <p className="text-muted-foreground">Complete the workflow to generate executive summary</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <GlassCard className="p-8" delay={0.1}>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center">
            <FileBarChart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Executive Hiring Report</h2>
            <p className="text-sm text-muted-foreground">AI-generated hiring summary and recommendations</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="p-5 rounded-2xl bg-gradient-to-br from-violet-500/10 to-purple-500/5 border border-violet-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-5 h-5 text-violet-400" />
              <span className="text-sm text-violet-300 font-medium">Top Candidate</span>
            </div>
            <p className="text-2xl font-bold">{executiveSummary.topCandidate}</p>
          </div>
          <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-500/5 border border-cyan-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-cyan-400" />
              <span className="text-sm text-cyan-300 font-medium">Average Score</span>
            </div>
            <p className="text-2xl font-bold">{executiveSummary.averageScore}%</p>
          </div>
          <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-green-500/5 border border-emerald-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-emerald-400" />
              <span className="text-sm text-emerald-300 font-medium">Shortlisted</span>
            </div>
            <p className="text-2xl font-bold">{executiveSummary.shortlistCount} / {executiveSummary.totalCandidates}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              Recommended for Interview
            </h3>
            <div className="space-y-2">
              {executiveSummary.recommendedInterviews.map((name, i) => {
                const score = scores.find((s) => {
                  const r = resumes.find((r) => r.id === s.candidateId);
                  return r?.name === name;
                });
                return (
                  <motion.div
                    key={name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * i }}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white text-xs font-bold">
                        {i + 1}
                      </div>
                      <span className="font-medium text-sm">{name}</span>
                    </div>
                    <span className="text-sm text-green-400 font-semibold">{score?.overallScore}%</span>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-400" />
              Risk Factors
            </h3>
            <div className="space-y-2">
              {executiveSummary.riskFactors.length > 0 ? (
                executiveSummary.riskFactors.map((risk, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * i }}
                    className="flex items-start gap-2 p-3 rounded-xl bg-yellow-500/5 border border-yellow-500/20"
                  >
                    <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 shrink-0" />
                    <span className="text-sm text-gray-300">{risk}</span>
                  </motion.div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No significant risk factors detected</p>
              )}
            </div>
          </div>
        </div>
      </GlassCard>

      <GlassCard className="p-6" delay={0.2}>
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-violet-400" />
          Recruiter Notes
        </h3>
        <div className="space-y-2">
          {executiveSummary.recruiterNotes.map((note, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="w-6 h-6 rounded-lg bg-violet-500/20 flex items-center justify-center shrink-0">
                <span className="text-[10px] text-violet-400 font-bold">{i + 1}</span>
              </div>
              <p className="text-sm text-gray-300">{note}</p>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
