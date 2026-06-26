'use client';

import { motion } from 'framer-motion';
import { GlassCard } from '@/components/shared/glass-card';
import { ScoreRing } from '@/components/shared/score-ring';
import { useAppStore } from '@/lib/store';
import { useState } from 'react';
import { Search, ArrowUpDown, ChevronDown, ChevronUp, Star, Briefcase } from 'lucide-react';

type SortKey = 'score' | 'name' | 'skills' | 'experience';
type SortDir = 'asc' | 'desc';

function SortIcon({ k, sortKey, sortDir }: { k: SortKey; sortKey: SortKey; sortDir: SortDir }) {
  if (sortKey !== k) return <ArrowUpDown className="w-3 h-3 opacity-30" />;
  return sortDir === 'desc' ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />;
}

export function CandidatesList() {
  const { scores, resumes, setSelectedCandidate, shortlistedCandidates, toggleShortlist } = useAppStore();
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('score');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const enriched = scores.map((s) => {
    const r = resumes.find((r) => r.id === s.candidateId);
    return { ...s, resume: r };
  }).filter((e) => e.resume);

  const filtered = enriched.filter((e) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      e.resume!.name.toLowerCase().includes(q) ||
      e.resume!.skills.some((s) => s.toLowerCase().includes(q)) ||
      e.resume!.email.toLowerCase().includes(q) ||
      e.resume!.experience.some((ex) => ex.title.toLowerCase().includes(q) || ex.company.toLowerCase().includes(q))
    );
  });

  const sorted = [...filtered].sort((a, b) => {
    let cmp = 0;
    if (sortKey === 'score') cmp = a.overallScore - b.overallScore;
    else if (sortKey === 'name') cmp = (a.resume?.name || '').localeCompare(b.resume?.name || '');
    else if (sortKey === 'skills') cmp = a.skillMatch - b.skillMatch;
    else if (sortKey === 'experience') cmp = a.experienceMatch - b.experienceMatch;
    return sortDir === 'desc' ? -cmp : cmp;
  });

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'desc' ? 'asc' : 'desc');
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  if (scores.length === 0) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <p className="text-muted-foreground">Complete the workflow to see candidates</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <GlassCard className="p-4" hover={false} delay={0}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, skill, role, or email..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-foreground placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
          />
        </div>
      </GlassCard>

      <GlassCard className="overflow-hidden" hover={false} delay={0.05}>
        <div className="grid grid-cols-[2.5rem_1fr_5rem_5rem_5rem_5rem_3rem] gap-3 px-5 py-3 border-b border-white/10 text-xs text-muted-foreground font-medium">
          <span>#</span>
          <button onClick={() => toggleSort('name')} className="flex items-center gap-1 text-left cursor-pointer hover:text-foreground transition-colors">
            Candidate <SortIcon k="name" sortKey={sortKey} sortDir={sortDir} />
          </button>
          <button onClick={() => toggleSort('score')} className="flex items-center gap-1 cursor-pointer hover:text-foreground transition-colors">
            Score <SortIcon k="score" sortKey={sortKey} sortDir={sortDir} />
          </button>
          <button onClick={() => toggleSort('skills')} className="flex items-center gap-1 cursor-pointer hover:text-foreground transition-colors">
            Skills <SortIcon k="skills" sortKey={sortKey} sortDir={sortDir} />
          </button>
          <button onClick={() => toggleSort('experience')} className="flex items-center gap-1 cursor-pointer hover:text-foreground transition-colors">
            Exp <SortIcon k="experience" sortKey={sortKey} sortDir={sortDir} />
          </button>
          <span>Confidence</span>
          <span></span>
        </div>

        <div className="divide-y divide-white/5">
          {sorted.map((item, i) => {
            const isExpanded = expandedId === item.candidateId;
            const isShortlisted = shortlistedCandidates.includes(item.candidateId);
            return (
              <motion.div
                key={item.candidateId}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.02 }}
              >
                <div className="grid grid-cols-[2.5rem_1fr_5rem_5rem_5rem_5rem_3rem] gap-3 items-center px-5 py-3.5 hover:bg-white/5 transition-colors">
                  <span className="text-xs text-gray-500">{i + 1}</span>
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {item.resume?.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{item.resume?.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{item.resume?.experience[0]?.title || 'N/A'}</p>
                    </div>
                  </div>
                  <ScoreRing score={item.overallScore} size={36} strokeWidth={3} />
                  <span className="text-xs text-muted-foreground truncate">{item.skillMatch}%</span>
                  <span className="text-xs text-muted-foreground">{item.experienceMatch}%</span>
                  <span className="text-xs text-violet-400 font-medium">{item.hiringConfidence}%</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleShortlist(item.candidateId)}
                      className={`p-1 rounded-lg transition-colors cursor-pointer ${isShortlisted ? 'text-yellow-400' : 'text-gray-600 hover:text-yellow-400'}`}
                      title={isShortlisted ? 'Remove from shortlist' : 'Shortlist'}
                    >
                      <Star className="w-4 h-4" fill={isShortlisted ? 'currentColor' : 'none'} />
                    </button>
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : item.candidateId)}
                      className="p-1 rounded-lg text-gray-600 hover:text-white transition-colors cursor-pointer"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-5 pb-4"
                  >
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                      <div className="flex flex-wrap gap-2 text-xs">
                        {item.resume?.skills.map((s) => (
                          <span key={s} className="px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300">{s}</span>
                        ))}
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                        <div>
                          <span className="text-muted-foreground">Education</span>
                          <p>{item.resume?.education[0]?.degree || 'N/A'}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Email</span>
                          <p className="truncate">{item.resume?.email || 'N/A'}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Projects</span>
                          <p>{item.resume?.projects.length || 0}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Leadership</span>
                          <p>{item.leadershipScore}%</p>
                        </div>
                      </div>
                      {item.strengths.length > 0 && (
                        <div className="text-xs">
                          <span className="text-green-400 font-medium">Strengths:</span>
                          <span className="text-gray-400 ml-2">{item.strengths.slice(0, 2).join(' • ')}</span>
                        </div>
                      )}
                      {item.missingSkills.length > 0 && (
                        <div className="text-xs">
                          <span className="text-red-400 font-medium">Missing:</span>
                          <span className="text-gray-400 ml-2">{item.missingSkills.slice(0, 3).join(', ')}</span>
                        </div>
                      )}
                      <button
                        onClick={() => setSelectedCandidate(item.candidateId)}
                        className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1 cursor-pointer"
                      >
                        <Briefcase className="w-3 h-3" /> View full profile
                      </button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </GlassCard>
    </div>
  );
}
