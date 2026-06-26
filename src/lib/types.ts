export interface ParsedJobDescription {
  title: string;
  skills: string[];
  responsibilities: string[];
  experience: string;
  education: string;
  certifications: string[];
  rawText: string;
}

export interface ResumeData {
  id: string;
  name: string;
  email: string;
  phone: string;
  skills: string[];
  experience: ExperienceItem[];
  education: EducationItem[];
  certifications: string[];
  projects: ProjectItem[];
  leadership: string[];
  summary: string;
  rawText: string;
  fileName: string;
  uploadedAt: Date;
}

export interface ExperienceItem {
  title: string;
  company: string;
  duration: string;
  years: number;
  description: string;
  skills: string[];
}

export interface EducationItem {
  degree: string;
  institution: string;
  year: string;
  gpa?: string;
}

export interface ProjectItem {
  name: string;
  description: string;
  skills: string[];
}

export interface CandidateScore {
  candidateId: string;
  overallScore: number;
  skillMatch: number;
  experienceMatch: number;
  educationMatch: number;
  certificationMatch: number;
  semanticSimilarity: number;
  whySelected: string[];
  whyRejected: string[];
  missingSkills: string[];
  strengths: string[];
  weaknesses: string[];
  improvements: string[];
  interviewReadiness: number;
  hiringConfidence: number;
  riskFactors: string[];
  leadershipScore: number;
  teamFitScore: number;
}

export interface BiasAnalysis {
  overallFairnessScore: number;
  educationBias: BiasWarning[];
  experienceBias: BiasWarning[];
  rankingBias: BiasWarning[];
  recommendations: string[];
}

export interface BiasWarning {
  type: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
}

export interface ResumeInsights {
  qualityScore: number;
  missingKeywords: string[];
  weakSections: string[];
  atsTips: string[];
  overallSummary: string;
}

export interface MarketInsight {
  topSkills: SkillTrend[];
  rareSkills: SkillTrend[];
  skillTrends: SkillTrend[];
  recommendations: string[];
}

export interface SkillTrend {
  skill: string;
  count: number;
  trend: 'rising' | 'stable' | 'declining';
  percentage: number;
}

export interface ExecutiveSummary {
  topCandidate: string;
  bestSkillMatch: CandidateScore | null;
  bestExperienceMatch: CandidateScore | null;
  recommendedInterviews: string[];
  riskFactors: string[];
  recruiterNotes: string[];
  totalCandidates: number;
  averageScore: number;
  shortlistCount: number;
}

export interface GalaxyPlanet {
  id: string;
  name: string;
  size: number;
  color: string;
  distance: number;
  speed: number;
  score: number;
  skills: string[];
}

export interface TeamRequirement {
  skill: string;
  importance: 'critical' | 'important' | 'nice-to-have';
}

export type ExportFormat = 'csv' | 'xlsx' | 'json' | 'pdf';

export type Theme = 'light' | 'dark';
