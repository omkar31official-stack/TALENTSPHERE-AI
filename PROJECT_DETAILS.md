# TalentSphere AI — Complete Project Details

## What This Project Is

TalentSphere AI is an **AI-powered recruiting platform** for discovering, ranking, and analyzing job candidates. It is a **client-side-only** Next.js application (no backend, no database, no API routes). All AI analysis, scoring, and processing happens in the browser. It is deployed on Vercel.

**Repository root:** `/media/omkar/Storage/Projects/TALENTSPHERE AI`
**Deployment:** Vercel (project ID: `prj_VhjuTb2azlTtQj8cB2gPcW9NDvDB`, name: `talentsphere-ai`)
**Live URL pattern:** `https://talentsphere-ai.vercel.app`

---

## What It Does (End-to-End Flow)

1. **User pastes a Job Description** (or loads a built-in demo JD for "Senior Full-Stack Engineer")
2. **User uploads candidate resumes** (PDF, DOCX, TXT — parsed entirely in the browser) OR loads 5 built-in demo candidates
3. **AI matching engine runs client-side** and produces:
   - Weighted overall scores (0–100) for each candidate
   - Skill match, experience match, education match, certification match, semantic similarity scores
   - Strengths, weaknesses, missing skills, risk factors, interview readiness, hiring confidence, leadership score, team fit score
   - Explainable "why selected" / "why rejected" reasons
4. **Bias detection** analyzes fairness across education groups, experience levels, and score distribution
5. **Executive summary** generates a high-level hiring report with top candidate, recommended interviews, risk factors, and recruiter notes
6. **Market insights** aggregate skill frequency across the candidate pool (top skills, rare skills, trends)
7. **Resume insights** evaluate each resume's quality, missing keywords vs the JD, weak sections, and ATS optimization tips
8. **User explores results** through multiple interactive views (Galaxy, Analytics, Copilot, etc.)
9. **User exports** candidate data as CSV, XLSX, JSON, or PDF

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16.2.9 (App Router) |
| React | React 19.2.4 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4, `tw-animate-css` |
| UI Components | shadcn/ui (Base UI variant via `@base-ui/react`) |
| Animation | Framer Motion 12 |
| 3D Visualization | React Three Fiber 9, Three.js 0.184, `@react-three/drei` |
| Charts | Recharts 3 |
| State Management | Zustand 5 |
| PDF Parsing | pdfjs-dist 6 (loaded dynamically via `import()`) |
| DOCX Parsing | mammoth 1.12 (loaded dynamically via `import()`) |
| XLSX Export | xlsx 0.18 (loaded dynamically via `import()`) |
| PDF Export | jsPDF 4 (loaded dynamically via `import()`) |
| CSS Utilities | `clsx`, `tailwind-merge`, `class-variance-authority` |
| Icons | lucide-react |

---

## Project Structure

