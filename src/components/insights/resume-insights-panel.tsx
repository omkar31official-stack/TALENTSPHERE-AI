'use client';

import { motion } from 'framer-motion';
import { GlassCard } from '@/components/shared/glass-card';
import { ScoreRing } from '@/components/shared/score-ring';
import { useAppStore } from '@/lib/store';
import { AlertTriangle, CheckCircle2, Lightbulb, FileText } from 'lucide-react';
import { useState } from 'react';

export function ResumeInsightsPanel() {
  const { resumeInsights, resumes } = useAppStore();
  const [selectedId, setSelectedId] = useState<string | null>(
    resumes[0]?.id || null
  );

  const insight = selectedId ? resumeInsights[selectedId] : null;

  if (resumes.length === 0) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <p className="text-muted-foreground">Complete the workflow to see resume insights</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {resumes.map((r) => (
          <button
            key={r.id}
            onClick={() => setSelectedId(r.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
              selectedId === r.id
                ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-white'
                : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white'
            }`}
          >
            {r.name}
          </button>
        ))}
      </div>

      {insight && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <GlassCard className="p-6" delay={0.1}>
            <div className="flex flex-col items-center">
              <h3 className="font-semibold mb-4">Resume Quality</h3>
              <ScoreRing score={insight.qualityScore} size={140} strokeWidth={10} label="Quality" />
              <p className="text-sm text-muted-foreground mt-4 text-center">{insight.overallSummary}</p>
            </div>
          </GlassCard>

          <GlassCard className="p-6" delay={0.2}>
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-400" />
              Missing Keywords
            </h3>
            {insight.missingKeywords.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {insight.missingKeywords.map((kw) => (
                  <span key={kw} className="px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-300 text-xs">
                    {kw}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No critical missing keywords</p>
            )}

            <h4 className="font-semibold mt-6 mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-orange-400" />
              Weak Sections
            </h4>
            {insight.weakSections.map((ws, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-gray-400 mb-2">
                <span className="text-orange-400 mt-1">•</span>
                {ws}
              </div>
            ))}
          </GlassCard>

          <GlassCard className="p-6" delay={0.3}>
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-violet-400" />
              ATS Optimization Tips
            </h3>
            <div className="space-y-3">
              {insight.atsTips.map((tip, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * i }}
                  className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10"
                >
                  <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                  <p className="text-sm text-gray-300">{tip}</p>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
