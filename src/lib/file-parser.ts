import type { ResumeData } from './types';

function generateId(): string {
  return Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
}

function parseResumeText(text: string, fileName: string): ResumeData {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);

  const name =
    lines.find((l) => /^[A-Z][a-z]+ [A-Z][a-z]+/.test(l)) ||
    lines[0] ||
    'Unknown Candidate';

  const email =
    lines.find((l) => /[\w.-]+@[\w.-]+\.\w+/.test(l))?.match(/[\w.-]+@[\w.-]+\.\w+/)?.[0] ||
    '';

  const phone =
    lines.find((l) => /\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(l))?.match(/\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/)?.[0] ||
    '';

  const textLower = text.toLowerCase();
  const skillKeywords = [
    'JavaScript', 'TypeScript', 'React', 'Angular', 'Vue', 'Node.js', 'Python',
    'Java', 'C++', 'C#', 'Go', 'Rust', 'Ruby', 'PHP', 'Swift', 'Kotlin',
    'SQL', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'DynamoDB',
    'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Terraform',
    'GraphQL', 'REST', 'REST API', 'REST APIs', 'Git', 'CI/CD',
    'Machine Learning', 'AI', 'TensorFlow', 'PyTorch',
    'HTML', 'CSS', 'Sass', 'Tailwind', 'Webpack', 'Vite',
    'Next.js', 'Nuxt.js', 'Express', 'Django', 'Flask', 'Rails', 'Spring',
    'Agile', 'Scrum', 'JIRA',
    'Figma', 'Sketch', 'Adobe',
  ];
  const skills = skillKeywords.filter((s) =>
    textLower.includes(s.toLowerCase())
  );

  const sections: Record<string, string[]> = {};
  let currentSection = 'header';
  for (const line of lines) {
    const lower = line.toLowerCase();
    if (lower.includes('experience') || lower.includes('work history')) {
      currentSection = 'experience';
      sections[currentSection] = sections[currentSection] || [];
    } else if (lower.includes('education')) {
      currentSection = 'education';
      sections[currentSection] = sections[currentSection] || [];
    } else if (lower.includes('project')) {
      currentSection = 'projects';
      sections[currentSection] = sections[currentSection] || [];
    } else if (lower.includes('certification')) {
      currentSection = 'certifications';
      sections[currentSection] = sections[currentSection] || [];
    } else {
      sections[currentSection] = sections[currentSection] || [];
      sections[currentSection].push(line);
    }
  }

  const expLines = sections['experience'] || [];
  const experience: ResumeData['experience'] = [];
  let currentExp: Partial<ResumeData['experience'][number]> | null = null;
  for (const line of expLines) {
    if (line.match(/\d{4}\s*[-–]\s*(?:present|current|\d{4})/i) || line.match(/\d+\s*(year|month)/i)) {
      if (currentExp?.title) {
        experience.push({
          title: currentExp.title,
          company: currentExp.company || '',
          duration: currentExp.duration || '',
          years: currentExp.years || 1,
          description: currentExp.description || '',
          skills: currentExp.skills || [],
        });
      }
      const titleMatch = line.match(/^([^@–\-]+?)(?:\s*[-–@]\s*(.+))?$/);
      currentExp = {
        title: titleMatch?.[1]?.trim() || line,
        company: titleMatch?.[2]?.trim() || '',
        duration: line.match(/\d+\s*(?:year|month|yr|mo)/i)?.[0] || '',
        years: parseInt(line.match(/(\d+)\s*year/i)?.[1] || '1'),
      };
    } else if (currentExp) {
      currentExp.description = (currentExp.description || '') + ' ' + line;
    }
  }
  if (currentExp?.title) {
    experience.push({
      title: currentExp.title,
      company: currentExp.company || '',
      duration: currentExp.duration || '',
      years: currentExp.years || 1,
      description: currentExp.description || '',
      skills: currentExp.skills || [],
    });
  }

  if (experience.length === 0 && expLines.length > 0) {
    experience.push({
      title: expLines[0] || 'Position',
      company: expLines[1] || '',
      duration: 'Current',
      years: 3,
      description: expLines.join(' '),
      skills: [],
    });
  }

  const eduLines = sections['education'] || [];
  const education: ResumeData['education'] = eduLines
    .filter((l) => l.match(/degree|bachelor|master|phd|bs|ba|ms|ma|mba|b\.s|b\.a|m\.s|m\.a/i))
    .map((l) => ({
      degree: l,
      institution: '',
      year: l.match(/\d{4}/)?.[0] || '',
    }));

  if (education.length === 0 && eduLines.length > 0) {
    education.push({
      degree: eduLines[0],
      institution: eduLines[1] || '',
      year: eduLines.join(' ').match(/\d{4}/)?.[0] || '',
    });
  }

  const certLines = sections['certifications'] || [];
  const certifications = certLines.filter((l) => l.length > 3);

  const projectLines = sections['projects'] || [];
  const projects: ResumeData['projects'] = projectLines
    .filter((l) => l.length > 3)
    .map((l) => ({
      name: l.split(/[-–:]/)[0]?.trim() || l.slice(0, 40),
      description: l,
      skills: [],
    }));

  const leadership = experience
    .filter((e) =>
      e.title.toLowerCase().includes('lead') ||
      e.title.toLowerCase().includes('manager') ||
      e.title.toLowerCase().includes('director') ||
      e.title.toLowerCase().includes('head') ||
      e.title.toLowerCase().includes('senior')
    )
    .map((e) => `${e.title} at ${e.company}`);

  return {
    id: generateId(),
    name,
    email,
    phone,
    skills,
    experience,
    education,
    certifications,
    projects,
    leadership,
    summary: text.slice(0, 300),
    rawText: text,
    fileName,
    uploadedAt: new Date(),
  };
}

async function parsePdf(file: File): Promise<string> {
  const pdfjsLib = await import('pdfjs-dist');
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const textParts: string[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items
      .filter((item) => 'str' in item)
      .map((item) => (item as { str: string }).str);
    textParts.push(strings.join(' '));
  }

  return textParts.join('\n');
}

async function parseDocx(file: File): Promise<string> {
  const mammoth = await import('mammoth');
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}

async function parseTxt(file: File): Promise<string> {
  return file.text();
}

export async function parseResumeFile(file: File): Promise<ResumeData> {
  const ext = file.name.split('.').pop()?.toLowerCase();

  let rawText: string;
  if (ext === 'pdf') {
    rawText = await parsePdf(file);
  } else if (ext === 'docx') {
    rawText = await parseDocx(file);
  } else {
    rawText = await parseTxt(file);
  }

  return parseResumeText(rawText, file.name);
}
