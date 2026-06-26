'use client';

import { motion } from 'framer-motion';
import { GlassCard } from '@/components/shared/glass-card';
import { useAppStore } from '@/lib/store';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, Sparkles } from 'lucide-react';

const COLORS = ['#8b5cf6', '#06b6d4', '#22c55e', '#f59e0b', '#ef4444', '#ec4899', '#3b82f6', '#10b981'];

export function MarketInsightsPanel() {
  const { marketInsights } = useAppStore();

  if (!marketInsights) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <p className="text-muted-foreground">Complete the workflow to see market insights</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="p-6" delay={0.1}>
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-violet-400" />
            Top Skills in Pool
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={marketInsights.topSkills} layout="vertical">
              <XAxis type="number" tick={{ fill: '#9ca3af', fontSize: 11 }} />
              <YAxis type="category" dataKey="skill" tick={{ fill: '#9ca3af', fontSize: 11 }} width={80} />
              <Tooltip
                contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }}
              />
              <Bar dataKey="percentage" radius={[0, 6, 6, 0]}>
                {marketInsights.topSkills.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard className="p-6" delay={0.2}>
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            Rare & Unique Skills
          </h3>
          <div className="space-y-3">
            {marketInsights.rareSkills.map((skill, i) => (
              <motion.div
                key={skill.skill}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i }}
                className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10"
              >
                <div>
                  <p className="font-medium text-sm">{skill.skill}</p>
                  <p className="text-xs text-muted-foreground">{skill.count} candidate(s) have this skill</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  skill.trend === 'rising' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'
                }`}>
                  {skill.trend === 'rising' ? '↑ In Demand' : '— Niche'}
                </span>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </div>

      <GlassCard className="p-6" delay={0.3}>
        <h3 className="font-semibold mb-4">AI Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {marketInsights.recommendations.map((rec, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10"
            >
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-[10px] text-white font-bold">{i + 1}</span>
              </div>
              <p className="text-sm text-gray-300">{rec}</p>
            </motion.div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