```
TALENTSPHERE AI/
├── .vercel/                          # Vercel deployment config
├── .env.local                        # Environment variables (if any)
├── next.config.ts                    # Next.js config (empty/default)
├── package.json                      # Dependencies and scripts
├── tsconfig.json                     # TypeScript config
├── postcss.config.mjs                # PostCSS with Tailwind plugin
├── eslint.config.mjs                 # ESLint config
├── components.json                   # shadcn/ui config
├── public/                           # Static assets
└── src/
    ├── app/                          # Next.js App Router
    │   ├── layout.tsx                # Root layout — fonts, ThemeProvider, dark mode default
    │   ├── page.tsx                  # Landing page — IntroAnimation, MatrixRain, ParticlesBg, Hero, Features
    │   ├── not-found.tsx             # Custom 404 page
    │   ├── globals.css               # Global styles
    │   └── dashboard/                # Dashboard section (all under Sidebar layout)
    │       ├── layout.tsx            # Dashboard layout — Sidebar + MatrixRain + ParticlesBg
    │       ├── page.tsx              # Dashboard home — stats cards, top candidates, quick actions, executive summary
    │       ├── workflow/page.tsx     # 3-step workflow pipeline (JD → Resume → AI Analysis)
    │       ├── candidates/page.tsx   # Candidate list with search, sort, expand, shortlist
    │       ├── galaxy/page.tsx       # 3D Talent Galaxy visualization
    │       ├── analytics/page.tsx    # Charts and metrics dashboard
    │       ├── copilot/page.tsx      # AI Recruiter Copilot chat
    │       ├── market/page.tsx       # Market intelligence / skill trends
    │       ├── insights/page.tsx     # Resume quality analysis
    │       ├── executive/page.tsx    # Executive hiring report
    │       └── export/page.tsx       # Data export (CSV/XLSX/JSON/PDF)
    ├── components/
    │   ├── dashboard/
    │   │   └── sidebar.tsx           # Navigation sidebar (desktop + mobile), theme toggle
    │   ├── landing/
    │   │   ├── intro-animation.tsx   # Loading/intro animation (dynamic, no SSR)
    │   │   ├── hero-section.tsx      # Hero with headline, CTA buttons, stats
    │   │   ├── features-section.tsx  # 8-card feature grid
    │   │   └── talent-universe.tsx   # Background 3D universe for hero (dynamic, no SSR)
    │   ├── workflow/
    │   │   ├── job-input-step.tsx    # Step 1: JD textarea or demo data loader
    │   │   ├── resume-upload-step.tsx # Step 2: Drag & drop file upload + demo loader
    │   │   └── ai-analysis-step.tsx  # Step 3: Runs analysis, shows progress bar + results
    │   ├── candidate/
    │   │   └── candidates-list.tsx   # Sortable/searchable candidate table with expandable rows
    │   ├── galaxy/
    │   │   └── talent-galaxy.tsx     # Full 3D scene: center star, candidate planets, orbital rings, nebula, detail panel
    │   ├── analytics/
    │   │   └── analytics-dashboard.tsx # Bar chart, radar chart, area chart, pie chart
    │   ├── copilot/
    │   │   └── copilot-panel.tsx     # Chat UI with suggested questions and pattern-matched answers
    │   ├── market/
    │   │   └── market-insights.tsx   # Top skills bar chart, rare skills list, AI recommendations
    │   ├── insights/
    │   │   └── resume-insights-panel.tsx # Quality score ring, missing keywords, weak sections, ATS tips
    │   ├── executive/
    │   │   └── executive-mode.tsx    # Executive hiring report: top candidate, recommended interviews, risk factors, notes
    │   ├── export/
    │   │   └── export-system.tsx     # Export buttons for CSV, XLSX, JSON, PDF generation
    │   ├── shared/
    │   │   ├── glass-card.tsx        # Reusable glass-morphism card with hover animation
    │   │   ├── score-ring.tsx        # Animated SVG circular score indicator (0-100)
    │   │   ├── magnetic-button.tsx   # Button with magnetic hover effect
    │   │   ├── animated-counter.tsx  # Animated number counter
    │   │   ├── particles-bg.tsx      # Floating gradient orbs background
    │   │   └── matrix-rain.tsx       # Matrix-style rain animation background
    │   └── ui/                       # shadcn/ui base components
    │       ├── button.tsx
    │       ├── card.tsx
    │       ├── badge.tsx
    │       ├── progress.tsx
    │       ├── tabs.tsx
    │       ├── tooltip.tsx
    │       ├── scroll-area.tsx
    │       ├── separator.tsx
    │       ├── avatar.tsx
    │       ├── dialog.tsx
    │       └── sheet.tsx
    ├── lib/
    │   ├── types.ts                  # All TypeScript interfaces
    │   ├── store.ts                  # Zustand global state store
    │   ├── matching-engine.ts        # AI scoring, bias detection, insights, demo data generation
    │   ├── file-parser.ts            # Resume parsing (PDF/DOCX/TXT) + text extraction
    │   └── utils.ts                  # `cn()` utility (clsx + tailwind-merge)
    └── providers/
        └── theme-provider.tsx        # Dark/light theme context provider
```

---

## Core Logic — The Matching Engine (`src/lib/matching-engine.ts`)

This is the brain of the application. Everything runs client-side.

### Key Functions

#### `analyzeCandidates(jd, resumes) → CandidateScore[]`
The main scoring function. For each resume, it computes:

