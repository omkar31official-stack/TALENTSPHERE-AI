'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '@/components/shared/glass-card';
import { MagneticButton } from '@/components/shared/magnetic-button';
import { useAppStore } from '@/lib/store';
import { generateDemoData } from '@/lib/matching-engine';
import { parseResumeFile } from '@/lib/file-parser';
import { useState, useCallback, useRef } from 'react';
import { Upload, X, Sparkles, FileUp } from 'lucide-react';

export function ResumeUploadStep() {
  const { addResume, removeResume, resumes, setStep } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadDemoResumes = () => {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      const demo = generateDemoData();
      demo.resumes.forEach((r) => addResume(r));
      setLoading(false);
      setStep(2);
    }, 2000);
  };

  const processFiles = useCallback(async (files: FileList) => {
    setParsing(true);
    setError(null);
    const validExts = ['pdf', 'docx', 'txt'];

    for (const file of Array.from(files)) {
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (!ext || !validExts.includes(ext)) {
        setError(`Skipped "${file.name}" — unsupported format. Use PDF, DOCX, or TXT.`);
        continue;
      }
      try {
        const resume = await parseResumeFile(file);
        addResume(resume);
      } catch {
        setError(`Failed to parse "${file.name}". Make sure the file is valid.`);
      }
    }
    setParsing(false);
  }, [addResume]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      if (e.dataTransfer.files.length > 0) {
        processFiles(e.dataTransfer.files);
      }
    },
    [processFiles]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        processFiles(e.target.files);
      }
      e.target.value = '';
    },
    [processFiles]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <GlassCard className="p-8" delay={0.05}>
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <FileUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Upload Resumes</h2>
            <p className="text-xs text-gray-500">Drag & drop files or use demo candidates</p>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.txt"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />

        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-14 text-center transition-all duration-300 cursor-pointer overflow-hidden ${
            dragOver
              ? 'border-violet-500/50 bg-violet-500/5'
              : 'border-white/[0.08] hover:border-white/[0.15] bg-white/[0.02]'
          }`}
        >
          {dragOver && (
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-cyan-500/10 animate-pulse" />
          )}
          <div className="relative z-10">
            {parsing ? (
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>
                <Sparkles className="w-12 h-12 mx-auto mb-4 text-violet-400" />
              </motion.div>
            ) : (
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
                <Upload className="w-6 h-6 text-gray-500" />
              </div>
            )}
            <p className="text-gray-400 mb-2 font-medium">
              {parsing ? 'Parsing resumes...' : 'Drag & drop resumes here or click to browse'}
            </p>
            <p className="text-xs text-gray-600">Supports PDF, DOCX, TXT — parsing runs in-browser</p>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-sm text-amber-300 text-center">
            {error}
          </div>
        )}

        <div className="flex gap-3 mt-6">
          <MagneticButton onClick={loadDemoResumes} disabled={loading}>
            <span className="flex items-center gap-2">
              {loading ? (
                <>
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                    <Sparkles className="w-4 h-4" />
                  </motion.div>
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Load 5 Demo Candidates
                </>
              )}
            </span>
          </MagneticButton>
        </div>
      </GlassCard>

      <AnimatePresence mode="popLayout">
        {resumes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <h3 className="text-xs font-semibold tracking-widest text-gray-500 uppercase">
              Uploaded Candidates ({resumes.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {resumes.map((resume, i) => (
                <motion.div
                  key={resume.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.03, duration: 0.3 }}
                  className="relative p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] group hover:border-white/[0.12] transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/30 to-cyan-500/30 border border-white/10 flex items-center justify-center text-white font-bold text-sm">
                        {resume.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{resume.name}</p>
                        <p className="text-[10px] text-gray-500">{resume.experience.length} positions</p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeResume(resume.id)}
                      className="p-1.5 rounded-lg hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3 text-gray-400" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-3">
                    {resume.skills.slice(0, 3).map((s) => (
                      <span key={s} className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06] text-[10px] text-gray-500 font-medium">
                        {s}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
