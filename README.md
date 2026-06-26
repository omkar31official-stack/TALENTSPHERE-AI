# TalentSphere AI

AI-powered recruiting platform for discovering, ranking, and analyzing talent with explainable AI, bias detection, and 3D talent visualization.

## Features

- **AI Matching Engine** — Semantic analysis and weighted scoring for candidate-job matching
- **Bias Detection** — Real-time fairness analysis ensuring unbiased hiring decisions
- **Talent Galaxy** — Interactive 3D universe visualization of candidates
- **Smart Analytics** — Radar charts, heatmaps, and trend analysis
- **Resume Insights** — ATS optimization tips, missing keywords, and quality scoring
- **AI Recruiter Copilot** — Ask questions about your candidate pool in natural language
- **Executive Hiring Report** — High-level summary and recommendations
- **Export System** — CSV, XLSX, JSON, and PDF report generation
- **File Upload** — Parse PDF, DOCX, and TXT resumes in-browser

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI**: Tailwind CSS 4, Framer Motion, shadcn/ui (Base UI)
- **3D**: React Three Fiber, Three.js
- **Charts**: Recharts
- **State**: Zustand
- **PDF Parsing**: pdfjs-dist
- **DOCX Parsing**: mammoth
- **XLSX Export**: xlsx
- **PDF Export**: jsPDF

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Landing page
│   ├── layout.tsx          # Root layout
│   ├── not-found.tsx       # Custom 404
│   └── dashboard/          # Dashboard pages
│       ├── page.tsx        # Overview
│       ├── workflow/        # JD → Resume → Analysis pipeline
│       ├── candidates/      # Candidate list & search
│       ├── galaxy/          # 3D talent visualization
│       ├── analytics/       # Charts & metrics
│       ├── copilot/         # AI chat assistant
│       ├── market/          # Skill trends
│       ├── insights/        # Resume quality analysis
│       ├── executive/       # Hiring summary
│       └── export/          # Data export
├── components/
│   ├── analytics/          # Analytics charts
│   ├── candidate/          # Candidate list
│   ├── copilot/            # AI chat
│   ├── dashboard/          # Sidebar
│   ├── executive/          # Executive report
│   ├── export/             # Export system
│   ├── galaxy/             # 3D talent galaxy
│   ├── insights/           # Resume insights
│   ├── landing/            # Landing page components
│   ├── market/             # Market intelligence
│   ├── shared/             # Glass cards, score rings, etc.
│   ├── ui/                 # shadcn/ui components
│   └── workflow/           # Workflow steps
├── lib/
│   ├── matching-engine.ts  # AI scoring & analysis
│   ├── file-parser.ts      # PDF/DOCX/TXT resume parsing
│   ├── store.ts            # Zustand state
│   ├── types.ts            # TypeScript types
│   └── utils.ts            # Utility functions
└── providers/
    └── theme-provider.tsx  # Dark/light theme
```

## Usage

1. **Workflow**: Go to Dashboard → Workflow
2. **Job Description**: Paste a JD or load demo data
3. **Upload Resumes**: Drag & drop files or load demo candidates
4. **AI Analysis**: The engine scores candidates and detects bias
5. **Explore**: Use Galaxy, Analytics, Copilot, and other views to explore results

## License

Private project.
# TALENTSPHERE-AI
