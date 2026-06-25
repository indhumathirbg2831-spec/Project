import React from 'react';
import { Eye, ArrowRight, CheckCircle2, MessageSquare, ListFilter, Sliders } from 'lucide-react';
import { ResumeAnalysisResult, GrammarIssue } from '../types';
import { motion } from 'motion/react';

interface GrammarViewProps {
  data: ResumeAnalysisResult;
}

export default function GrammarView({ data }: GrammarViewProps) {
  const { grammarIssues } = data;

  const getCategoryBadge = (category: GrammarIssue['category']) => {
    switch (category) {
      case 'spelling':
        return <span className="text-[10px] font-mono font-semibold uppercase tracking-wider bg-red-50 text-red-700 px-2.5 py-1 rounded-full border border-red-100">Spelling</span>;
      case 'grammar':
        return <span className="text-[10px] font-mono font-semibold uppercase tracking-wider bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full border border-amber-100">Grammar</span>;
      case 'style':
        return <span className="text-[10px] font-mono font-semibold uppercase tracking-wider bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full border border-blue-100">Writing Style</span>;
      case 'formatting':
        return <span className="text-[10px] font-mono font-semibold uppercase tracking-wider bg-neutral-100 text-neutral-700 px-2.5 py-1 rounded-full border border-neutral-200">Formatting</span>;
      default:
        return <span className="text-[10px] font-mono font-semibold uppercase tracking-wider bg-neutral-100 text-neutral-700 px-2.5 py-1 rounded-full border border-neutral-200">Other</span>;
    }
  };

  return (
    <div id="grammar-review-tab" className="space-y-6">
      {/* Overview stats or checklist header */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2">
            <MessageSquare size={18} className="text-neutral-500" />
            Grammar, Spelling & Styling Audit
          </h3>
          <p className="text-xs text-neutral-500 mt-1">
            We scanned your resume for readability, proper tense, punctuation, passive voice, and document structure.
          </p>
        </div>
        <div className="bg-neutral-50 px-4 py-2.5 rounded-xl border border-neutral-200 text-center sm:text-right">
          <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400">Total Findings</p>
          <p className="text-2xl font-extrabold text-neutral-900">{grammarIssues ? grammarIssues.length : 0}</p>
        </div>
      </div>

      {/* Main Issue List */}
      {grammarIssues && grammarIssues.length > 0 ? (
        <div className="space-y-4">
          {grammarIssues.map((issue, index) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              key={index}
              className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden"
            >
              {/* Header */}
              <div className="px-6 py-4 bg-neutral-50/50 border-b border-neutral-100 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-neutral-800"></span>
                  <h4 className="text-sm font-bold text-neutral-900">{issue.issue}</h4>
                </div>
                <div>{getCategoryBadge(issue.category)}</div>
              </div>

              {/* Content Body */}
              <div className="p-6 space-y-4">
                {/* Diff box */}
                {issue.originalText && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Original Text */}
                    <div className="p-3.5 rounded-xl bg-red-50/40 border border-red-100">
                      <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-red-500 mb-1">Current Text</p>
                      <p className="text-xs text-red-800 font-medium line-through decoration-red-400 decoration-2">
                        {issue.originalText}
                      </p>
                    </div>

                    {/* Replacement Text */}
                    <div className="p-3.5 rounded-xl bg-emerald-50/40 border border-emerald-100 flex items-start justify-between gap-2">
                      <div className="w-full">
                        <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-600 mb-1">Suggested Correction</p>
                        <p className="text-xs text-emerald-900 font-semibold">
                          {issue.replacementText || '(Remove or simplify text)'}
                        </p>
                      </div>
                      <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-5" />
                    </div>
                  </div>
                )}

                {/* Explanation */}
                <div className="text-xs text-neutral-600 leading-relaxed bg-neutral-50 p-4 rounded-xl border border-neutral-150">
                  <span className="font-bold text-neutral-800 block mb-0.5">Recruiter Correction Insight:</span>
                  {issue.explanation}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-12 text-center text-neutral-400">
          <CheckCircle2 className="mx-auto text-emerald-500 mb-3" size={32} />
          <h4 className="text-base font-bold text-neutral-800">Perfect Writing and Layout!</h4>
          <p className="text-xs mt-1 max-w-md mx-auto">
            Our AI recruiter did not locate any critical grammatical, spelling, formatting, or stylistic concerns. Outstanding attention to detail.
          </p>
        </div>
      )}
    </div>
  );
}
