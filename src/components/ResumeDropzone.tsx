import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, Briefcase, HelpCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface ResumeDropzoneProps {
  onAnalyze: (file: File, targetRole: string) => void;
  isLoading: boolean;
  error: string | null;
}

export default function ResumeDropzone({ onAnalyze, isLoading, error }: ResumeDropzoneProps) {
  const [file, setFile] = useState<File | null>(null);
  const [targetRole, setTargetRole] = useState('Software Engineer');
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      validateAndSetFile(droppedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    const extension = selectedFile.name.split('.').pop()?.toLowerCase();
    const validExtensions = ['pdf', 'docx', 'txt'];
    
    if (extension && validExtensions.includes(extension)) {
      setFile(selectedFile);
    } else {
      alert('Unsupported file format. Please upload a PDF, DOCX, or TXT file.');
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (file) {
      onAnalyze(file, targetRole);
    }
  };

  return (
    <div id="dropzone-container" className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 md:p-8 max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Target Job Role Input */}
        <div>
          <label htmlFor="target-role" className="block text-sm font-medium text-neutral-700 mb-2 flex items-center gap-1.5">
            <Briefcase size={16} className="text-neutral-500" />
            Target Job Role
          </label>
          <div className="relative">
            <input
              id="target-role"
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g., Senior Full Stack Developer, Product Manager"
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all pr-10"
              required
            />
            <span className="absolute right-3 top-3.5 text-xs text-neutral-400 font-mono">Role</span>
          </div>
          <p className="mt-1.5 text-xs text-neutral-500">
            Gemini uses this role to calculate your custom ATS score and identify role-specific missing skills.
          </p>
        </div>

        {/* File Dropzone */}
        <div
          id="resume-drop-area"
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={triggerFileSelect}
          className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[220px] ${
            isDragActive
              ? 'border-black bg-neutral-50'
              : file
              ? 'border-neutral-300 bg-neutral-50/50 hover:bg-neutral-50'
              : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50/50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
            className="hidden"
          />

          {!file ? (
            <div className="space-y-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600">
                <Upload size={22} />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-900">
                  Drag & drop your resume file here, or <span className="text-black font-semibold underline decoration-solid">browse</span>
                </p>
                <p className="text-xs text-neutral-500 mt-1">
                  Supports PDF, Word (DOCX), or plain TXT (Max 10MB)
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                <CheckCircle2 size={22} />
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-900 truncate max-w-md mx-auto">
                  {file.name}
                </p>
                <p className="text-xs text-neutral-500 mt-0.5">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB • Ready to analyze
                </p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                }}
                className="text-xs text-red-600 hover:text-red-700 hover:underline font-medium"
              >
                Remove file
              </button>
            </div>
          )}
        </div>

        {/* Error message if present */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-red-50 rounded-xl border border-red-100 flex items-start gap-3 text-red-700 text-sm"
          >
            <AlertCircle size={18} className="shrink-0 mt-0.5 text-red-500" />
            <div>
              <p className="font-semibold">Analysis Failed</p>
              <p className="text-xs mt-0.5 text-red-600 leading-relaxed">{error}</p>
            </div>
          </motion.div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!file || isLoading}
          className={`w-full py-3.5 px-4 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm ${
            !file || isLoading
              ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed shadow-none'
              : 'bg-black text-white hover:bg-neutral-800 hover:scale-[1.01] active:scale-[0.99]'
          }`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Analyzing Resume with Gemini...</span>
            </>
          ) : (
            <>
              <FileText size={18} />
              <span>Analyze Resume</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
