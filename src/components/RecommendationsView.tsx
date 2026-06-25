import React from 'react';
import { ArrowUpRight, AlertTriangle, Lightbulb, Zap, ArrowRight, ShieldCheck } from 'lucide-react';
import { ResumeAnalysisResult, Recommendation } from '../types';
import { motion } from 'motion/react';

interface RecommendationsViewProps {
  data: ResumeAnalysisResult;
}

export default function RecommendationsView({ data }: RecommendationsViewProps) {
  const { recommendations } = data;

  const getPriorityBadge = (priority: Recommendation['priority']) => {
    switch (priority) {
      case 'high':
        return <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-red-100 text-red-800 border border-red-200 px-2.5 py-1 rounded-md flex items-center gap-1"><AlertTriangle size={12} /> High Priority</span>;
      case 'medium':
        return <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-md flex items-center gap-1"><Zap size={12} /> Medium Priority</span>;
      case 'low':
        return <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-neutral-100 text-neutral-800 border border-neutral-200 px-2.5 py-1 rounded-md flex items-center gap-1"><Lightbulb size={12} /> Low Priority</span>;
      default:
        return <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-neutral-100 text-neutral-800 border border-neutral-200 px-2.5 py-1 rounded-md">General</span>;
    }
  };

  // Sort recommendations: high first, then medium, then low
  const sortedRecs = [...(recommendations || [])].sort((a, b) => {
    const priorities = { high: 0, medium: 1, low: 2 };
    return (priorities[a.priority] ?? 3) - (priorities[b.priority] ?? 3);
  });

  return (
    <div id="recommendations-tab" className="space-y-6">
      {/* Intro block */}
      <div className="bg-black text-white rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h3 className="text-lg font-bold">Actionable Improvement Plan</h3>
          <p className="text-xs text-neutral-300 leading-relaxed max-w-xl">
            Implement the recommendations listed below starting from the highest priority. Making these changes can lift your ATS compatibility score by up to 25%.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-neutral-800 px-4 py-3 rounded-xl border border-neutral-700/60 font-mono shrink-0">
          <ShieldCheck size={18} className="text-emerald-400" />
          <span className="text-xs font-semibold">Ready for Recruiter Submission</span>
        </div>
      </div>

      {sortedRecs && sortedRecs.length > 0 ? (
        <div className="space-y-5">
          {sortedRecs.map((rec, index) => {
            const isHigh = rec.priority === 'high';
            const isMed = rec.priority === 'medium';
            const borderClass = isHigh
              ? 'border-l-4 border-l-red-500 border-neutral-200'
              : isMed
              ? 'border-l-4 border-l-amber-400 border-neutral-200'
              : 'border-l-4 border-l-neutral-400 border-neutral-200';

            return (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                key={index}
                className={`bg-white rounded-2xl border ${borderClass} shadow-sm overflow-hidden`}
              >
                {/* Header */}
                <div className="px-6 py-4 bg-neutral-50/50 border-b border-neutral-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider font-mono">
                      Section: {rec.section || 'General'}
                    </span>
                  </div>
                  <div>{getPriorityBadge(rec.priority)}</div>
                </div>

                {/* Body Content */}
                <div className="p-6 space-y-4">
                  {/* Issue */}
                  <div className="space-y-1">
                    <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400">The Problem</p>
                    <p className="text-sm font-bold text-neutral-900 leading-snug">{rec.issue}</p>
                  </div>

                  {/* Recommendation action */}
                  <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-150 space-y-2">
                    <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500">How to Fix</p>
                    <div className="flex items-start gap-2 text-sm text-neutral-700 leading-relaxed">
                      <ArrowRight size={14} className="text-neutral-400 shrink-0 mt-1" />
                      <p>{rec.recommendation}</p>
                    </div>
                  </div>

                  {/* Impact */}
                  {rec.impact && (
                    <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50/50 border border-emerald-100 px-3 py-2 rounded-xl">
                      <ArrowUpRight size={14} className="text-emerald-500 shrink-0" />
                      <span><strong>Impact:</strong> {rec.impact}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center text-neutral-400">
          <p className="text-sm">No recommendations generated. Your resume appears fully optimized!</p>
        </div>
      )}
    </div>
  );
}
