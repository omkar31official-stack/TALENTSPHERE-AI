'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '@/components/shared/glass-card';
import { useAppStore } from '@/lib/store';
import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Bot, User } from 'lucide-react';
import type { CandidateScore, ResumeData } from '@/lib/types';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const suggestedQuestions = [
  'Who is the top-ranked candidate?',
  'Show candidates with Python skills',
  'Who has the strongest leadership experience?',
  'Compare top 3 candidates',
  'What are the skill gaps across all candidates?',
  'Who is most interview-ready?',
  'Show candidates with AWS experience',
  'What certifications are most common?',
];

function generateAnswer(question: string, scores: CandidateScore[], resumes: ResumeData[]): string {
  const q = question.toLowerCase();

  if (q.includes('top') || q.includes('best') || q.includes('first')) {
    const top = resumes.find((r) => r.id === scores[0]?.candidateId);
    return `Based on AI analysis, **${top?.name}** is the top-ranked candidate with an overall score of **${scores[0]?.overallScore}%**. They score ${scores[0]?.skillMatch}% on skills, ${scores[0]?.experienceMatch}% on experience, and have a hiring confidence of ${scores[0]?.hiringConfidence}%.`;
  }

  if (q.includes('python')) {
    const pythonCandidates = resumes.filter((r) => r.skills.some((s) => s.toLowerCase().includes('python')));
    if (pythonCandidates.length === 0) return 'No candidates with Python skills found.';
    return `Found **${pythonCandidates.length}** candidates with Python skills: ${pythonCandidates.map((r) => `**${r.name}**`).join(', ')}. ${pythonCandidates.length > 1 ? 'Their skill match scores vary based on overall alignment with the job requirements.' : ''}`;
  }

  if (q.includes('leadership') || q.includes('lead')) {
    const leaders = resumes.filter((r) => r.leadership.length > 0 || r.experience.some((e) => e.title.toLowerCase().includes('lead') || e.title.toLowerCase().includes('manager')));
    if (leaders.length === 0) return 'No candidates with explicit leadership experience found.';
    return `**${leaders.length}** candidates have leadership experience: ${leaders.map((r) => `**${r.name}** (${r.leadership[0] || r.experience.find((e) => e.title.toLowerCase().includes('lead'))?.title})`).join(', ')}.`;
  }

  if (q.includes('compare') || q.includes('top 3')) {
    const top3 = scores.slice(0, 3);
    return `Here's a comparison of the top 3 candidates:\n\n${top3.map((s, i) => {
      const r = resumes.find((r) => r.id === s.candidateId);
      return `**${i + 1}. ${r?.name}** (${s.overallScore}%)\n• Skills: ${s.skillMatch}% | Experience: ${s.experienceMatch}% | Education: ${s.educationMatch}%\n• Interview Ready: ${s.interviewReadiness}%`;
    }).join('\n\n')}`;
  }

  if (q.includes('gap') || q.includes('missing')) {
    const allMissing = new Map<string, number>();
    scores.forEach((s) => s.missingSkills.forEach((sk) => allMissing.set(sk, (allMissing.get(sk) || 0) + 1)));
    const sorted = Array.from(allMissing.entries()).sort((a, b) => b[1] - a[1]).slice(0, 5);
    return `The most common skill gaps across all candidates are:\n\n${sorted.map(([skill, count]) => `• **${skill}** — missing in ${count}/${scores.length} candidates`).join('\n')}\n\nConsider candidates who already have these skills or invest in training programs.`;
  }

  if (q.includes('interview') || q.includes('ready')) {
    const ready = [...scores].sort((a, b) => b.interviewReadiness - a.interviewReadiness).slice(0, 3);
    return `Most interview-ready candidates:\n\n${ready.map((s, i) => {
      const r = resumes.find((r) => r.id === s.candidateId);
      return `**${i + 1}. ${r?.name}** — ${s.interviewReadiness}% ready`;
    }).join('\n')}\n\nThese candidates have strong skill alignment and demonstrated experience.`;
  }

  if (q.includes('aws')) {
    const awsCandidates = resumes.filter((r) => r.skills.some((s) => s.toLowerCase().includes('aws')));
    return `**${awsCandidates.length}** candidates have AWS experience: ${awsCandidates.map((r) => `**${r.name}**`).join(', ')}.`;
  }

  if (q.includes('certification')) {
    const certMap = new Map<string, number>();
    resumes.forEach((r) => r.certifications.forEach((c) => certMap.set(c, (certMap.get(c) || 0) + 1)));
    const sorted = Array.from(certMap.entries()).sort((a, b) => b[1] - a[1]);
    return `Most common certifications across candidates:\n\n${sorted.map(([cert, count]) => `• **${cert}** — ${count} candidates`).join('\n')}`;
  }

  return `I can help you analyze your candidates. Try asking about:\n\n• Who is the top-ranked candidate?\n• Skill comparisons\n• Leadership experience\n• Interview readiness\n• Skill gaps\n• Certification analysis\n• Specific technology skills (Python, AWS, etc.)`;
}

export function RecruiterCopilot() {
  const { scores, resumes } = useAppStore();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hi! I'm your AI Recruiter Copilot. Ask me anything about your candidates. I can compare rankings, identify skill gaps, suggest interviews, and more.",
    },
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const msgRef = useRef(0);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const sendMessage = useCallback((text: string) => {
    if (!text.trim()) return;

    msgRef.current += 1;
    const id = msgRef.current;
    const userMsg: Message = { id: `user-${id}`, role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    setTimeout(() => {
      const answer = generateAnswer(text, scores, resumes);
      const botMsg: Message = { id: `bot-${id}`, role: 'assistant', content: answer };
      setMessages((prev) => [...prev, botMsg]);
    }, 800);
  }, [scores, resumes]);

  if (scores.length === 0) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <p className="text-muted-foreground">Complete the workflow to use the AI Copilot</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-160px)]">
      <GlassCard className="flex-1 flex flex-col overflow-hidden" hover={false}>
        <div className="flex items-center gap-3 p-4 border-b border-white/10">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">AI Recruiter Copilot</h3>
            <p className="text-xs text-muted-foreground">Ask about your candidates</p>
          </div>
          <div className="ml-auto flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
            <span className="text-[10px] text-green-400">Online</span>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence mode="popLayout">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-violet-600 text-white rounded-br-md'
                      : 'bg-white/5 border border-white/10 rounded-bl-md'
                  }`}
                >
                  <p className="whitespace-pre-line" dangerouslySetInnerHTML={{ __html: msg.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                </div>
                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="p-3 border-t border-white/10">
          <div className="flex gap-2 mb-2 overflow-x-auto pb-1">
            {suggestedQuestions.slice(0, 4).map((q) => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                className="shrink-0 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
              placeholder="Ask about candidates..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-foreground placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim()}
              className="p-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white disabled:opacity-50 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
