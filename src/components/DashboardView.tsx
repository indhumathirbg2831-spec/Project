import React from 'react';
import { CheckCircle2, XCircle, Mail, Phone, Linkedin, Globe, FileText, MapPin } from 'lucide-react';
import MetricCircle from './MetricCircle';
import { ResumeAnalysisResult } from '../types';
import { motion } from 'motion/react';

interface DashboardViewProps {
  data: ResumeAnalysisResult;
}

export default function DashboardView({ data }: DashboardViewProps) {
  const { atsEvaluation, candidateInfo } = data;

  return (
    <div id="dashboard-tab" className="space-y-6">
      {/* Overview Block */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ATS Score Card */}
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 flex flex-col items-center justify-center text-center">
          <h3 className="text-sm font-semibold text-neutral-500 tracking-wider uppercase mb-4">ATS Compatibility</h3>
          <MetricCircle score={atsEvaluation.score} />
          <p className="text-xs text-neutral-400 mt-4 leading-relaxed max-w-xs">
            Determined by role alignment, keyword density, technical skill presence, and structural formatting.
          </p>
        </div>

        {/* Candidate & Contact Info */}
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-100 pb-4 mb-4">
              <div>
                <h2 className="text-2xl font-extrabold text-neutral-900 tracking-tight">
                  {candidateInfo.name || 'Extracted Profile'}
                </h2>
                <p className="text-sm text-neutral-500 font-medium flex items-center gap-1.5 mt-1">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  Analyzed for: <strong className="text-neutral-900">{atsEvaluation.targetRole}</strong>
                </p>
              </div>
            </div>

            <p className="text-sm text-neutral-600 leading-relaxed italic mb-4">
              "{candidateInfo.summary || 'No professional summary extracted.'}"
            </p>
          </div>

          {/* Contact Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-neutral-600 font-mono pt-4 border-t border-neutral-100">
            {candidateInfo.email && (
              <div className="flex items-center gap-2 truncate">
                <Mail size={14} className="text-neutral-400 shrink-0" />
                <span>{candidateInfo.email}</span>
              </div>
            )}
            {candidateInfo.phone && (
              <div className="flex items-center gap-2 truncate">
                <Phone size={14} className="text-neutral-400 shrink-0" />
                <span>{candidateInfo.phone}</span>
              </div>
            )}
            {candidateInfo.linkedin && (
              <div className="flex items-center gap-2 truncate">
                <Linkedin size={14} className="text-neutral-400 shrink-0" />
                <a
                  href={candidateInfo.linkedin.startsWith('http') ? candidateInfo.linkedin : `https://${candidateInfo.linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline text-black font-semibold"
                >
                  {candidateInfo.linkedin.replace(/^(https?:\/\/)?(www\.)?/, '')}
                </a>
              </div>
            )}
            {candidateInfo.website && (
              <div className="flex items-center gap-2 truncate">
                <Globe size={14} className="text-neutral-400 shrink-0" />
                <a
                  href={candidateInfo.website.startsWith('http') ? candidateInfo.website : `https://${candidateInfo.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline text-black font-semibold"
                >
                  {candidateInfo.website.replace(/^(https?:\/\/)?(www\.)?/, '')}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recruiter Evaluation Summary */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6">
        <h3 className="text-lg font-bold text-neutral-900 mb-3 flex items-center gap-2">
          <FileText size={18} className="text-neutral-500" />
          Executive Recruiter Analysis
        </h3>
        <p className="text-sm text-neutral-600 leading-relaxed">
          {atsEvaluation.summary || 'No summary of evaluation provided.'}
        </p>
      </div>

      {/* Strengths and Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6">
          <h3 className="text-sm font-semibold text-emerald-700 tracking-wider uppercase mb-4 flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-500" />
            Key Strengths Identified
          </h3>
          {atsEvaluation.strengths && atsEvaluation.strengths.length > 0 ? (
            <ul className="space-y-3">
              {atsEvaluation.strengths.map((strength, index) => (
                <motion.li
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  key={index}
                  className="flex items-start gap-2.5 text-sm text-neutral-700"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-2"></span>
                  <span className="leading-relaxed">{strength}</span>
                </motion.li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-neutral-400 italic">No clear strengths could be extracted.</p>
          )}
        </div>

        {/* Weaknesses */}
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6">
          <h3 className="text-sm font-semibold text-red-700 tracking-wider uppercase mb-4 flex items-center gap-2">
            <XCircle size={16} className="text-red-500" />
            Areas for Optimization
          </h3>
          {atsEvaluation.weaknesses && atsEvaluation.weaknesses.length > 0 ? (
            <ul className="space-y-3">
              {atsEvaluation.weaknesses.map((weakness, index) => (
                <motion.li
                  initial={{ opacity: 0, x: 5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  key={index}
                  className="flex items-start gap-2.5 text-sm text-neutral-700"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0 mt-2"></span>
                  <span className="leading-relaxed">{weakness}</span>
                </motion.li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-neutral-400 italic">No structural or content weaknesses identified.</p>
          )}
        </div>
      </div>
    </div>
  );
}
