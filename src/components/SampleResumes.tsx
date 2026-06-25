import React from 'react';
import { Sparkles, FileText } from 'lucide-react';

export interface SampleResume {
  name: string;
  role: string;
  targetRole: string;
  description: string;
  content: string;
}

export const SAMPLE_RESUMES: SampleResume[] = [
  {
    name: "Alex Rivera",
    role: "Junior Web Developer",
    targetRole: "Full Stack Software Engineer",
    description: "Good frontend basics, but lacks database, system architecture, testing, and cloud knowledge.",
    content: `Alex Rivera
Junior Web Developer
alexrivera@email.com | (555) 123-4567 | San Francisco, CA
github.com/alexrivera | linkedin.com/in/alex-rivera-dev

PROFESSIONAL SUMMARY
Passionate and motivated Junior Web Developer with 1 year of experience building clean, responsive user interfaces. Eager to expand my technical skill set and transition into a Full Stack Software Engineer role. Committed to writing clean code and collaborating with team members to ship high-quality features.

TECHNICAL SKILLS
- Languages: HTML5, CSS3, JavaScript (ES6+), basic Python
- Libraries & Frameworks: React, Bootstrap, Tailwind CSS, jQuery
- Developer Tools: Git, GitHub, VS Code, npm

PROFESSIONAL EXPERIENCE

Junior Frontend Developer | TechStart Inc. | June 2025 - Present
- Created responsive landing pages and user interfaces for corporate clients using React.js and Tailwind CSS.
- Collaborated with UX/UI designers to convert Figma prototypes into pixel-perfect web pages.
- Participated in weekly sprint planning and daily standups.
- Solved bugs in existing frontend components, resulting in a 10% increase in website usability.
- I was responsible for writing some documentation for our web components.

Web Development Intern | CodeCamp Studios | Jan 2025 - May 2025
- Assisted the lead developer in maintaining and updating company websites using HTML, CSS, and jQuery.
- Fixed layout issues and optimized website images for faster page loading speeds.
- Tested website across various web browsers (Chrome, Safari, Firefox) to ensure layout compatibility.

EDUCATION

Bachelor of Science in Computer Science
State University, CA | Graduated Dec 2024

PROJECTS

Personal Portfolio Website
- Designed and developed a personal portfolio website to display frontend developer projects.
- Built using React.js, featuring CSS Grid, Flexbox, and animated transitions.

Simple Recipe Finder App
- Created a web app that allows users to search for food recipes based on ingredients.
- Coded in pure JavaScript, fetching recipe data from a public REST API.
`
  },
  {
    name: "Sarah Jenkins",
    role: "Senior Product Manager",
    targetRole: "Director of Product Management",
    description: "Experienced PM with strong leadership metrics, but has styling layout clutter and passive writing.",
    content: `Sarah Jenkins
Senior Product Manager
sarah.jenkins@email.com | (555) 987-6543 | New York, NY
linkedin.com/in/sarah-jenkins-pm | sarahjenkins.co

PROFESSIONAL SUMMARY
Highly accomplished Senior Product Manager with over 8 years of experience leading cross-functional teams to build and launch award-winning software products. Seeking to step up into a Director of Product Management position. Proven track record of defining product strategy, increasing customer engagement, and boosting revenue.

CORE SKILLS
- Product Strategy, Roadmap Planning, Agile/Scrum Methodology, User Research, Market Analysis, Product Analytics, Stakeholder Communication, A/B Testing, Team Leadership, Budget Management.

WORK EXPERIENCE

Senior Product Manager | EnterpriseCloud Corp | March 2022 - Present
- Product roadmap for our core B2B SaaS dashboard was managed by me.
- Led a cross-functional team of 18 software engineers, designers, and marketers to launch a new security feature, which increased platform retention by 15%.
- Analyzed user feedback and behavioral data using Amplitude to define our quarterly product goals.
- Conducted over 50 customer interviews to better understand buyer personas and pain points.
- Mentored 3 junior product managers and helped them develop their career growth plans.
- Presented product updates to executive leadership on a monthly basis.

Product Manager | RetailFlow Inc. | Aug 2018 - Feb 2022
- Managed the checkout optimization project, reducing cart abandonment by 8%.
- Wrote detailed PRDs (Product Requirement Documents) and user stories for the development team.
- Coordinated the release of 4 major updates for our mobile e-commerce application.
- Collaborated with sales and customer success to align the product pipeline with enterprise client needs.

EDUCATION

Master of Business Administration (MBA)
Columbia Business School | 2018

Bachelor of Science in Business Administration
Boston University | 2014

CERTIFICATIONS
- Certified Scrum Product Owner (CSPO)
- Pragmatic Institute Certified (Level IV)
`
  },
  {
    name: "Marcus Chen",
    role: "Data Scientist",
    targetRole: "Senior Lead Data Scientist",
    description: "Strong theoretical modeling foundation, but lacks business impact metrics and has dense blocks.",
    content: `Marcus Chen
Data Scientist
marcus.chen@email.com | (555) 333-4444 | Seattle, WA
github.com/marcuschen-ds | linkedin.com/in/marcus-chen-data

PROFESSIONAL SUMMARY
Data Scientist with 3+ years of professional experience developing complex machine learning models and statistical systems. Specializing in predictive modeling, natural language processing, and advanced analytics. Proficient in Python, SQL, and AWS. Passionate about uncovering insights and solving data-driven problems.

TECHNICAL SKILLS
- Programming: Python, R, SQL, C++
- ML Libraries: TensorFlow, PyTorch, Scikit-Learn, Pandas, NumPy, XGBoost
- Visualization: Tableau, Seaborn, Matplotlib
- Data Systems: PostgreSQL, Spark, AWS (S3, EC2, SageMaker), Git

PROFESSIONAL EXPERIENCE

Data Scientist | OmniData Analytics | Jan 2023 - Present
- Developed an automated anomaly detection model for transaction data using isolation forests and XGBoost.
- Queried large relational databases using SQL to extract and clean training data.
- Built a machine learning pipeline that preprocesses unstructured log data on AWS S3.
- Conducted hypothesis testing and statistical analysis on user onboarding experiments.
- Created interactive dashboards in Tableau to share modeling outputs with business stakeholders.
- Kept model code organized using Git and participated in codebase reviews.

Machine Learning Engineer Intern | HealthTech Solutions | June 2022 - Dec 2022
- Assisted in training neural network models for medical image classification using PyTorch.
- Cleaned and annotated large healthcare datasets for supervised learning tasks.
- Researched state-of-the-art NLP models to analyze doctor transcripts.

EDUCATION

Master of Science in Data Science
University of Washington | 2022

Bachelor of Science in Statistics
University of California, Berkeley | 2020

PUBLICATIONS
- "Anomaly Detection in Semi-Supervised Financial Logs", Journal of Applied Analytics, 2022.
`
  }
];

