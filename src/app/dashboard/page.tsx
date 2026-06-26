'use client';

import { motion } from 'framer-motion';
import { GlassCard } from '@/components/shared/glass-card';
import { ScoreRing } from '@/components/shared/score-ring';
import { useAppStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { AnimatedCounter } from '@/components/shared/animated-counter';
import {
  Users, Target, Brain, Shield, Globe, BarChart3,
  ArrowRight, Sparkles, Zap, FileText, TrendingUp,
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { scores, resumes, biasAnalysis, executiveSummary, shortlistedCandidates } = useAppStore();
  const router = useRouter();

  const hasData = scores.length > 0;
  const avgScore = hasData ? Math.round(scores.reduce((s, c) => s + c.overallScore, 0) / scores.length) : 0;

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <p className="text-[10px] tracking-[0.3em] text-violet-400/60 uppercase mb-2 font-medium">Dashboard</p>
        <h1 className="text-3xl md:text-4xl font-bold mb-1">
          <span className="bg-gradient-to-r from-white via-violet-100 to-gray-300 bg-clip-text text-transparent">
            Welcome back
          </span>
        </h1>
        <p className="text-sm text-gray-500">Intelligent candidate discovery and analysis platform</p>
      </motion.div>

      {!hasData && (
        <GlassCard className="p-12 text-center" delay={0.1}>
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="relative w-24 h-24 mx-auto mb-8"
          >
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-violet-600/20 to-cyan-500/20 blur-2xl" />
            <div className="relative w-full h-full rounded-3xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center">
              <Sparkles className="w-12 h-12 text-white" />
            </div>
          </motion.div>
          <h2 className="text-2xl font-bold mb-3">Begin Your Analysis</h2>
          <p className="text-gray-500 mb-8 max-w-lg mx-auto leading-relaxed">
            Upload a job description and candidate resumes. Our AI will analyze, rank,
            and surface the best talent with explainable insights.
          </p>
          <motion.button
            whileHover={{ scale: 1.03, boxShadow: '0 0 40px rgba(139,92,246,0.3)' }}
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push('/dashboard/workflow')}
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-gradient-to-r from-violet-600 via-purple-600 to-cyan-500 text-white font-semibold cursor-pointer shadow-lg shadow-violet-500/20 transition-shadow"
          >
            <FileText className="w-4 h-4" />
            Start Workflow
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </GlassCard>
      )}

      {hasData && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Candidates', value: scores.length, icon: Users, color: 'text-violet-400', grad: 'from-violet-500/20 to-purple-500/10', border: 'border-violet-500/20', prefix: '', suffix: '' },
              { label: 'Avg Score', value: avgScore, icon: Target, color: 'text-cyan-400', grad: 'from-cyan-500/20 to-blue-500/10', border: 'border-cyan-500/20', prefix: '', suffix: '%' },
              { label: 'Shortlisted', value: shortlistedCandidates.length, icon: Zap, color: 'text-emerald-400', grad: 'from-emerald-500/20 to-green-500/10', border: 'border-emerald-500/20', prefix: '', suffix: '' },
              { label: 'Fairness', value: biasAnalysis?.overallFairnessScore || 0, icon: Shield, color: 'text-amber-400', grad: 'from-amber-500/20 to-orange-500/10', border: 'border-amber-500/20', prefix: '', suffix: '%' },
            ].map((stat, i) => (
              <GlassCard key={stat.label} delay={0.05 * i} className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[10px] tracking-widest text-gray-500 uppercase mb-2 font-medium">{stat.label}</p>
                    <AnimatedCounter
                      value={stat.value}
                      prefix={stat.prefix}
                      suffix={stat.suffix}
                      className={`text-3xl font-bold ${stat.color}`}
                    />
                  </div>
                  <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${stat.grad} border ${stat.border} flex items-center justify-center`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <GlassCard className="p-6" delay={0.25}>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-semibold tracking-wide">Top Candidates</h3>
                <Link href="/dashboard/candidates" className="text-[10px] text-violet-400 hover:text-violet-300 tracking-wider uppercase">View All</Link>
              </div>
              <div className="space-y-3">
                {scores.slice(0, 5).map((score, i) => {
                  const resume = resumes.find((r) => r.id === score.candidateId);
                  return (
                    <motion.div
                      key={score.candidateId}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * i }}
                      className="flex items-center gap-3 group cursor-pointer"
                    >
                      <div className="relative">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500/30 to-cyan-500/30 border border-white/10 flex items-center justify-center text-white text-xs font-bold">
                          {i + 1}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate group-hover:text-white transition-colors">{resume?.name}</p>
                        <p className="text-[11px] text-gray-500 truncate">{resume?.experience[0]?.title}</p>
                      </div>
                      <ScoreRing score={score.overallScore} size={36} strokeWidth={3} />
                    </motion.div>
                  );
                })}
              </div>
            </GlassCard>

            <GlassCard className="p-6" delay={0.3}>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-semibold tracking-wide">Quick Actions</h3>
              </div>
              <div className="space-y-1.5">
                {[
                  { href: '/dashboard/galaxy', label: 'Talent Galaxy', desc: '3D universe view', icon: Globe, color: 'from-violet-500 to-purple-600' },
                  { href: '/dashboard/analytics', label: 'Analytics', desc: 'Charts & insights', icon: BarChart3, color: 'from-cyan-500 to-blue-600' },
                  { href: '/dashboard/copilot', label: 'AI Copilot', desc: 'Ask about candidates', icon: Brain, color: 'from-emerald-500 to-teal-600' },
                  { href: '/dashboard/executive', label: 'Executive', desc: 'Hiring summary', icon: TrendingUp, color: 'from-amber-500 to-orange-600' },
                ].map((action) => (
                  <Link key={action.href} href={action.href}>
                    <motion.div
                      whileHover={{ x: 3 }}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.04] transition-all cursor-pointer group"
                    >
                      <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center shadow-lg`}>
                        <action.icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium group-hover:text-white transition-colors">{action.label}</p>
                        <p className="text-[10px] text-gray-500">{action.desc}</p>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-gray-600 group-hover:text-gray-400 transition-colors" />
                    </motion.div>
                  </Link>
                ))}
              </div>
            </GlassCard>

            {executiveSummary && (
              <GlassCard className="p-6" delay={0.35}>
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-sm font-semibold tracking-wide">Executive Summary</h3>
                  <Link href="/dashboard/executive" className="text-[10px] text-violet-400 hover:text-violet-300 tracking-wider uppercase">Details</Link>
                </div>
                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-gradient-to-r from-violet-500/10 to-purple-500/5 border border-violet-500/15">
                    <p className="text-[10px] tracking-widest text-violet-300/70 uppercase mb-1">Top Candidate</p>
                    <p className="font-semibold text-sm">{executiveSummary.topCandidate}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Interviews</p>
                      <p className="text-lg font-bold text-cyan-400">{executiveSummary.recommendedInterviews.length}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Confidence</p>
                      <p className="text-lg font-bold text-emerald-400">{avgScore}%</p>
                    </div>
                  </div>
                </div>
              </GlassCard>
            )}
          </div>
        </>
      )}
    </div>
  );
}
