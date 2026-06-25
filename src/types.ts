export interface CandidateInfo {
  name: string;
  email: string;
  phone: string;
  linkedin: string;
  website: string;
  summary: string;
}

export interface Skill {
  name: string;
  category: string; // e.g., Technical, Soft Skills, Tools
}

export interface Education {
  degree: string;
  fieldOfStudy: string;
  institution: string;
  duration: string;
  location: string;
}

export interface Experience {
  title: string;
  company: string;
  duration: string;
  location: string;
  achievements: string[];
}

export interface Project {
  name: string;
  technologies: string[];
  description: string;
}

export interface GrammarIssue {
  issue: string;
  category: 'grammar' | 'formatting' | 'spelling' | 'style';
  originalText: string;
  replacementText: string;
  explanation: string;
}

export interface Recommendation {
  section: string; // e.g., Skills, Experience, Summary, Projects
  priority: 'high' | 'medium' | 'low';
  issue: string;
  recommendation: string;
  impact: string;
}

export interface AtsEvaluation {
  score: number; // 0 to 100
  targetRole: string;
  strengths: string[];
  weaknesses: string[];
  suggestedKeywords: string[]; // Keywords that should be added
  missingSkills: string[];     // Specific missing skills based on target role
  summary: string;
}

export interface ResumeAnalysisResult {
  candidateInfo: CandidateInfo;
  skills: Skill[];
  education: Education[];
  experience: Experience[];
  projects: Project[];
  grammarIssues: GrammarIssue[];
  recommendations: Recommendation[];
  atsEvaluation: AtsEvaluation;
  rawText?: string;
}