interface SampleResumesProps {
  onSelectSample: (sample: SampleResume) => void;
  disabled: boolean;
}

export default function SampleResumes({ onSelectSample, disabled }: SampleResumesProps) {
  return (
    <div id="sample-resumes-container" className="space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles size={16} className="text-neutral-500" />
        <h3 className="text-sm font-semibold text-neutral-800">Quick Demo Templates</h3>
      </div>
      <p className="text-xs text-neutral-500 leading-relaxed">
        Don't have a resume PDF or DOCX file ready? Choose one of our target-engineered candidate profiles to see the real-time parsing, grammar checking, and ATS scorecard in action:
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {SAMPLE_RESUMES.map((sample, idx) => (
          <button
            key={idx}
            type="button"
            disabled={disabled}
            onClick={() => onSelectSample(sample)}
            className={`text-left p-4 rounded-xl border border-neutral-200 bg-white hover:border-black hover:shadow-sm transition-all flex flex-col justify-between group ${
              disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-1 mb-1.5">
                <span className="text-xs font-bold text-neutral-900 group-hover:text-black">
                  {sample.name}
                </span>
                <span className="text-[9px] font-mono font-medium tracking-wide uppercase px-2 py-0.5 rounded bg-neutral-100 text-neutral-600 border border-neutral-200/50">
                  {sample.role.split(' ')[0]}
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 font-semibold mb-1">
                Targeting: {sample.targetRole}
              </p>
              <p className="text-[11px] text-neutral-600 leading-normal mb-4">
                {sample.description}
              </p>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-bold text-black group-hover:underline">
              <FileText size={12} />
              <span>Use This Template</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
