'use client';

import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { JobInputStep } from '@/components/workflow/job-input-step';
import { ResumeUploadStep } from '@/components/workflow/resume-upload-step';
import { AIAnalysisStep } from '@/components/workflow/ai-analysis-step';
import { CheckCircle2, Circle } from 'lucide-react';

const steps = [
  { label: 'Job Description', step: 0 },
  { label: 'Resume Upload', step: 1 },
  { label: 'AI Analysis', step: 2 },
];

export default function WorkflowPage() {
  const { currentStep, setStep, jobDescription, resumes } = useAppStore();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <p className="text-[10px] tracking-[0.3em] text-violet-400/60 uppercase mb-2 font-medium">Workflow</p>
        <h1 className="text-3xl font-bold mb-1">
          <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Candidate Analysis</span>
        </h1>
        <p className="text-sm text-gray-500">Three-step AI-powered pipeline</p>
      </motion.div>

      <div className="relative flex items-center justify-between max-w-xl mx-auto py-6">
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px bg-white/[0.06]" />

        {steps.map((s) => {
          const isComplete = (s.step === 0 && jobDescription) || (s.step === 1 && resumes.length > 0) || (s.step === 2 && currentStep >= 2);
          const isCurrent = currentStep === s.step;
          return (
            <div key={s.step} className="flex items-center relative z-10">
              <button
                onClick={() => {
                  if (s.step === 0 || (s.step === 1 && jobDescription) || (s.step === 2 && resumes.length > 0)) {
                    setStep(s.step);
                  }
                }}
                className="flex flex-col items-center gap-3 cursor-pointer"
              >
                <div className={`relative w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                  isComplete
                    ? 'bg-emerald-500/20 border border-emerald-500/30'
                    : isCurrent
                    ? 'bg-gradient-to-br from-violet-500 to-cyan-500 border border-violet-400/30 shadow-lg shadow-violet-500/20'
                    : 'bg-white/[0.04] border border-white/[0.08]'
                }`}>
                  {isComplete ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Circle className={`w-5 h-5 ${isCurrent ? 'text-white' : 'text-gray-600'}`} />
                  )}
                  {isCurrent && (
                    <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 blur-md -z-10" />
                  )}
                </div>
                <span className={`text-[11px] font-medium tracking-wide ${isCurrent ? 'text-white' : isComplete ? 'text-emerald-400/80' : 'text-gray-600'}`}>
                  {s.label}
                </span>
              </button>
            </div>
          );
        })}
      </div>

      <div>
        {currentStep === 0 && <JobInputStep />}
        {currentStep === 1 && <ResumeUploadStep />}
        {currentStep === 2 && <AIAnalysisStep />}
      </div>
    </div>
  );
}
