import { create } from 'zustand';
import type {
  ParsedJobDescription,
  ResumeData,
  CandidateScore,
  BiasAnalysis,
  ResumeInsights,
  MarketInsight,
  ExecutiveSummary,
  Theme,
} from './types';

interface AppState {
  theme: Theme;
  toggleTheme: () => void;

  currentStep: number;
  setStep: (step: number) => void;

  jobDescription: ParsedJobDescription | null;
  setJobDescription: (jd: ParsedJobDescription) => void;

  resumes: ResumeData[];
  addResume: (resume: ResumeData) => void;
  removeResume: (id: string) => void;
  clearResumes: () => void;

  scores: CandidateScore[];
  setScores: (scores: CandidateScore[]) => void;

  biasAnalysis: BiasAnalysis | null;
  setBiasAnalysis: (bias: BiasAnalysis) => void;

  resumeInsights: Record<string, ResumeInsights>;
  setResumeInsights: (id: string, insights: ResumeInsights) => void;

  marketInsights: MarketInsight | null;
  setMarketInsights: (insights: MarketInsight) => void;

  executiveSummary: ExecutiveSummary | null;
  setExecutiveSummary: (summary: ExecutiveSummary) => void;

  shortlistedCandidates: string[];
  toggleShortlist: (id: string) => void;

  selectedCandidate: string | null;
  setSelectedCandidate: (id: string | null) => void;

  showPresentationMode: boolean;
  togglePresentationMode: () => void;

  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  theme: 'dark',
  toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),

  currentStep: 0,
  setStep: (step) => set({ currentStep: step }),

  jobDescription: null,
  setJobDescription: (jd) => set({ jobDescription: jd }),

  resumes: [],
  addResume: (resume) => set((state) => ({ resumes: [...state.resumes, resume] })),
  removeResume: (id) => set((state) => ({ resumes: state.resumes.filter((r) => r.id !== id) })),
  clearResumes: () => set({ resumes: [] }),

  scores: [],
  setScores: (scores) => set({ scores }),

  biasAnalysis: null,
  setBiasAnalysis: (bias) => set({ biasAnalysis: bias }),

  resumeInsights: {},
  setResumeInsights: (id, insights) =>
    set((state) => ({ resumeInsights: { ...state.resumeInsights, [id]: insights } })),

  marketInsights: null,
  setMarketInsights: (insights) => set({ marketInsights: insights }),

  executiveSummary: null,
  setExecutiveSummary: (summary) => set({ executiveSummary: summary }),

  shortlistedCandidates: [],
  toggleShortlist: (id) =>
    set((state) => ({
      shortlistedCandidates: state.shortlistedCandidates.includes(id)
        ? state.shortlistedCandidates.filter((c) => c !== id)
        : [...state.shortlistedCandidates, id],
    })),

  selectedCandidate: null,
  setSelectedCandidate: (id) => set({ selectedCandidate: id }),

  showPresentationMode: false,
  togglePresentationMode: () => set((state) => ({ showPresentationMode: !state.showPresentationMode })),

  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}));