| Score Component | Weight | How It's Calculated |
|----------------|--------|-------------------|
| Skill Match | 35% | Fuzzy substring matching of JD skills against candidate skills. Each JD skill checked if any candidate skill contains it or vice versa. Score = matched/total × 100. |
| Experience Match | 25% | Parses years from JD requirement. If candidate meets/exceeds → 70+ bonus. If below → proportional ratio. |
| Education Match | 15% | Maps education levels (PhD=5, Master=4, Bachelor=3, etc.). Candidate level vs job level, capped at 100. |
| Certification Match | 10% | Fuzzy substring matching of certification lists. Returns 80 if JD has no cert requirements. |
| Semantic Similarity | 15% | Tokenizes raw JD text and raw resume text, builds term frequency vectors, computes cosine similarity. |

**Overall Score** = Σ(component × weight), rounded to integer.

Additionally computes:
- `interviewReadiness`: composite of overall score, skill match, leadership, and project count
- `hiringConfidence`: composite of overall score, years of experience, and missing skills count
- `leadershipScore`: based on leadership titles and years of experience
- `teamFitScore`: based on overall score, leadership, and skill alignment
- `strengths[]`, `weaknesses[]`, `whySelected[]`, `whyRejected[]`, `missingSkills[]`, `improvements[]`, `riskFactors[]`

Results are **sorted by overallScore descending**.

#### `detectBias(scores, resumes) → BiasAnalysis`
- Groups candidates by education level (advanced vs standard)
- Checks if score gap between groups exceeds thresholds (15 = medium, 25 = high)
- Checks score distribution standard deviation (if > 25, flags as potential narrow criteria)
- Returns `overallFairnessScore` (100 minus penalties), bias warnings, and recommendations

#### `generateResumeInsights(resume, jd) → ResumeInsights`
- Tokenizes JD and resume, finds keywords (length > 3) in JD missing from resume
- Identifies weak sections: few experience entries, few skills, no projects, short summary
- `qualityScore`: computed from experience count, skill count, projects, certifications, summary length
- Returns ATS optimization tips

#### `generateMarketInsights(resumes) → MarketInsight`
- Counts skill frequency across all resumes
- `topSkills`: top 8 most common
- `rareSkills`: bottom 5 least common
- `skillTrends`: top 6 with trend labels (rising/stable/declining based on frequency thresholds)
- Returns hiring recommendations

#### `generateExecutiveSummary(scores, resumes) → ExecutiveSummary`
- Top candidate (highest score)
- Best skill match, best experience match (separate lookups)
- Recommended interviews: top 5 candidates with score >= 60
- Risk factors aggregated across all candidates
- Recruiter notes: count, shortlist count, average score, top score

#### `generateDemoData()trfg → { jd, redfgsufmes }`xd
- Returns a pre-built JD for "Senior Full-Stack Engineer" with 10 skills
- Returns 5 demo candidates: Sarah Chen, Marcus Johnson, Elena Rodriguez, James Park, Aisha Patel
- Each has realistic skills, experience (3-7 years), education, certifications, projects, leadership

### Helper Functions
- `tokenize(text)`: lowercases, strips non-alphanumeric, splits on whitespace
- `cosineSimilarity(a, b)`: TF-based cosine similarity between token arrays
- `skillMatchScore(jobSkills, candidateSkills)`: fuzzy substring matching ratio
- `experienceMatchScore(jobExp, resumeExp)`: years comparison with bonus for exceeding
- `educationMatchScore(jobEdu, resumeEdu)`: level mapping and comparison
- `certificationMatchScore(jobCerts, candidateCerts)`: fuzzy substring matching ratio

---

## File Parser (`src/lib/file-parser.ts`)

Parses resumes from three formats, entirely in the browser:

- **PDF**: Uses `pdfjs-dist` with a web worker loaded from unpkg CDN. Extracts text from all pages.
- **DOCX**: Uses `mammoth` to extract raw text.
- **TXT**: Direct `file.text()`.

After extracting raw text, `parseResumeText()` performs regex-based extraction:
- **Name**: First line matching `^[A-Z][a-z]+ [A-Z][a-z]+`
- **Email**: Regex `[\w.-]+@[\w.-]+\.\w+`
- **Phone**: Regex for US phone formats
- **Skills**: Matches against a hardcoded list of 50+ tech keywords (JavaScript, React, Python, AWS, etc.)
- **Sections**: Splits by keywords (experience, education, projects, certifications)
- **Experience**: Parses title, company, duration, years from date/duration patterns
- **Education**: Filters degree-related keywords
- **Leadership**: Identifies titles containing lead/manager/director/head/senior

