import express from 'express';
import path from 'path';
import multer from 'multer';
import * as pdf from 'pdf-parse';
import mammoth from 'mammoth';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

// Setup Multer (In-memory file storage, limit to 10MB)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

app.use(express.json({ limit: '10mb' }));

// Lazy initializer for Google Gen AI to prevent startup crashes if key is missing
let aiClient: GoogleGenAI | null = null;
function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error('GEMINI_API_KEY environment variable is missing in secrets or .env.');
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Define Schema for Resume Analysis Response
const analysisResponseSchema = {
  type: Type.OBJECT,
  properties: {
    candidateInfo: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING },
        email: { type: Type.STRING },
        phone: { type: Type.STRING },
        linkedin: { type: Type.STRING },
        website: { type: Type.STRING },
        summary: { type: Type.STRING },
      },
      required: ['name', 'email', 'phone', 'linkedin', 'website', 'summary'],
    },
    skills: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          category: { type: Type.STRING },
        },
        required: ['name', 'category'],
      },
    },
    education: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          degree: { type: Type.STRING },
          fieldOfStudy: { type: Type.STRING },
          institution: { type: Type.STRING },
          duration: { type: Type.STRING },
          location: { type: Type.STRING },
        },
        required: ['degree', 'fieldOfStudy', 'institution', 'duration', 'location'],
      },
    },
    experience: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          company: { type: Type.STRING },
          duration: { type: Type.STRING },
          location: { type: Type.STRING },
          achievements: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
        },
        required: ['title', 'company', 'duration', 'location', 'achievements'],
      },
    },
    projects: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          technologies: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          description: { type: Type.STRING },
        },
        required: ['name', 'technologies', 'description'],
      },
    },
    grammarIssues: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          issue: { type: Type.STRING },
          category: { type: Type.STRING },
          originalText: { type: Type.STRING },
          replacementText: { type: Type.STRING },
          explanation: { type: Type.STRING },
        },
        required: ['issue', 'category', 'originalText', 'replacementText', 'explanation'],
      },
    },
    recommendations: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          section: { type: Type.STRING },
          priority: { type: Type.STRING },
          issue: { type: Type.STRING },
          recommendation: { type: Type.STRING },
          impact: { type: Type.STRING },
        },
        required: ['section', 'priority', 'issue', 'recommendation', 'impact'],
      },
    },
    atsEvaluation: {
      type: Type.OBJECT,
      properties: {
        score: { type: Type.INTEGER },
        targetRole: { type: Type.STRING },
        strengths: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        weaknesses: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        suggestedKeywords: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        missingSkills: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        summary: { type: Type.STRING },
      },
      required: ['score', 'targetRole', 'strengths', 'weaknesses', 'suggestedKeywords', 'missingSkills', 'summary'],
    },
  },
  required: [
    'candidateInfo',
    'skills',
    'education',
    'experience',
    'projects',
    'grammarIssues',
    'recommendations',
    'atsEvaluation',
  ],
};

// API Endpoint for Resume Analysis
app.post('/api/analyze', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Please upload a resume file (PDF, DOCX, or TXT).' });
    }

    const targetRole = (req.body.targetRole || 'Software Engineer').trim();
    const originalName = req.file.originalname.toLowerCase();
    const mimeType = req.file.mimetype;

    let extractedText = '';

    // Step 1: Text extraction based on file type
    if (originalName.endsWith('.pdf') || mimeType === 'application/pdf') {
      try {
        const parsePdf = ((pdf as any).default || pdf) as any;
        const pdfData = await parsePdf(req.file.buffer);
        extractedText = pdfData.text;
      } catch (err: any) {
        console.error('PDF parsing error:', err);
        return res.status(400).json({ error: `Failed to extract text from PDF: ${err.message}` });
      }
    } else if (
      originalName.endsWith('.docx') ||
      mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      try {
        const docResult = await mammoth.extractRawText({ buffer: req.file.buffer });
        extractedText = docResult.value;
      } catch (err: any) {
        console.error('DOCX parsing error:', err);
        return res.status(400).json({ error: `Failed to extract text from Word document: ${err.message}` });
      }
    } else if (originalName.endsWith('.txt') || mimeType === 'text/plain') {
      extractedText = req.file.buffer.toString('utf-8');
    } else {
      return res.status(400).json({
        error: 'Unsupported file type. Please upload a PDF, DOCX, or standard TXT file.',
      });
    }

    // Sanity check for extracted text length
    if (!extractedText || extractedText.trim().length < 50) {
      return res.status(400).json({
        error:
          'Could not extract sufficient text from the resume. Please make sure the file is not empty or scanned/image-only without text.',
      });
    }

    // Step 2: Query Gemini AI for structured resume analysis
    let ai;
    try {
      ai = getAiClient();
    } catch (e: any) {
      return res.status(500).json({
        error: `AI configuration error: ${e.message}. Please configure GEMINI_API_KEY in Settings > Secrets.`,
      });
    }

    const systemInstruction = `You are an elite HR Recruiter, Resume Consultant, and Applicant Tracking System (ATS) optimization expert.
Your job is to thoroughly analyze the provided resume text against the user's target job role ("${targetRole}").

Analyze the following areas carefully:
1. Candidate Information (name, contact, linkedin, portfolio links).
2. Skills: Group by categories.
3. Experience: Extract and assess career relevance and achievements.
4. Projects: Evaluate tools, tech stack, and clarity.
5. Education: Extract degrees, fields, institutions, and years.
6. ATS Score: Calculate an objective and strict ATS score out of 100 based on the target job role. If the target job role is very different or the resume is poor, grade accordingly (be honest, don't just give 90+).
7. Missing Skills: List essential skills required for the target job role ("${targetRole}") that are absent or poorly represented in the resume.
8. Grammar & Formatting: Locate grammar, spelling, styling (e.g., weird margins, passive voice), and format concerns.
9. Recommendations: Detail high, medium, and low priority improvement actions.

IMPORTANT: Respond strictly with valid JSON conforming to the requested schema. Do not add markdown blocks outside the JSON itself. Ensure that the returned fields are highly constructive, precise, and completely derived from the provided resume.`;

    const prompt = `Target Job Role: ${targetRole}

Resume Plain Text:
---------------------------------------------
${extractedText}
---------------------------------------------`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: analysisResponseSchema,
        temperature: 0.2, // Low temperature for high accuracy and structure conformity
      },
    });

    const resultText = response.text;
    if (!resultText) {
      return res.status(500).json({ error: 'Received an empty analysis response from the AI model.' });
    }

    const analysisData = JSON.parse(resultText);
    analysisData.rawText = extractedText; // Optionally return the extracted text to display or reference

    return res.json(analysisData);
  } catch (error: any) {
    console.error('Error during analysis:', error);
    return res.status(500).json({
      error: `An error occurred during resume analysis: ${error.message || error}`,
    });
  }
});

// Setup Vite Dev Server / Static Asset Handler
async function setupServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AI Resume Analyzer Server successfully launched on http://localhost:${PORT}`);
  });
}

setupServer().catch((err) => {
  console.error('Failed to start full-stack server:', err);
});
