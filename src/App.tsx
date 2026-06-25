import React, { useState, useEffect } from 'react';
import { FileText, RefreshCw, ShieldCheck, Sparkles, Copy, Check, FileCode, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ResumeDropzone from './components/ResumeDropzone';
import SampleResumes, { SampleResume } from './components/SampleResumes';
import DashboardView from './components/DashboardView';
import AtsView from './components/AtsView';
import ProfileView from './components/ProfileView';
import GrammarView from './components/GrammarView';
import RecommendationsView from './components/RecommendationsView';
import { ResumeAnalysisResult } from './types';

type TabType = 'dashboard' | 'ats' | 'profile' | 'grammar' | 'recommendations' | 'text';

const LOADING_STEPS = [
  "Uploading and scanning document file format...",
  "Running high-fidelity plain text OCR and extraction...",
  "Parsing candidate metadata, education, and career history...",
  "Matching skills with industry-standard ontologies...",
  "Evaluating grammar, active tenses, and sentence structure...",
  "Calculating role-specific ATS scoring metrics...",
  "Compiling actionable recruiter improvement checklist...",
  "Generating final report dashboard..."
];

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ResumeAnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [analyzedFileDetails, setAnalyzedFileDetails] = useState<{ name: string; size: string } | null>(null);
  const [loadingStepIdx, setLoadingStepIdx] = useState(0);
  const [copiedText, setCopiedText] = useState(false);

  // Rotate loading steps to keep the user engaged and illustrate depth
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingStepIdx((prev) => (prev + 1) % LOADING_STEPS.length);
      }, 2500);
    } else {
      setLoadingStepIdx(0);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  // Main analyze handler
  const handleAnalyze = async (file: File, targetRole: string) => {
    setIsLoading(true);
    setError(null);
    setAnalyzedFileDetails({
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`
    });

    const formData = new FormData();
    formData.append('resume', file);
    formData.append('targetRole', targetRole);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        throw new Error(errBody.error || `Server returned error status code: ${response.status}`);
      }

      const data: ResumeAnalysisResult = await response.json();
      setResult(data);
      setActiveTab('dashboard');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred while analyzing your resume.');
    } finally {
      setIsLoading(false);
    }
  };

  // Pre-made sample resume selection
  const handleSelectSample = (sample: SampleResume) => {
    // Create a virtual File from the string content
    const virtualFile = new File([sample.content], `${sample.name.toLowerCase().replace(/\s+/g, '_')}_resume.txt`, {
      type: 'text/plain',
    });
    handleAnalyze(virtualFile, sample.targetRole);
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
    setAnalyzedFileDetails(null);
  };

  const copyRawText = () => {
    if (result?.rawText) {
      navigator.clipboard.writeText(result.rawText);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col font-sans selection:bg-neutral-200">
      {/* Header Banner */}
      <header id="app-header" className="bg-white border-b border-neutral-200 py-5 sticky top-0 z-40 backdrop-blur-md bg-white/90">
        <div className="max-w-6xl mx-auto px-4 md:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center font-bold tracking-tight shadow-sm">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h1 className="text-lg font-extrabold text-neutral-900 tracking-tight leading-none">
                AI Resume Analyzer
              </h1>
              <p className="text-xs text-neutral-500 font-medium mt-1">
                Professional Recruit-Grade ATS Score & Grammar Audit
              </p>
            </div>
          </div>

          {result && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 hover:border-neutral-300 text-xs font-semibold transition-all cursor-pointer shadow-sm text-neutral-700"
            >
              <RefreshCw size={13} />
              <span>Scan New Resume</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 md:px-6 py-8">
        <AnimatePresence mode="wait">
          {/* UPLOAD & INITIAL STATE */}
          {!result && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-10"
            >
              {/* Marketing Title / Intro */}
              <div className="text-center max-w-2xl mx-auto space-y-3">
                <div className="inline-flex items-center gap-1.5 bg-neutral-100 text-neutral-800 px-3 py-1 rounded-full text-xs font-mono font-semibold uppercase tracking-wider border border-neutral-200/50">
                  <Sparkles size={12} className="text-neutral-500" /> Powered by Gemini 3.5 Flash
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-neutral-900">
                  Audit your resume for the ATS filter
                </h2>
                <p className="text-sm md:text-base text-neutral-500 leading-relaxed max-w-xl mx-auto">
                  Get immediate deep-dives into your skills, grammatical tenses, passive wording, and missing job keywords before you submit.
                </p>
              </div>

              {/* Upload Dropzone */}
              <ResumeDropzone onAnalyze={handleAnalyze} isLoading={isLoading} error={error} />

              {/* Sample Selector */}
              <div className="max-w-4xl mx-auto pt-4 border-t border-neutral-200/60">
                <SampleResumes onSelectSample={handleSelectSample} disabled={isLoading} />
              </div>
            </motion.div>
          )}

          {/* LOADING STATE */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="min-h-[450px] flex flex-col items-center justify-center text-center p-6 space-y-6"
            >
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-black flex items-center justify-center text-white shadow-md animate-pulse">
                  <FileText size={28} />
                </div>
                <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
                </span>
              </div>

              <div className="space-y-2 max-w-md">
                <h3 className="text-lg font-bold text-neutral-950">Analyzing Your Resume</h3>
                <div className="h-6 flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={loadingStepIdx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-sm text-neutral-600 font-medium font-mono"
                    >
                      {LOADING_STEPS[loadingStepIdx]}
                    </motion.p>
                  </AnimatePresence>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed pt-2">
                  We are querying high-fidelity parsing LLMs. This usually takes about 5 to 10 seconds.
                </p>
              </div>

              {/* Loading progress visualization */}
              <div className="w-64 h-1.5 bg-neutral-100 rounded-full overflow-hidden border border-neutral-200">
                <motion.div
                  className="h-full bg-black rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 15, ease: "linear" }}
                />
              </div>
            </motion.div>
          )}

          {/* RESULT STATE */}
          {result && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Stats overview banner */}
              <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleReset}
                      className="text-neutral-400 hover:text-black mr-1 p-1 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
                      title="Back to Upload"
                    >
                      <ArrowLeft size={16} />
                    </button>
                    <span className="text-xs font-bold font-mono tracking-wider text-neutral-400 uppercase">
                      Analysis Report
                    </span>
                  </div>
                  <h2 className="text-2xl font-black text-neutral-900 tracking-tight mt-1">
                    {result.candidateInfo.name || 'Parsed Profile'}
                  </h2>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Job Target: <strong className="text-neutral-700">{result.atsEvaluation.targetRole}</strong> • File: {analyzedFileDetails?.name || 'resume_extracted.txt'}
                  </p>
                </div>

                <div className="flex gap-4 sm:gap-6 items-center border-t md:border-t-0 md:border-l border-neutral-150 pt-4 md:pt-0 md:pl-6">
                  {/* Small ATS Score Pill */}
                  <div className="text-center">
                    <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400">ATS Match Score</p>
                    <p className={`text-3xl font-extrabold ${result.atsEvaluation.score >= 80 ? 'text-emerald-600' : result.atsEvaluation.score >= 60 ? 'text-amber-500' : 'text-red-500'}`}>
                      {result.atsEvaluation.score}<span className="text-xs font-semibold text-neutral-400">/100</span>
                    </p>
                  </div>

                  <div className="text-center border-l border-neutral-100 pl-4 sm:pl-6">
                    <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400">Grammar Issues</p>
                    <p className={`text-2xl font-extrabold ${result.grammarIssues && result.grammarIssues.length > 0 ? 'text-neutral-800' : 'text-emerald-600'}`}>
                      {result.grammarIssues ? result.grammarIssues.length : 0}
                    </p>
                  </div>
                </div>
              </div>

              {/* Horizonal Tab controls */}
              <div className="overflow-x-auto pb-1 flex border-b border-neutral-200">
                <div className="flex space-x-1 min-w-max">
                  {(
                    [
                      { id: 'dashboard', label: 'Match Dashboard' },
                      { id: 'ats', label: 'ATS & Keywords' },
                      { id: 'recommendations', label: 'Improvement Plan' },
                      { id: 'profile', label: 'Parsed Profile' },
                      { id: 'grammar', label: 'Grammar & Writing' },
                      { id: 'text', label: 'Raw Extracted Text' }
                    ] as const
                  ).map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          isActive
                            ? 'bg-black text-white shadow-sm'
                            : 'text-neutral-600 hover:text-black hover:bg-neutral-100'
                        }`}
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tab Content Display */}
              <div id="tab-content-frame" className="mt-4">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.15 }}
                  >
                    {activeTab === 'dashboard' && <DashboardView data={result} />}
                    {activeTab === 'ats' && <AtsView data={result} />}
                    {activeTab === 'profile' && <ProfileView data={result} />}
                    {activeTab === 'grammar' && <GrammarView data={result} />}
                    {activeTab === 'recommendations' && <RecommendationsView data={result} />}
                    {activeTab === 'text' && (
                      <div className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-4">
                        <div className="flex justify-between items-center border-b border-neutral-150 pb-3">
                          <div>
                            <h3 className="text-sm font-bold text-neutral-900">Extracted Plain Text</h3>
                            <p className="text-[11px] text-neutral-500">
                              This is the raw data extracted from your file before parsing.
                            </p>
                          </div>
                          <button
                            onClick={copyRawText}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-neutral-200 hover:border-neutral-300 bg-white text-xs font-semibold cursor-pointer text-neutral-700 transition-colors"
                          >
                            {copiedText ? (
                              <>
                                <Check size={14} className="text-emerald-500" />
                                <span className="text-emerald-600">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy size={14} />
                                <span>Copy Text</span>
                              </>
                            )}
                          </button>
                        </div>
                        <pre className="p-4 rounded-xl bg-neutral-50 border border-neutral-150 overflow-auto text-xs font-mono text-neutral-700 max-h-[500px] whitespace-pre-wrap leading-relaxed">
                          {result.rawText || 'No text extracted.'}
                        </pre>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-neutral-200 py-6 bg-white text-center text-xs text-neutral-400 font-medium">
        <div className="max-w-6xl mx-auto px-4">
          <p>© 2026 AI Resume Analyzer • Structured Recruiter Feedback Engine</p>
        </div>
      </footer>
    </div>
  );
}