---

## State Management (`src/lib/store.ts`)

Uses Zustand with a single global store. Key state slices:

```typescript
{
  theme: 'dark' | 'light'
  currentStep: number (0|1|2 — workflow step)
  jobDescription: ParsedJobDescription | null
  resumes: ResumeData[]
  scores: CandidateScore[]
  biasAnalysis: BiasAnalysis | null
  resumeInsights: Record<string, ResumeInsights>
  marketInsights: MarketInsight | null
  executiveSummary: ExecutiveSummary | null
  shortlistedCandidates: string[] (IDs)
  selectedCandidate: string | null
  showPresentationMode: boolean
  sidebarOpen: boolean
}
```

All state is in-memory. There is no persistence (no localStorage, no API calls). Refreshing the page resets everything.

---

## Type System (`src/lib/types.ts`)

Key interfaces:
- `ParsedJobDescription`: title, skills[], responsibilities[], experience, education, certifications[], rawText
- `ResumeData`: id, name, email, phone, skills[], experience[], education[], certifications[], projects[], leadership[], summary, rawText, fileName, uploadedAt
- `ExperienceItem`: title, company, duration, years, description, skills[]
- `EducationItem`: degree, institution, year, gpa?
- `CandidateScore`: 15+ score/metric fields including overallScore, skillMatch, experienceMatch, educationMatch, certificationMatch, semanticSimilarity, whySelected[], whyRejected[], missingSkills[], strengths[], weaknesses[], improvements[], interviewReadiness, hiringConfidence, riskFactors[], leadershipScore, teamFitScore
- `BiasAnalysis`: overallFairnessScore, educationBias[], experienceBias[], rankingBias[], recommendations[]
- `ResumeInsights`: qualityScore, missingKeywords[], weakSections[], atsTips[], overallSummary
- `MarketInsight`: topSkills[], rareSkills[], skillTrends[], recommendations[]
- `ExecutiveSummary`: topCandidate, bestSkillMatch, bestExperienceMatch, recommendedInterviews[], riskFactors[], recruiterNotes[], totalCandidates, averageScore, shortlistCount
- `GalaxyPlanet`: id, name, size, color, distance, speed, score, skills[]
- `ExportFormat`: 'csv' | 'xlsx' | 'json' | 'pdf'
- `Theme`: 'light' | 'dark'

---

## Pages & Routes

| Route | Component | What It Shows |
|-------|-----------|--------------|
| `/` | Landing page | Intro animation, matrix rain, particle background, hero with CTA, features grid |
| `/dashboard` | Dashboard home | Stats cards (candidates, avg score, shortlisted, fairness), top 5 candidates, quick actions, executive summary card |
| `/dashboard/workflow` | Workflow pipeline | 3-step stepper: JD input → Resume upload → AI analysis with progress bar |
| `/dashboard/candidates` | Candidate list | Searchable, sortable table with expandable rows, shortlist stars |
| `/dashboard/galaxy` | Talent Galaxy | 3D Three.js scene with orbiting candidate planets, center star, nebula, click-to-detail panel |
| `/dashboard/analytics` | Analytics | Bar chart (candidate comparison), radar chart (skill radar), area chart (score distribution), pie chart (match quality) |
| `/dashboard/copilot` | AI Copilot | Chat interface with suggested questions, pattern-matched responses about candidates |
| `/dashboard/market` | Market Intel | Top skills horizontal bar chart, rare skills list, AI recommendations |
| `/dashboard/insights` | Resume Insights | Per-candidate quality score ring, missing keywords, weak sections, ATS tips |
| `/dashboard/executive` | Executive Report | Top candidate, average score, shortlisted count, recommended interviews, risk factors, recruiter notes |
| `/dashboard/export` | Export | 4 export format cards (CSV, XLSX, JSON, PDF), executive summary data preview |

---

## UI / Design System

