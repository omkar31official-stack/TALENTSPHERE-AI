'use client';

import { motion } from 'framer-motion';
import { GlassCard } from '@/components/shared/glass-card';
import {
  Brain,
  Shield,
  Globe,
  BarChart3,
  Zap,
  Users,
  Target,
  Sparkles,
} from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'AI Matching',
    description: 'Semantic analysis and weighted scoring for perfect candidate-job matching.',
    gradient: 'from-violet-500 to-purple-600',
  },
  {
    icon: Shield,
    title: 'Bias Detection',
    description: 'Real-time fairness analysis ensuring unbiased hiring decisions.',
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    icon: Globe,
    title: 'Talent Galaxy',
    description: 'Explore candidates in an interactive 3D universe visualization.',
    gradient: 'from-cyan-500 to-blue-600',
  },
  {
    icon: BarChart3,
    title: 'Smart Analytics',
    description: 'Deep insights with radar charts, heatmaps, and trend analysis.',
    gradient: 'from-amber-500 to-orange-600',
  },
  {
    icon: Zap,
    title: 'Instant Scoring',
    description: '0-100 candidate scores with explainable AI reasoning.',
    gradient: 'from-yellow-500 to-amber-500',
  },
  {
    icon: Users,
    title: 'Team Fit',
    description: 'Compare candidates against team requirements automatically.',
    gradient: 'from-pink-500 to-rose-600',
  },
  {
    icon: Target,
    title: 'Resume Insights',
    description: 'ATS optimization tips, missing keywords, and quality scoring.',
    gradient: 'from-indigo-500 to-violet-600',
  },
  {
    icon: Sparkles,
    title: 'Recruiter Copilot',
    description: 'AI assistant that answers questions about your candidate pool.',
    gradient: 'from-teal-500 to-cyan-500',
  },
];

export function FeaturesSection() {
  return (
    <section className="relative py-32 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-[10px] tracking-[0.3em] text-violet-400/60 uppercase mb-3 font-medium">Features</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Built for Modern Recruiters
            </span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-sm">
            Every feature designed to make hiring faster, fairer, and more intelligent.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature, i) => (
            <GlassCard key={feature.title} delay={i * 0.06} className="p-6">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4`}>
                <feature.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1.5">{feature.title}</h3>
              <p className="text-[13px] text-gray-500 leading-relaxed">{feature.description}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
