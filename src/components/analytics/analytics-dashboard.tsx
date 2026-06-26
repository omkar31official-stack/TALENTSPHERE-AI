'use client';

import { GlassCard } from '@/components/shared/glass-card';
import { useAppStore } from '@/lib/store';
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, Legend,
} from 'recharts';
import { BarChart3, Users, TrendingUp, Target } from 'lucide-react';

export function AnalyticsDashboard() {
  const { scores, resumes } = useAppStore();

  if (scores.length === 0) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <p className="text-muted-foreground">Complete the workflow to see analytics</p>
      </div>
    );
  }

  const radarData = [
    { skill: 'Skills', avg: Math.round(scores.reduce((s, c) => s + c.skillMatch, 0) / scores.length) },
    { skill: 'Experience', avg: Math.round(scores.reduce((s, c) => s + c.experienceMatch, 0) / scores.length) },
    { skill: 'Education', avg: Math.round(scores.reduce((s, c) => s + c.educationMatch, 0) / scores.length) },
    { skill: 'Certifications', avg: Math.round(scores.reduce((s, c) => s + c.certificationMatch, 0) / scores.length) },
    { skill: 'Semantic', avg: Math.round(scores.reduce((s, c) => s + c.semanticSimilarity, 0) / scores.length) },
    { skill: 'Interview Ready', avg: Math.round(scores.reduce((s, c) => s + c.interviewReadiness, 0) / scores.length) },
  ];

  const barData = scores.slice(0, 8).map((s, i) => {
    const resume = resumes.find((r) => r.id === s.candidateId);
    return { name: resume?.name?.split(' ')[0] || `C${i + 1}`, score: s.overallScore, skills: s.skillMatch, exp: s.experienceMatch };
  });

  const scoreDistribution = [
    { range: '90-100', count: scores.filter((s) => s.overallScore >= 90).length },
    { range: '80-89', count: scores.filter((s) => s.overallScore >= 80 && s.overallScore < 90).length },
    { range: '70-79', count: scores.filter((s) => s.overallScore >= 70 && s.overallScore < 80).length },
    { range: '60-69', count: scores.filter((s) => s.overallScore >= 60 && s.overallScore < 70).length },
    { range: 'Below 60', count: scores.filter((s) => s.overallScore < 60).length },
  ];

  const pieData = [
    { name: 'Strong', value: scores.filter((s) => s.overallScore >= 75).length, color: '#22c55e' },
    { name: 'Moderate', value: scores.filter((s) => s.overallScore >= 50 && s.overallScore < 75).length, color: '#eab308' },
    { name: 'Weak', value: scores.filter((s) => s.overallScore < 50).length, color: '#ef4444' },
  ].filter((d) => d.value > 0);

  const avgScore = Math.round(scores.reduce((s, c) => s + c.overallScore, 0) / scores.length);
  const avgConfidence = Math.round(scores.reduce((s, c) => s + c.hiringConfidence, 0) / scores.length);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Candidates', value: scores.length, icon: Users, color: 'text-violet-400' },
          { label: 'Average Score', value: `${avgScore}%`, icon: Target, color: 'text-cyan-400' },
          { label: 'Hiring Confidence', value: `${avgConfidence}%`, icon: TrendingUp, color: 'text-emerald-400' },
          { label: 'Strong Matches', value: scores.filter((s) => s.overallScore >= 70).length, icon: BarChart3, color: 'text-yellow-400' },
        ].map((stat, i) => (
          <GlassCard key={stat.label} delay={i * 0.1} className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
              <stat.icon className={`w-8 h-8 ${stat.color} opacity-30`} />
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="p-6" delay={0.1}>
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Target className="w-4 h-4 text-violet-400" />
            Candidate Comparison
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={barData}>
              <XAxis dataKey="name" tick={{ fill: '#9ca3af', fontSize: 11 }} />
              <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} />
              <Tooltip
                contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }}
                labelStyle={{ color: '#fff' }}
              />
              <Bar dataKey="score" fill="#8b5cf6" radius={[6, 6, 0, 0]} name="Overall" />
              <Bar dataKey="skills" fill="#06b6d4" radius={[6, 6, 0, 0]} name="Skills" />
              <Legend />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard className="p-6" delay={0.2}>
          <h3 className="font-semibold mb-4">Skill Radar</h3>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.1)" />
              <PolarAngleAxis dataKey="skill" tick={{ fill: '#9ca3af', fontSize: 10 }} />
              <PolarRadiusAxis tick={{ fill: '#9ca3af', fontSize: 10 }} />
              <Radar name="Average" dataKey="avg" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
            </RadarChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard className="p-6" delay={0.3}>
          <h3 className="font-semibold mb-4">Score Distribution</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={scoreDistribution}>
              <XAxis dataKey="range" tick={{ fill: '#9ca3af', fontSize: 11 }} />
              <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} />
              <Tooltip
                contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }}
              />
              <Area type="monotone" dataKey="count" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard className="p-6" delay={0.4}>
          <h3 className="font-semibold mb-4">Match Quality</h3>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