### Visual Identity
- **Dark-first**: Default theme is dark. Light mode available via sidebar toggle.
- **Color palette**: Violet (`#8b5cf6`) as primary, Cyan (`#06b6d4`) as accent. Gradient combinations throughout.
- **Glass morphism**: `GlassCard` component used everywhere — semi-transparent backgrounds, border highlights, hover glow effects.
- **Typography**: Geist Sans + Geist Mono fonts. Ultra-tight tracking on labels (`tracking-[0.3em]`). Very small uppercase labels (`text-[10px]`).
- **Animations**: Framer Motion for page transitions, card entrances, hover effects. Matrix rain and particle backgrounds on all pages.

### Shared Components
- `GlassCard`: Reusable animated card with glass-morphism, hover lift, and gradient border glow
- `ScoreRing`: Animated SVG donut chart showing 0-100 score with color coding (green >= 80, yellow >= 65, orange >= 45, red < 45)
- `MagneticButton`: Button with magnetic pull hover effect
- `AnimatedCounter`: Number counter that animates from 0 to target value
- `ParticlesBg`: 10 floating gradient orbs with slow movement animation
- `MatrixRain`: Matrix-style falling characters animation (dynamic import, no SSR)

### 3D Galaxy
- Built with React Three Fiber + Three.js
- Center star with glow, two torus rings, point lights
- Each candidate is a sphere planet orbiting at different distances/speeds
- Planet size = experience (relative), color = skill match score, distance from center = inverse of overall score
- 500-particle nebula background with seeded random positions
- 3000 star field via drei's `<Stars>`
- Click a planet → slide-in detail panel with full candidate profile, scores, shortlist button
- Orbital rings at 4 distances with different colors/opacities

### Copilot AI
- Pattern-matched NLP (not a real LLM). Recognizes keywords in questions:
  - "top"/"best"/"first" → returns top-ranked candidate
  - "python"/"aws" → filters candidates with that skill
  - "leadership"/"lead" → finds candidates with leadership titles
  - "compare"/"top 3" → side-by-side comparison
  - "gap"/"missing" → aggregated skill gaps
  - "interview"/"ready" → sorted by interview readiness
  - "certification" → certification frequency
- Suggested questions shown as quick-reply chips

### Export System
- **CSV**: Manual string construction with proper escaping
- **XLSX**: Uses `xlsx` library, creates "Candidates" sheet + optional "Executive Summary" sheet
- **JSON**: Structured object with export date and candidates array
- **PDF**: Uses `jsPDF`, generates multi-page report with candidate summaries and executive summary page
- All exports download as browser file downloads via `URL.createObjectURL`

---

## Important Architecture Decisions

1. **100% Client-Side**: No backend, no API routes, no database. All computation happens in the browser. This means:
   - No server costs beyond Vercel hosting
   - All data is lost on page refresh (no persistence)
   - Large resume files are parsed in-browser (may be slow for many files)
   - The "AI" is algorithmic (cosine similarity, weighted scoring), not LLM-based

2. **Dynamic Imports**: Heavy libraries (`pdfjs-dist`, `mammoth`, `xlsx`, `jspdf`, Three.js components) are loaded via `next/dynamic` or `import()` to keep initial bundle small.

3. **No Real AI/LLM**: The matching engine uses cosine similarity, fuzzy string matching, and weighted heuristics. The copilot uses keyword pattern matching. There are no external AI API calls.

4. **Demo Data Built-In**: The app ships with realistic demo data (5 candidates, 1 JD) so users can try the full workflow without uploading any files.

5. **Zustand for State**: Single flat store, no persistence middleware. All analysis results stored in memory.

6. **shadcn/ui (Base UI)**: UI primitives are from shadcn with Base UI variant (not Radix). Located in `src/components/ui/`.

---

## Scripts

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint"
}
```

---

## How to Run

```bash
npm install
npm run dev
# Open http://localhost:3000
```

---

## Known Limitations

- No data persistence — refreshing loses all uploaded resumes and analysis results
- No authentication or user accounts
- Resume parsing is regex-based and may miss/unextract sections from non-standard formats
- The copilot "AI" is keyword-based, not conversational
- No real-time collaboration
- No backend API — all processing is client-side only
- Demo data is hardcoded, not randomized
