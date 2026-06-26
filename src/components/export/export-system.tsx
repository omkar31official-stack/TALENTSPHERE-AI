'use client';

import { motion } from 'framer-motion';
import { GlassCard } from '@/components/shared/glass-card';
import { useAppStore } from '@/lib/store';
import { Download, FileJson, FileSpreadsheet, FileText, File } from 'lucide-react';
import { useState } from 'react';
import type { ExportFormat } from '@/lib/types';

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function ExportSystem() {
  const { scores, resumes, executiveSummary } = useAppStore();
  const [exporting, setExporting] = useState<ExportFormat | null>(null);

  const exportData = async (format: ExportFormat) => {
    setExporting(format);
    try {
      const data = scores.map((s) => {
        const r = resumes.find((r) => r.id === s.candidateId);
        return {
          name: r?.name || '',
          email: r?.email || '',
          overallScore: s.overallScore,
          skillMatch: s.skillMatch,
          experienceMatch: s.experienceMatch,
          educationMatch: s.educationMatch,
          certificationMatch: s.certificationMatch,
          interviewReadiness: s.interviewReadiness,
          hiringConfidence: s.hiringConfidence,
          strengths: s.strengths.join('; '),
          weaknesses: s.weaknesses.join('; '),
          missingSkills: s.missingSkills.join('; '),
          skills: r?.skills.join('; ') || '',
        };
      });

      if (format === 'json') {
        const content = JSON.stringify({ exportDate: new Date().toISOString(), candidates: data }, null, 2);
        downloadBlob(new Blob([content], { type: 'application/json' }), 'talentsphere-report.json');
      } else if (format === 'csv') {
        const headers = Object.keys(data[0] || {}).join(',');
        const rows = data.map((d) => Object.values(d).map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','));
        const content = [headers, ...rows].join('\n');
        downloadBlob(new Blob([content], { type: 'text/csv' }), 'talentsphere-report.csv');
      } else if (format === 'xlsx') {
        const XLSX = await import('xlsx');
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(wb, ws, 'Candidates');
        if (executiveSummary) {
          const summaryData = [
            { Metric: 'Top Candidate', Value: executiveSummary.topCandidate },
            { Metric: 'Average Score', Value: `${executiveSummary.averageScore}%` },
            { Metric: 'Shortlisted', Value: `${executiveSummary.shortlistCount} / ${executiveSummary.totalCandidates}` },
            { Metric: 'Recommended Interviews', Value: executiveSummary.recommendedInterviews.join(', ') },
          ];
          const ws2 = XLSX.utils.json_to_sheet(summaryData);
          XLSX.utils.book_append_sheet(wb, ws2, 'Executive Summary');
        }
        const xlsxBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        downloadBlob(
          new Blob([xlsxBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
          'talentsphere-report.xlsx'
        );
      } else if (format === 'pdf') {
        const { default: jsPDF } = await import('jspdf');
        const doc = new jsPDF();
        doc.setFontSize(20);
        doc.text('TalentSphere AI - Candidate Report', 14, 22);
        doc.setFontSize(10);
        doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 30);
        doc.text(`Total Candidates: ${scores.length}`, 14, 36);

        let y = 46;
        for (const row of data) {
          if (y > 260) {
            doc.addPage();
            y = 20;
          }
          doc.setFontSize(12);
          doc.text(`${row.name} — Score: ${row.overallScore}%`, 14, y);
          doc.setFontSize(9);
          doc.text(`Skills: ${row.skillMatch}% | Exp: ${row.experienceMatch}% | Edu: ${row.educationMatch}%`, 14, y + 6);
          doc.text(`Confidence: ${row.hiringConfidence}% | Ready: ${row.interviewReadiness}%`, 14, y + 12);
          if (row.strengths) {
            doc.text(`Strengths: ${row.strengths.slice(0, 80)}`, 14, y + 18);
          }
          y += 26;
        }

        if (executiveSummary) {
          doc.addPage();
          doc.setFontSize(16);
          doc.text('Executive Summary', 14, 22);
          doc.setFontSize(10);
          doc.text(`Top Candidate: ${executiveSummary.topCandidate}`, 14, 34);
          doc.text(`Average Score: ${executiveSummary.averageScore}%`, 14, 40);
          doc.text(`Shortlisted: ${executiveSummary.shortlistCount} / ${executiveSummary.totalCandidates}`, 14, 46);
          doc.text(`Recommended Interviews: ${executiveSummary.recommendedInterviews.join(', ')}`, 14, 52);
        }

        doc.save('talentsphere-report.pdf');
      }
    } catch {
      // Export failed silently
    } finally {
      setExporting(null);
    }
  };

  const formats: { format: ExportFormat; icon: typeof Download; label: string; desc: string; color: string }[] = [
    { format: 'csv', icon: FileSpreadsheet, label: 'CSV', desc: 'Spreadsheet-compatible format', color: 'from-green-500 to-emerald-600' },
    { format: 'xlsx', icon: FileText, label: 'XLSX', desc: 'Excel workbook format', color: 'from-blue-500 to-indigo-600' },
    { format: 'json', icon: FileJson, label: 'JSON', desc: 'Structured data format', color: 'from-violet-500 to-purple-600' },
    { format: 'pdf', icon: File, label: 'PDF Report', desc: 'Professional report format', color: 'from-orange-500 to-red-600' },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <GlassCard className="p-8" delay={0.1}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center">
            <Download className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Export Data</h2>
            <p className="text-sm text-muted-foreground">Download candidate rankings and analysis</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {formats.map((f, i) => (
            <motion.button
              key={f.format}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => exportData(f.format)}
              disabled={scores.length === 0 || exporting !== null}
              className="p-6 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all text-left disabled:opacity-50 cursor-pointer"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4`}>
                <f.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-1">{f.label}</h3>
              <p className="text-xs text-muted-foreground">{f.desc}</p>
              {exporting === f.format && (
                <p className="text-xs text-violet-400 mt-2">Generating...</p>
              )}
            </motion.button>
          ))}
        </div>

        {scores.length === 0 && (
          <p className="text-center text-sm text-muted-foreground mt-6">
            Complete the workflow first to export candidate data
          </p>
        )}
      </GlassCard>

      {executiveSummary && (
        <GlassCard className="p-6" delay={0.2}>
          <h3 className="font-semibold mb-3">Executive Summary Data</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Total Candidates', value: executiveSummary.totalCandidates },
              { label: 'Average Score', value: `${executiveSummary.averageScore}%` },
              { label: 'Shortlisted', value: executiveSummary.shortlistCount },
              { label: 'Top Candidate', value: executiveSummary.topCandidate },
            ].map((item) => (
              <div key={item.label} className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="text-lg font-bold">{item.value}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      )}
    </div>
  );
}
