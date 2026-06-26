import type {
  ParsedJobDescription,
  ResumeData,
  CandidateScore,
  BiasAnalysis,
  ResumeInsights,
  MarketInsight,
  ExecutiveSummary,
} from './types';

function tokenize(text: string): string[] {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(Boolean);
}

function cosineSimilarity(a: string[], b: string[]): number {
  const allTerms = new Set([...a, ...b]);
  const vecA = new Map<string, number>();
  const vecB = new Map<string, number>();

  for (const term of a) vecA.set(term, (vecA.get(term) || 0) + 1);
  for (const term of b) vecB.set(term, (vecB.get(term) || 0) + 1);

  let dot = 0;
  let magA = 0;
  let magB = 0;

  for (const term of allTerms) {
    const aVal = vecA.get(term) || 0;
    const bVal = vecB.get(term) || 0;
    dot += aVal * bVal;
    magA += aVal * aVal;
    magB += bVal * bVal;
  }

  if (magA === 0 || magB === 0) return 0;
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

function skillMatchScore(jobSkills: string[], candidateSkills: string[]): number {
  if (jobSkills.length === 0) return 50;
  const normalizedJob = jobSkills.map((s) => s.toLowerCase().trim());
  const normalizedCandidate = candidateSkills.map((s) => s.toLowerCase().trim());

  let matches = 0;
  for (const jobSkill of normalizedJob) {
    if (normalizedCandidate.some((cs) => cs.includes(jobSkill) || jobSkill.includes(cs))) {
      matches++;
    }
  }
  return Math.round((matches / normalizedJob.length) * 100);
}

function experienceMatchScore(jobExp: string, resumeExp: { years: number }[]): number {
  const jobYears = parseInt(jobExp.replace(/\D/g, '')) || 3;
  const totalYears = resumeExp.reduce((sum, e) => sum + e.years, 0);
  if (totalYears >= jobYears) return Math.min(100, 70 + (totalYears - jobYears) * 5);
  return Math.max(0, (totalYears / jobYears) * 100);
}

function educationMatchScore(jobEdu: string, resumeEdu: { degree: string }[]): number {
  const levels: Record<string, number> = {
    phd: 5, doctorate: 5, master: 4, mba: 4, bachelor: 3, degree: 3,
    associate: 2, diploma: 2, high: 1,
  };
  const jobLevel = Object.entries(levels).find(([k]) =>
    jobEdu.toLowerCase().includes(k)
  )?.[1] || 3;

  const candidateLevel = Math.max(
    ...resumeEdu.map((e) =>
      Object.entries(levels).find(([k]) =>
        e.degree.toLowerCase().includes(k)
      )?.[1] || 1
    ),
    0
  );

  if (candidateLevel >= jobLevel) return 100;
  return Math.max(0, (candidateLevel / jobLevel) * 100);
}

function certificationMatchScore(jobCerts: string[], candidateCerts: string[]): number {
  if (jobCerts.length === 0) return 80;
  const normalizedJob = jobCerts.map((c) => c.toLowerCase().trim());
  const normalizedCandidate = candidateCerts.map((c) => c.toLowerCase().trim());

  let matches = 0;
  for (const jobCert of normalizedJob) {
    if (normalizedCandidate.some((cc) => cc.includes(jobCert) || jobCert.includes(cc))) {
      matches++;
    }
  }
  return Math.round((matches / jobCerts.length) * 100);
}

export function analyzeCandidates(
  jd: ParsedJobDescription,
  resumes: ResumeData[]
): CandidateScore[] {
  return resumes.map((resume) => {
    const skillScore = skillMatchScore(jd.skills, resume.skills);
    const expScore = experienceMatchScore(jd.experience, resume.experience);
    const eduScore = educationMatchScore(jd.education, resume.education);
    const certScore = certificationMatchScore(jd.certifications, resume.certifications);

    const jobTokens = tokenize(jd.rawText);
    const resumeTokens = tokenize(resume.rawText);
    const semanticScore = Math.round(cosineSimilarity(jobTokens, resumeTokens) * 100);

    const overallScore = Math.round(
      skillScore * 0.35 +
      expScore * 0.25 +
      eduScore * 0.15 +
      certScore * 0.10 +
      semanticScore * 0.15
    );

    const normalizedJobSkills = jd.skills.map((s) => s.toLowerCase().trim());
    const normalizedCandidateSkills = resume.skills.map((s) => s.toLowerCase().trim());

    const matchedSkills = normalizedJobSkills.filter((js) =>
      normalizedCandidateSkills.some((cs) => cs.includes(js) || js.includes(cs))
    );
    const missingSkills = jd.skills.filter(
      (s) => !normalizedCandidateSkills.some((cs) => cs.includes(s.toLowerCase()) || s.toLowerCase().includes(cs))
    );

    const totalExp = resume.experience.reduce((sum, e) => sum + e.years, 0);
    const hasLeadership = resume.leadership.length > 0 || resume.experience.some(
      (e) => e.title.toLowerCase().includes('lead') || e.title.toLowerCase().includes('manager') ||
             e.title.toLowerCase().includes('director') || e.title.toLowerCase().includes('head')
    );

    const strengths: string[] = [];
    const weaknesses: string[] = [];
    const whySelected: string[] = [];
    const whyRejected: string[] = [];
    const improvements: string[] = [];

    if (skillScore > 70) {
      strengths.push(`Strong skill alignment (${matchedSkills.length}/${jd.skills.length} matched)`);
      whySelected.push('Excellent technical skill coverage');
    }
    if (expScore > 70) {
      strengths.push(`Sufficient experience (${totalExp} years)`);
      whySelected.push('Meets experience requirements');
    }
    if (eduScore > 80) strengths.push('Education requirements exceeded');
    if (certScore > 60) strengths.push('Relevant certifications present');
    if (hasLeadership) strengths.push('Demonstrated leadership experience');
    if (resume.projects.length > 0) strengths.push(`${resume.projects.length} notable projects`);

    if (skillScore < 50) {
      weaknesses.push('Limited skill coverage for this role');
      whyRejected.push('Missing critical technical skills');
    }
    if (expScore < 50) {
      weaknesses.push('Below required experience level');
      whyRejected.push('Insufficient professional experience');
    }
    if (missingSkills.length > 0) {
      improvements.push(`Develop skills: ${missingSkills.slice(0, 3).join(', ')}`);
    }
    if (!hasLeadership && jd.responsibilities.some((r) => r.toLowerCase().includes('lead'))) {
      improvements.push('Gain leadership or team management experience');
    }

    if (overallScore < 50) {
      whyRejected.push(`Overall match score is ${overallScore}% — below threshold`);
    }

    const interviewReadiness = Math.min(100, Math.round(
      overallScore * 0.4 + skillScore * 0.3 + (hasLeadership ? 20 : 10) + (resume.projects.length * 5)
    ));

    const hiringConfidence = Math.min(100, Math.round(
      overallScore * 0.5 + (totalExp > 3 ? 20 : totalExp * 5) + (missingSkills.length < 3 ? 20 : 5)
    ));

    const riskFactors: string[] = [];
    if (missingSkills.length > 3) riskFactors.push('Significant skill gaps detected');
    if (totalExp < 2) riskFactors.push('Limited professional experience');
    if (resume.certifications.length === 0 && jd.certifications.length > 0) riskFactors.push('No matching certifications');

    const leadershipScore = hasLeadership ? Math.min(100, 60 + (totalExp * 5)) : Math.max(0, totalExp * 8);
    const teamFitScore = Math.round(overallScore * 0.6 + (hasLeadership ? 20 : 10) + (skillScore > 60 ? 20 : 5));

    return {
      candidateId: resume.id,
      overallScore,
      skillMatch: skillScore,
      experienceMatch: expScore,
      educationMatch: eduScore,
      certificationMatch: certScore,
      semanticSimilarity: semanticScore,
      whySelected: whySelected.length > 0 ? whySelected : ['Candidate meets basic requirements'],
      whyRejected: whyRejected.length > 0 ? whyRejected : [],
      missingSkills,
      strengths: strengths.length > 0 ? strengths : ['Transferable skills present'],
      weaknesses: weaknesses.length > 0 ? weaknesses : ['No major weaknesses identified'],
      improvements: improvements.length > 0 ? improvements : ['Continue professional development'],
      interviewReadiness,
      hiringConfidence,
      riskFactors,
      leadershipScore,
      teamFitScore,
    };
  }).sort((a, b) => b.overallScore - a.overallScore);
}

export function detectBias(
  scores: CandidateScore[],
  resumes: ResumeData[]
): BiasAnalysis {
  const educationBias: BiasAnalysis['educationBias'] = [];
  const experienceBias: BiasAnalysis['experienceBias'] = [];
  const rankingBias: BiasAnalysis['rankingBias'] = [];

  const eduGroups = new Map<string, CandidateScore[]>();
  scores.forEach((s) => {
    const resume = resumes.find((r) => r.id === s.candidateId);
    const eduLevel = resume?.education[0]?.degree || 'Unknown';
    const group = eduLevel.includes('PhD') || eduLevel.includes('Master') ? 'advanced' : 'standard';
    if (!eduGroups.has(group)) eduGroups.set(group, []);
    eduGroups.get(group)!.push(s);
  });

  const groupScores = Array.from(eduGroups.entries()).map(([g, s]) => ({
    group: g,
    avg: s.reduce((sum, c) => sum + c.overallScore, 0) / s.length,
  }));

  if (groupScores.length > 1) {
    const diff = Math.abs(groupScores[0].avg - groupScores[1].avg);
    if (diff > 15) {
      educationBias.push({
        type: 'Education Level Bias',
        severity: diff > 25 ? 'high' : 'medium',
        description: `${Math.round(diff)}-point average score gap between education groups`,
      });
    }
  }

  const scoreStdDev = Math.sqrt(
    scores.reduce((sum, s) => sum + Math.pow(s.overallScore - scores.reduce((a, b) => a + b.overallScore, 0) / scores.length, 2), 0) / scores.length
  );

  if (scoreStdDev > 25) {
    rankingBias.push({
      type: 'Score Distribution',
      severity: 'medium',
      description: 'High variance in candidate scores may indicate narrow matching criteria',
    });
  }

  const recommendations: string[] = [
    'Consider blind resume review to reduce unconscious bias',
    'Evaluate candidates against defined competency frameworks',
    'Ensure diverse candidate pools for each role',
  ];

  if (educationBias.length > 0) recommendations.push('Review education requirements — are they truly necessary?');
  if (experienceBias.length > 0) recommendations.push('Consider skill-based hiring over years-of-experience requirements');

  const overallFairness = Math.max(0, 100 - (educationBias.length * 15 + experienceBias.length * 15 + rankingBias.length * 10));

  return { overallFairnessScore: overallFairness, educationBias, experienceBias, rankingBias, recommendations };
}

export function generateResumeInsights(resume: ResumeData, jd: ParsedJobDescription): ResumeInsights {
  const jobTokens = new Set(tokenize(jd.rawText));
  const resumeTokens = new Set(tokenize(resume.rawText));
  const missingKeywords = Array.from(jobTokens).filter(
    (t) => t.length > 3 && !resumeTokens.has(t)
  ).slice(0, 10);

  const weakSections: string[] = [];
  if (resume.experience.length < 2) weakSections.push('Add more work experience entries');
  if (resume.skills.length < 5) weakSections.push('Expand technical skills list');
  if (resume.projects.length === 0) weakSections.push('Include project experience');
  if (resume.summary.length < 50) weakSections.push('Write a more detailed professional summary');

  const qualityScore = Math.min(100, Math.round(
    30 + (resume.experience.length * 10) + (resume.skills.length * 3) +
    (resume.projects.length * 8) + (resume.certifications.length * 5) +
    (resume.summary.length > 100 ? 10 : 0)
  ));

  return {
    qualityScore,
    missingKeywords,
    weakSections,
    atsTips: [
      'Use standard section headings (Experience, Education, Skills)',
      'Include keywords from the job description naturally',
      'Use standard date formats',
      'Avoid tables, columns, and graphics',
      `Include relevant terms: ${missingKeywords.slice(0, 3).join(', ')}`,
    ],
    overallSummary: qualityScore > 70
      ? 'Strong resume with good keyword coverage'
      : 'Resume could benefit from additional optimization',
  };
}

export function generateMarketInsights(resumes: ResumeData[]): MarketInsight {
  const skillCount = new Map<string, number>();
  resumes.forEach((r) =>
    r.skills.forEach((s) => skillCount.set(s, (skillCount.get(s) || 0) + 1))
  );

  const total = resumes.length || 1;
  const sorted = Array.from(skillCount.entries()).sort((a, b) => b[1] - a[1]);

  return {
    topSkills: sorted.slice(0, 8).map(([skill, count]) => ({
      skill,
      count,
      trend: 'rising' as const,
      percentage: Math.round((count / total) * 100),
    })),
    rareSkills: sorted.slice(-5).map(([skill, count]) => ({
      skill,
      count,
      trend: count === 1 ? 'rising' as const : 'stable' as const,
      percentage: Math.round((count / total) * 100),
    })),
    skillTrends: sorted.slice(0, 6).map(([skill, count]) => ({
      skill,
      count,
      trend: count > total * 0.5 ? 'rising' as const : count > total * 0.2 ? 'stable' as const : 'declining' as const,
      percentage: Math.round((count / total) * 100),
    })),
    recommendations: [
      'Focus on candidates with high-demand skills for retention',
      'Consider training programs for rare skill development',
      'Benchmark compensation against market skill availability',
      'Build talent pipelines for emerging technology areas',
    ],
  };
}

export function generateExecutiveSummary(
  scores: CandidateScore[],
  resumes: ResumeData[]
): ExecutiveSummary {
  const topScore = scores[0];
  const topCandidate = resumes.find((r) => r.id === topScore?.candidateId);

  const bestSkillMatch = [...scores].sort((a, b) => b.skillMatch - a.skillMatch)[0];
  const bestExpMatch = [...scores].sort((a, b) => b.experienceMatch - a.experienceMatch)[0];

  const avgScore = scores.length
    ? Math.round(scores.reduce((s, c) => s + c.overallScore, 0) / scores.length)
    : 0;

  const shortlisted = scores.filter((s) => s.overallScore >= 60);

  return {
    topCandidate: topCandidate?.name || 'N/A',
    bestSkillMatch,
    bestExperienceMatch: bestExpMatch,
    recommendedInterviews: shortlisted.slice(0, 5).map((s) => {
      const r = resumes.find((r) => r.id === s.candidateId);
      return r?.name || 'Unknown';
    }),
    riskFactors: scores.filter((s) => s.riskFactors.length > 0).flatMap((s) => {
      const r = resumes.find((r) => r.id === s.candidateId);
      return s.riskFactors.map((rf) => `${r?.name}: ${rf}`);
    }).slice(0, 5),
    recruiterNotes: [
      `${scores.length} candidates analyzed`,
      `${shortlisted.length} candidates meet the threshold`,
      `Average match score: ${avgScore}%`,
      `Top candidate scored ${topScore?.overallScore || 0}%`,
    ],
    totalCandidates: scores.length,
    averageScore: avgScore,
    shortlistCount: shortlisted.length,
  };
}

export function generateDemoData(): { jd: ParsedJobDescription; resumes: ResumeData[] } {
  const jd: ParsedJobDescription = {
    title: 'Senior Full-Stack Engineer',
    skills: ['React', 'TypeScript', 'Node.js', 'Python', 'PostgreSQL', 'AWS', 'Docker', 'GraphQL', 'REST APIs', 'Git'],
    responsibilities: [
      'Lead development of customer-facing features',
      'Architect scalable microservices',
      'Mentor junior developers',
      'Conduct code reviews',
      'Design database schemas',
    ],
    experience: '5+ years',
    education: "Bachelor's degree in Computer Science or related field",
    certifications: ['AWS Certified', 'Cloud Certification'],
    rawText: 'Senior Full-Stack Engineer with expertise in React, TypeScript, Node.js, Python, PostgreSQL, AWS, Docker, GraphQL, REST APIs, Git. 5+ years experience. Bachelor degree required. AWS certification preferred.',
  };

  const resumes: ResumeData[] = [
    {
      id: '1', name: 'Sarah Chen', email: 'sarah@example.com', phone: '555-0101',
      skills: ['React', 'TypeScript', 'Node.js', 'Python', 'PostgreSQL', 'AWS', 'Docker', 'GraphQL', 'REST APIs', 'Git', 'MongoDB', 'Redis'],
      experience: [
        { title: 'Senior Software Engineer', company: 'TechCorp', duration: '3 years', years: 3, description: 'Led frontend architecture', skills: ['React', 'TypeScript'] },
        { title: 'Software Engineer', company: 'StartupXYZ', duration: '2.5 years', years: 2.5, description: 'Built full-stack applications', skills: ['Node.js', 'Python'] },
      ],
      education: [{ degree: 'Master of Computer Science', institution: 'Stanford University', year: '2019', gpa: '3.9' }],
      certifications: ['AWS Solutions Architect', 'Google Cloud Professional'],
      projects: [{ name: 'E-Commerce Platform', description: 'Built scalable e-commerce platform', skills: ['React', 'Node.js', 'AWS'] }],
      leadership: ['Tech Lead for 5-person team'],
      summary: 'Experienced full-stack engineer with 5.5 years building scalable web applications at top tech companies. Strong expertise in React and Node.js ecosystems.',
      rawText: 'Sarah Chen Senior Software Engineer React TypeScript Node.js Python PostgreSQL AWS Docker GraphQL Master Computer Science Stanford AWS Solutions Architect Tech Lead',
      fileName: 'sarah_chen.pdf', uploadedAt: new Date(),
    },
    {
      id: '2', name: 'Marcus Johnson', email: 'marcus@example.com', phone: '555-0102',
      skills: ['React', 'TypeScript', 'Node.js', 'Python', 'PostgreSQL', 'AWS', 'Docker', 'REST APIs', 'Git', 'Vue.js'],
      experience: [
        { title: 'Full-Stack Developer', company: 'WebAgency', duration: '4 years', years: 4, description: 'Developed client projects', skills: ['React', 'Node.js'] },
        { title: 'Junior Developer', company: 'DigitalCo', duration: '1 year', years: 1, description: 'Built web interfaces', skills: ['HTML', 'CSS', 'JavaScript'] },
      ],
      education: [{ degree: 'Bachelor of Computer Science', institution: 'MIT', year: '2020', gpa: '3.7' }],
      certifications: ['AWS Cloud Practitioner'],
      projects: [{ name: 'Task Management App', description: 'Real-time task management', skills: ['React', 'Socket.io'] }, { name: 'API Gateway', description: 'Microservices gateway', skills: ['Node.js', 'Docker'] }],
      leadership: [],
      summary: 'Versatile full-stack developer with 5 years of experience. Strong problem solver with a passion for clean code.',
      rawText: 'Marcus Johnson Full-Stack Developer React TypeScript Node.js Python PostgreSQL AWS Docker REST APIs Bachelor Computer Science MIT AWS Cloud Practitioner Vue.js',
      fileName: 'marcus_johnson.pdf', uploadedAt: new Date(),
    },
    {
      id: '3', name: 'Elena Rodriguez', email: 'elena@example.com', phone: '555-0103',
      skills: ['React', 'TypeScript', 'Node.js', 'Python', 'AWS', 'Docker', 'GraphQL', 'Git', 'Kubernetes', 'Terraform'],
      experience: [
        { title: 'Staff Engineer', company: 'BigTech Inc', duration: '4 years', years: 4, description: 'Architected distributed systems', skills: ['Python', 'AWS', 'Kubernetes'] },
        { title: 'Software Engineer', company: 'CloudFirst', duration: '3 years', years: 3, description: 'Built cloud infrastructure', skills: ['AWS', 'Terraform'] },
      ],
      education: [{ degree: 'Master of Computer Science', institution: 'UC Berkeley', year: '2018', gpa: '3.95' }],
      certifications: ['AWS Solutions Architect Professional', 'Kubernetes Administrator', 'Terraform Associate'],
      projects: [{ name: 'Distributed Data Pipeline', description: 'Processed 1M+ events/day', skills: ['Python', 'AWS', 'Kubernetes'] }],
      leadership: ['Engineering Manager for 8-person team', 'Technical Architecture Board member'],
      summary: 'Staff-level engineer with 7 years of experience in distributed systems and cloud architecture. Proven leader managing cross-functional teams.',
      rawText: 'Elena Rodriguez Staff Engineer React TypeScript Node.js Python AWS Docker GraphQL Kubernetes Terraform Master Computer Science UC Berkeley AWS Solutions Architect Professional Kubernetes Administrator Engineering Manager Distributed Systems',
      fileName: 'elena_rodriguez.pdf', uploadedAt: new Date(),
    },
    {
      id: '4', name: 'James Park', email: 'james@example.com', phone: '555-0104',
      skills: ['React', 'TypeScript', 'Node.js', 'Python', 'PostgreSQL', 'REST APIs', 'Git', 'Sass'],
      experience: [
        { title: 'Frontend Developer', company: 'DesignStudio', duration: '3 years', years: 3, description: 'Built responsive UIs', skills: ['React', 'TypeScript', 'Sass'] },
      ],
      education: [{ degree: 'Bachelor of Software Engineering', institution: 'Georgia Tech', year: '2021', gpa: '3.5' }],
      certifications: [],
      projects: [{ name: 'Portfolio Builder', description: 'Drag-and-drop portfolio builder', skills: ['React', 'TypeScript'] }],
      leadership: [],
      summary: 'Frontend-focused developer with 3 years of experience. Strong eye for design and user experience.',
      rawText: 'James Park Frontend Developer React TypeScript Node.js Python PostgreSQL REST APIs Git Sass Bachelor Software Engineering Georgia Tech',
      fileName: 'james_park.pdf', uploadedAt: new Date(),
    },
    {
      id: '5', name: 'Aisha Patel', email: 'aisha@example.com', phone: '555-0105',
      skills: ['React', 'TypeScript', 'Node.js', 'Python', 'PostgreSQL', 'AWS', 'Docker', 'GraphQL', 'REST APIs', 'Git', 'Next.js', 'Prisma'],
      experience: [
        { title: 'Senior Developer', company: 'InnovateTech', duration: '3 years', years: 3, description: 'Led product development', skills: ['React', 'Next.js', 'GraphQL'] },
        { title: 'Software Engineer', company: 'DataFlow', duration: '2 years', years: 2, description: 'Built data visualization tools', skills: ['Python', 'React'] },
        { title: 'Junior Developer', company: 'WebStart', duration: '1.5 years', years: 1.5, description: 'Developed client apps', skills: ['Node.js', 'PostgreSQL'] },
      ],
      education: [{ degree: 'Bachelor of Computer Engineering', institution: 'IIT Bombay', year: '2019', gpa: '3.8' }],
      certifications: ['AWS Developer Associate', 'MongoDB Certified Developer'],
      projects: [
        { name: 'Analytics Dashboard', description: 'Real-time analytics platform', skills: ['Next.js', 'GraphQL', 'Prisma'] },
        { name: 'Mobile API', description: 'RESTful API serving 100K+ users', skills: ['Node.js', 'PostgreSQL'] },
      ],
      leadership: ['Sprint Lead for 6-person agile team'],
      summary: 'Full-stack engineer with 6.5 years of experience spanning frontend, backend, and infrastructure. Passionate about building products that scale.',
      rawText: 'Aisha Patel Senior Developer React TypeScript Node.js Python PostgreSQL AWS Docker GraphQL REST APIs Git Next.js Prisma Bachelor Computer Engineering IIT Bombay AWS Developer Associate MongoDB Certified Developer Sprint Lead Analytics Dashboard Mobile API',
      fileName: 'aisha_patel.pdf', uploadedAt: new Date(),
    },
  ];

  return { jd, resumes };
}
