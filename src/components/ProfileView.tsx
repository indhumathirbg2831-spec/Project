import React from 'react';
import { Briefcase, GraduationCap, Code2, Settings, ListFilter } from 'lucide-react';
import { ResumeAnalysisResult } from '../types';
import { motion } from 'motion/react';

interface ProfileViewProps {
  data: ResumeAnalysisResult;
}

export default function ProfileView({ data }: ProfileViewProps) {
  const { skills, education, experience, projects } = data;

  // Group skills by category for better modular structure
  const skillsByCategory = skills.reduce((acc, skill) => {
    const category = skill.category || 'General/Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill.name);
    return acc;
  }, {} as Record<string, string[]>);

  return (
    <div id="parsed-profile-tab" className="space-y-8">
      {/* Grouped Skills Section */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6">
        <h3 className="text-base font-bold text-neutral-900 mb-4 flex items-center gap-2">
          <Settings size={18} className="text-neutral-500" />
          Extracted & Categorized Skills
        </h3>

        {Object.keys(skillsByCategory).length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(skillsByCategory).map(([category, skillNames], idx) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={category}
                className="p-4 rounded-xl border border-neutral-150 bg-neutral-50/50 space-y-3"
              >
                <div className="flex items-center gap-1.5 border-b border-neutral-200/60 pb-2">
                  <ListFilter size={14} className="text-neutral-500" />
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">{category}</h4>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {skillNames.map((name) => (
                    <span
                      key={name}
                      className="px-2.5 py-1 rounded-lg bg-white border border-neutral-200 text-xs text-neutral-800 font-medium"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-neutral-400 italic">No skills could be extracted.</p>
        )}
      </div>

      {/* Work Experience Section */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6">
        <h3 className="text-base font-bold text-neutral-900 mb-6 flex items-center gap-2">
          <Briefcase size={18} className="text-neutral-500" />
          Professional Work Experience
        </h3>

        {experience && experience.length > 0 ? (
          <div className="relative border-l border-neutral-200 pl-6 ml-3 space-y-8">
            {experience.map((exp, index) => (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                key={index}
                className="relative"
              >
                {/* Timeline node */}
                <span className="absolute -left-[31px] top-1.5 flex items-center justify-center w-4 h-4 rounded-full bg-neutral-900 border-2 border-white"></span>

                <div className="space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                    <div>
                      <h4 className="text-base font-bold text-neutral-900">{exp.title}</h4>
                      <p className="text-sm text-neutral-700 font-medium">{exp.company}</p>
                    </div>
                    <div className="text-xs text-neutral-500 font-mono text-left sm:text-right">
                      <p className="font-semibold">{exp.duration}</p>
                      <p>{exp.location}</p>
                    </div>
                  </div>

                  {exp.achievements && exp.achievements.length > 0 ? (
                    <ul className="list-disc pl-5 space-y-1.5 text-sm text-neutral-600 leading-relaxed pt-2">
                      {exp.achievements.map((achievement, actIdx) => (
                        <li key={actIdx}>{achievement}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-neutral-400 italic pt-1">No achievement bullet points extracted.</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-neutral-400 italic">No professional experience extracted.</p>
        )}
      </div>

      {/* Projects and Education Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Projects Column */}
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6">
          <h3 className="text-base font-bold text-neutral-900 mb-4 flex items-center gap-2">
            <Code2 size={18} className="text-neutral-500" />
            Key Projects
          </h3>

          {projects && projects.length > 0 ? (
            <div className="space-y-4">
              {projects.map((project, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  key={index}
                  className="p-4 rounded-xl border border-neutral-200 bg-white space-y-2.5"
                >
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="text-sm font-bold text-neutral-900">{project.name}</h4>
                  </div>
                  <p className="text-xs text-neutral-600 leading-relaxed">{project.description}</p>
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1.5">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 rounded text-[10px] bg-neutral-100 border border-neutral-200/60 font-medium text-neutral-700"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-neutral-400 italic">No projects extracted.</p>
          )}
        </div>

        {/* Education Column */}
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6">
          <h3 className="text-base font-bold text-neutral-900 mb-4 flex items-center gap-2">
            <GraduationCap size={18} className="text-neutral-500" />
            Education History
          </h3>

          {education && education.length > 0 ? (
            <div className="space-y-4">
              {education.map((edu, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  key={index}
                  className="p-4 rounded-xl border border-neutral-200 bg-white space-y-1"
                >
                  <h4 className="text-sm font-bold text-neutral-900">
                    {edu.degree} in {edu.fieldOfStudy}
                  </h4>
                  <p className="text-xs text-neutral-700 font-semibold">{edu.institution}</p>
                  <div className="flex items-center justify-between pt-2 text-[10px] text-neutral-500 font-mono">
                    <span>{edu.location}</span>
                    <span>{edu.duration}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-neutral-400 italic">No education history extracted.</p>
          )}
        </div>
      </div>
    </div>
  );
}
