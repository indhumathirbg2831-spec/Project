import React from 'react';
import { AlertCircle, Plus, Info, Check } from 'lucide-react';
import { ResumeAnalysisResult } from '../types';
import { motion } from 'motion/react';

interface AtsViewProps {
  data: ResumeAnalysisResult;
}

export default function AtsView({ data }: AtsViewProps) {
  const { atsEvaluation } = data;

  return (
    <div id="ats-evaluation-tab" className="space-y-6">
      {/* Intro Warning */}
      <div className="bg-neutral-50 rounded-2xl border border-neutral-200 p-5 flex items-start gap-3.5">
        <Info size={18} className="text-neutral-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-sm font-semibold text-neutral-900">How ATS Systems Evaluate Your Resume</h4>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Most Applicant Tracking Systems scan resumes to index and search for semantic keywords matching the job description.
            The lists below are customized to align your resume with the target role of <strong className="text-neutral-900">"{atsEvaluation.targetRole}"</strong>.
            Integrating these terms naturally inside your work experience accomplishments will maximize your score.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Missing Skills Checklist */}
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle size={18} className="text-amber-500" />
            <h3 className="text-base font-bold text-neutral-900">Missing Core Skills</h3>
          </div>
          <p className="text-xs text-neutral-500 mb-4">
            These essential technologies or qualifications are required for <strong className="text-neutral-800">{atsEvaluation.targetRole}</strong> but are missing or poorly defined.
          </p>

          {atsEvaluation.missingSkills && atsEvaluation.missingSkills.length > 0 ? (
            <div className="space-y-2">
              {atsEvaluation.missingSkills.map((skill, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  key={index}
                  className="flex items-center justify-between p-3 rounded-xl border border-neutral-100 bg-neutral-50/50 hover:bg-neutral-50 transition-colors"
                >
                  <span className="text-sm font-medium text-neutral-800">{skill}</span>
                  <span className="text-[10px] font-mono uppercase tracking-wider bg-amber-50 text-amber-700 px-2 py-0.5 rounded font-semibold border border-amber-100">
                    High Priority
                  </span>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-neutral-400 border border-dashed border-neutral-200 rounded-xl">
              <Check className="mx-auto text-emerald-500 mb-2" size={24} />
              <p className="text-sm font-medium text-neutral-700">Excellent Skill Coverage!</p>
              <p className="text-xs mt-0.5">Your resume contains all major skills expected for this job level.</p>
            </div>
          )}
        </div>

        {/* Suggested SEO Keywords */}
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-1">
            <Plus size={18} className="text-neutral-500" />
            <h3 className="text-base font-bold text-neutral-900">Suggested ATS Keywords</h3>
          </div>
          <p className="text-xs text-neutral-500 mb-4">
            Add these industry-standard terms, abbreviations, or phrases to increase your keyword matchmaking rate.
          </p>

          {atsEvaluation.suggestedKeywords && atsEvaluation.suggestedKeywords.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {atsEvaluation.suggestedKeywords.map((keyword, index) => (
                <motion.span
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.03 }}
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-neutral-200 bg-white text-xs font-medium text-neutral-800 hover:border-neutral-300 transition-colors cursor-default"
                >
                  <span className="w-1 h-1 rounded-full bg-neutral-400"></span>
                  {keyword}
                </motion.span>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-neutral-400 border border-dashed border-neutral-200 rounded-xl">
              <p className="text-sm font-medium text-neutral-700">No Extra Keywords Needed</p>
              <p className="text-xs mt-0.5">Your current vocabulary aligns highly with standard ATS indexes.</p>
            </div>
          )}
        </div>
      </div>

      {/* Checklist instructions */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 space-y-3">
        <h4 className="text-sm font-bold text-neutral-900">💡 Optimization Quick Tips</h4>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-neutral-600 leading-relaxed">
          <li className="flex gap-2">
            <span className="text-black font-semibold shrink-0">1.</span>
            <span><strong>Do not stuff keywords:</strong> Always weave skills and keywords into active achievement statements. Write "Built responsive frontend using React" rather than a block of plain keywords in your footers.</span>
          </li>
          <li className="flex gap-2">
            <span className="text-black font-semibold shrink-0">2.</span>
            <span><strong>Use both acronyms and full names:</strong> Write "Project Manager (PMP)" or "Content Management System (CMS)" since ATS software sometimes searches for one specific format.</span>
          </li>
          <li className="flex gap-2">
            <span className="text-black font-semibold shrink-0">3.</span>
            <span><strong>Simplify formatting:</strong> Avoid multi-column text tables, text boxes, and charts. Simple single-column layouts parse with 100% precision.</span>
          </li>
          <li className="flex gap-2">
            <span className="text-black font-semibold shrink-0">4.</span>
            <span><strong>Use standard headings:</strong> Stick to standard titles like "Work Experience" or "Professional Experience", "Skills", and "Education" so scanning software identifies sections instantly.</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
