import React, { FC } from "react";
import { ResumeData, DesignTheme } from "../types";
import { Mail, Phone, MapPin, Globe, Github, Linkedin, Briefcase, GraduationCap, Code, FolderGit, Award, Languages } from "lucide-react";

interface ResumePreviewProps {
  data: ResumeData;
  theme: DesignTheme;
  accentColor: string; // Tailwind color class, e.g., 'blue', 'emerald', 'slate'
  fontSize?: number;
}

const ResumePreviewContent: FC<ResumePreviewProps> = ({ data, theme, accentColor, fontSize = 100 }) => {
  const { personalInfo, experiences, education, projects, skills, certifications, languages } = data;

  // Setup styling maps based on theme selection
  const fontClass = {
    modern: "font-sans text-slate-800 bg-white",
    "modern-short": "font-sans text-slate-800 bg-white",
    executive: "font-serif text-slate-900 bg-white",
    "formal-short": "font-sans text-slate-900 bg-white",
    creative: "font-sans text-neutral-800 bg-white",
    developer: "font-mono text-zinc-900 bg-zinc-50/50",
    "split-sidebar": "font-sans text-slate-800 bg-white"
  }[theme];

  // Colors mapping for themes
  const accentText = {
    blue: "text-blue-600",
    emerald: "text-emerald-600",
    violet: "text-violet-600",
    rose: "text-rose-600",
    amber: "text-amber-600",
    slate: "text-slate-800"
  }[accentColor] || "text-slate-900";

  const accentBorder = {
    blue: "border-blue-500",
    emerald: "border-emerald-500",
    violet: "border-violet-500",
    rose: "border-rose-500",
    amber: "border-amber-500",
    slate: "border-slate-800"
  }[accentColor] || "border-slate-800";

  const accentBg = {
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
    violet: "bg-violet-50 text-violet-700 border-violet-200",
    rose: "bg-rose-50 text-rose-700 border-rose-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    slate: "bg-slate-100 text-slate-800 border-slate-200"
  }[accentColor] || "bg-slate-50 text-slate-800";

  const bulletStyle = {
    modern: "list-disc list-inside space-y-1 text-slate-600 text-sm",
    "modern-short": "list-disc list-inside space-y-0.5 text-slate-600 text-xs leading-normal",
    executive: "list-disc list-inside space-y-1.5 text-slate-700 text-[13.5px] leading-relaxed",
    "formal-short": "list-disc list-inside space-y-0.5 text-slate-700 text-xs leading-normal",
    creative: "list-none space-y-1 text-neutral-600 text-sm",
    developer: "list-none space-y-1 text-zinc-700 text-xs text-[12px] leading-relaxed",
    "split-sidebar": "list-disc list-inside space-y-0.5 text-slate-600 text-[11.5px] leading-relaxed"
  }[theme];

  const sectionHeaderStyle = {
    modern: "text-[15px] font-semibold tracking-wider text-slate-900 uppercase border-b pb-1 mb-3 flex items-center gap-2",
    "modern-short": "text-[13px] font-bold tracking-wider text-slate-900 uppercase border-b pb-0.5 mb-2 flex items-center gap-1.5",
    executive: "text-[16px] font-bold tracking-wide text-slate-805 border-b-2 pb-0.5 mb-3.5 flex items-center gap-2 italic",
    "formal-short": "text-[13px] font-bold tracking-wider text-slate-900 uppercase border-b pb-0.5 mb-2 block",
    creative: "text-md font-bold tracking-tight text-neutral-900 mb-3 flex items-center gap-2",
    developer: "text-xs font-bold text-zinc-950 uppercase mb-3.5 flex items-center gap-2 p-1 bg-zinc-200 border-l-4",
    "split-sidebar": "text-[11.5px] font-bold tracking-[0.2em] text-slate-800 uppercase mb-3 block"
  }[theme];

  // Standard Link Formatter
  const renderLink = (url: string, icon: React.ReactNode) => {
    if (!url) return null;
    const cleanUrl = url.replace(/^(https?:\/\/)?(www\.)?/, "");
    return (
      <a 
        href={url.startsWith("http") ? url : `https://${url}`} 
        target="_blank" 
        referrerPolicy="no-referrer"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 hover:underline text-xs text-slate-500 print:text-slate-800 break-all"
      >
        {icon}
        <span className="break-all">{cleanUrl}</span>
      </a>
    );
  };

  return (
    <div
      id="resume-sheet"
      style={{ "--resume-font-scale": Math.min(120, Math.max(80, fontSize)) / 100 } as React.CSSProperties}
      className={`w-full mx-auto p-6 sm:p-8 md:p-10 shadow-lg border border-slate-150 rounded-md print:shadow-none print:border-none print:p-0 ${fontClass}`}
    >
      
      {/* ==================== THEME 1: MODERN ==================== */}
      {theme === "modern" && (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:justify-between items-start border-b border-slate-100 pb-5 gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{personalInfo.name || "Insert Name"}</h1>
              <p className={`text-lg font-medium ${accentText} tracking-tight mt-0.5`}>{personalInfo.title || "Professional Role"}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2 text-right md:-mt-1 whitespace-nowrap">
              {personalInfo.email && (
                <div className="flex items-center gap-1.5 text-xs text-slate-500 justify-start md:justify-end">
                  <Mail size={13} className={accentText} />
                  <a href={`mailto:${personalInfo.email}`} className="hover:underline">{personalInfo.email}</a>
                </div>
              )}
              {personalInfo.phone && (
                <div className="flex items-center gap-1.5 text-xs text-slate-500 justify-start md:justify-end">
                  <Phone size={13} className={accentText} />
                  <span>{personalInfo.phone}</span>
                </div>
              )}
              {personalInfo.location && (
                <div className="flex items-center gap-1.5 text-xs text-slate-500 justify-start md:justify-end">
                  <MapPin size={13} className={accentText} />
                  <span>{personalInfo.location}</span>
                </div>
              )}
              <div className="flex flex-wrap gap-x-3 gap-y-1 justify-start md:justify-end">
                {renderLink(personalInfo.website, <Globe size={13} className={accentText} />)}
                {renderLink(personalInfo.github, <Github size={13} className={accentText} />)}
                {renderLink(personalInfo.linkedin, <Linkedin size={13} className={accentText} />)}
              </div>
            </div>
          </div>

          {/* Summary */}
          {personalInfo.rawSummary && (
            <div className="text-sm text-slate-600 leading-relaxed text-justify">
              {personalInfo.rawSummary}
            </div>
          )}

          {/* Experience */}
          {experiences.length > 0 && (
            <div className="print:break-inside-avoid">
              <h2 className={`${sectionHeaderStyle} ${accentBorder}`}>
                <Briefcase size={16} /> Work Experience
              </h2>
              <div className="space-y-4">
                {experiences.map((exp) => (
                  <div key={exp.id} className="group relative print:break-inside-avoid">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-bold text-slate-900 text-sm">{exp.role} <span className="font-normal text-slate-400">@</span> <span className={`${accentText} font-semibold`}>{exp.company}</span></h3>
                      <span className="text-xs font-semibold text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-100 whitespace-nowrap">{exp.startDate} - {exp.current ? "Present" : exp.endDate}</span>
                    </div>
                    <div className="text-xs text-slate-400 italic mb-2">{exp.location}</div>
                    <ul className={bulletStyle}>
                      {exp.bullets.map((b, i) => b.trim() && <li key={i}>{b}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Grid Layout for Skills and Education */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-1">
            {/* Skills */}
            {skills.length > 0 && (
              <div className="md:col-span-7 print:break-inside-avoid">
                <h2 className={`${sectionHeaderStyle} ${accentBorder}`}>
                  <Code size={16} /> Skills & Proficiencies
                </h2>
                <div className="space-y-3">
                  {skills.map((grp) => (
                    <div key={grp.id} className="text-sm">
                      <span className="font-bold text-slate-800 block text-xs uppercase tracking-wider mb-1 text-slate-500">{grp.category || "Skill Category"}:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {grp.items.map((skill, k) => skill.trim() && (
                          <span key={k} className={`text-xs px-2.5 py-1 rounded border ${accentBg}`}>
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Support section (Education, Certifications, Languages) */}
            <div className="md:col-span-5 space-y-6 print:break-inside-avoid">
              {education.length > 0 && (
                <div>
                  <h2 className={`${sectionHeaderStyle} ${accentBorder}`}>
                    <GraduationCap size={16} /> Education
                  </h2>
                  <div className="space-y-4">
                    {education.map((edu) => (
                      <div key={edu.id} className="text-xs">
                        <h3 className="font-bold text-slate-900 text-[13px]">{edu.degree}</h3>
                        <p className="text-slate-600 font-medium">{edu.field}</p>
                        <p className={`text-xs font-semibold ${accentText} mt-0.5`}>{edu.institution}</p>
                        <p className="text-slate-400 mt-0.5">{edu.startDate} - {edu.current ? "Present" : edu.endDate} | {edu.location}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Projects */}
          {projects.length > 0 && (
            <div className="pt-1 print:break-inside-avoid">
              <h2 className={`${sectionHeaderStyle} ${accentBorder}`}>
                <FolderGit size={16} /> Key Projects
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {projects.map((proj) => (
                  <div key={proj.id} className="border border-slate-100 rounded-lg p-3.5 hover:border-slate-200 transition bg-slate-50/30 print:border-none print:p-0 print:bg-transparent print:break-inside-avoid">
                    <div className="flex flex-col gap-1 mb-1.5">
                      <h3 className="font-bold text-slate-900 text-sm">{proj.title}</h3>
                      <div className="flex flex-wrap gap-x-3 gap-y-1">
                        {proj.githubUrl && renderLink(proj.githubUrl, <Github size={12} className="text-slate-400" />)}
                        {proj.liveUrl && renderLink(proj.liveUrl, <Globe size={12} className="text-slate-400" />)}
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 mb-2">{proj.description}</p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {proj.technologies.map((t, idx) => t.trim() && (
                        <span key={idx} className="bg-slate-100 text-slate-605 text-[10px] px-1.5 py-0.5 rounded border border-slate-200 font-mono">
                          {t}
                        </span>
                      ))}
                    </div>
                    <ul className="list-disc list-inside text-[11px] text-slate-600 space-y-1">
                      {proj.bullets.map((b, i) => b.trim() && <li key={i}>{b}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications and Languages combined */}
          {(certifications.length > 0 || languages.length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1 border-t border-slate-100 print:break-inside-avoid">
              {certifications.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest flex items-center gap-1.5 mb-2.5 text-slate-500">
                    <Award size={14} className={accentText} /> Certifications
                  </h3>
                  <ul className="space-y-1.5">
                    {certifications.map((c) => (
                      <li key={c.id} className="text-xs">
                        <span className="font-bold text-slate-800">{c.name}</span>
                        {c.issuer && <span className="text-slate-400"> • {c.issuer}</span>}
                        {c.date && <span className="text-slate-400 text-[10px] italic"> ({c.date})</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {languages.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest flex items-center gap-1.5 mb-2.5 text-slate-500">
                    <Languages size={14} className={accentText} /> Languages
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {languages.map((l) => (
                      <span key={l.id} className="text-xs text-slate-700 bg-slate-50 py-1 px-2.5 rounded border border-slate-150 font-medium">
                        {l.name} <span className={`text-[10px] ${accentText} font-semibold ml-1 uppercase`}>({l.level})</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ==================== THEME 1.5: MODERN-SHORT ==================== */}
      {theme === "modern-short" && (
        <div className="space-y-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:justify-between items-start border-b border-slate-100 pb-3 gap-3">
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">{personalInfo.name || "Insert Name"}</h1>
              <p className={`text-sm font-semibold ${accentText} tracking-tight mt-1`}>{personalInfo.title || "Professional Role"}</p>
            </div>
            {/* Contact details grid */}
            <div className="flex flex-col gap-1 text-right md:-mt-1 whitespace-nowrap">
              <div className="flex flex-wrap gap-x-3 gap-y-1 justify-start md:justify-end text-[11px] text-slate-500">
                {personalInfo.email && (
                  <div className="flex items-center gap-1.5 justify-start md:justify-end">
                    <Mail size={12} className={accentText} />
                    <a href={`mailto:${personalInfo.email}`} className="hover:underline">{personalInfo.email}</a>
                  </div>
                )}
                {personalInfo.phone && (
                  <div className="flex items-center gap-1.5 justify-start md:justify-end">
                    <Phone size={12} className={accentText} />
                    <span>{personalInfo.phone}</span>
                  </div>
                )}
                {personalInfo.location && (
                  <div className="flex items-center gap-1.5 justify-start md:justify-end">
                    <MapPin size={12} className={accentText} />
                    <span>{personalInfo.location}</span>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-x-3 gap-y-1 justify-start md:justify-end">
                {renderLink(personalInfo.website, <Globe size={12} className={accentText} />)}
                {renderLink(personalInfo.github, <Github size={12} className={accentText} />)}
                {renderLink(personalInfo.linkedin, <Linkedin size={12} className={accentText} />)}
              </div>
            </div>
          </div>

          {/* 2-Column Side-by-Side Space-Efficient Layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 print:grid-cols-12 gap-5 items-start">
            
            {/* Main Column (8/12 height) */}
            <div className="md:col-span-8 print:col-span-8 space-y-4">
              
              {/* Summary */}
              {personalInfo.rawSummary && (
                <div className="text-[12px] text-slate-600 leading-relaxed text-justify">
                  {personalInfo.rawSummary}
                </div>
              )}

              {/* Work Experience */}
              {experiences.length > 0 && (
                <div>
                  <h2 className={`${sectionHeaderStyle} ${accentBorder}`}>
                    <Briefcase size={14} /> Experience
                  </h2>
                  <div className="space-y-3">
                    {experiences.map((exp) => (
                      <div key={exp.id} className="relative print:break-inside-avoid">
                        <div className="flex justify-between items-baseline mb-0.5">
                          <h3 className="font-bold text-slate-900 text-[13px] leading-snug">
                            {exp.role} <span className="font-normal text-slate-400">@</span> <span className={`${accentText} font-semibold`}>{exp.company}</span>
                          </h3>
                          <span className="text-[10px] font-semibold text-slate-500 bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded whitespace-nowrap">
                            {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                          </span>
                        </div>
                        <div className="text-[10.5px] text-slate-400 italic mb-1">{exp.location}</div>
                        <ul className={bulletStyle}>
                          {exp.bullets.map((b, i) => b.trim() && <li key={i}>{b}</li>)}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects */}
              {projects.length > 0 && (
                <div>
                  <h2 className={`${sectionHeaderStyle} ${accentBorder}`}>
                    <FolderGit size={14} /> Key Projects
                  </h2>
                  <div className="space-y-3">
                    {projects.map((proj) => (
                      <div key={proj.id} className="print:break-inside-avoid">
                        <div className="flex justify-between items-baseline mb-0.5">
                          <h3 className="font-bold text-slate-900 text-[13px]">{proj.title}</h3>
                          <div className="flex gap-x-2 text-[10px]">
                            {proj.githubUrl && renderLink(proj.githubUrl, <Github size={11} className="text-slate-400" />)}
                            {proj.liveUrl && renderLink(proj.liveUrl, <Globe size={11} className="text-slate-400" />)}
                          </div>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-slug mb-1">{proj.description}</p>
                        {proj.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-1">
                            {proj.technologies.map((t, idx) => t.trim() && (
                              <span key={idx} className="bg-slate-50 text-slate-600 text-[9px] px-1.5 py-0.2 rounded border border-slate-150 font-mono">
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                        <ul className="list-disc list-inside text-[11px] text-slate-600 space-y-0.5">
                          {proj.bullets.map((b, i) => b.trim() && <li key={i}>{b}</li>)}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar Column (4/12 height) */}
            <div className="md:col-span-4 print:col-span-4 space-y-4 border-l border-slate-100 pl-4 print:pl-4">
              
              {/* Skills */}
              {skills.length > 0 && (
                <div>
                  <h2 className={`${sectionHeaderStyle} ${accentBorder}`}>
                    <Code size={14} /> Skills
                  </h2>
                  <div className="space-y-2.5">
                    {skills.map((grp) => (
                      <div key={grp.id}>
                        <span className="font-semibold text-slate-400 text-[10px] uppercase tracking-wider block mb-0.5">{grp.category || "Category"}:</span>
                        <div className="flex flex-wrap gap-1">
                          {grp.items.map((skill, k) => skill.trim() && (
                            <span key={k} className={`text-[10px] px-1.5 py-0.5 rounded border ${accentBg} font-medium`}>
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
              {education.length > 0 && (
                <div>
                  <h2 className={`${sectionHeaderStyle} ${accentBorder}`}>
                    <GraduationCap size={14} /> Education
                  </h2>
                  <div className="space-y-2.5">
                    {education.map((edu) => (
                      <div key={edu.id} className="text-[11px]">
                        <h3 className="font-bold text-slate-900 leading-tight">{edu.degree}</h3>
                        <p className="text-slate-600 font-medium leading-tight">{edu.field}</p>
                        <p className={`font-semibold ${accentText} mt-0.5`}>{edu.institution}</p>
                        <p className="text-slate-400 text-[10px] mt-0.5">{edu.startDate} - {edu.current ? "Present" : edu.endDate}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Certifications */}
              {certifications.length > 0 && (
                <div>
                  <h2 className={`${sectionHeaderStyle} ${accentBorder}`}>
                    <Award size={14} /> Certifications
                  </h2>
                  <ul className="space-y-1.5">
                    {certifications.map((c) => (
                      <li key={c.id} className="text-[11px] leading-tight">
                        <span className="font-bold text-slate-800">{c.name}</span>
                        {c.issuer && <span className="text-slate-400 block text-[10px]">{c.issuer}</span>}
                        {c.date && <span className="text-slate-400 text-[9px] italic block"> ({c.date})</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Languages */}
              {languages.length > 0 && (
                <div>
                  <h2 className={`${sectionHeaderStyle} ${accentBorder}`}>
                    <Languages size={14} /> Languages
                  </h2>
                  <div className="flex flex-wrap gap-1.5">
                    {languages.map((l) => (
                      <span key={l.id} className="text-[11px] text-slate-705 bg-slate-50 py-0.5 px-2 rounded border border-slate-150 font-medium">
                        {l.name} <span className={`text-[9px] ${accentText} font-semibold uppercase`}>({l.level})</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================== THEME 1.8: FORMAL-SHORT ==================== */}
      {theme === "formal-short" && (
        <div className="space-y-4 font-sans text-slate-900">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:justify-between items-start border-b border-slate-200 pb-3 gap-3">
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">{personalInfo.name || "Insert Name"}</h1>
              <p className={`text-sm font-semibold ${accentText} tracking-tight mt-1`}>{personalInfo.title || "Professional Role"}</p>
            </div>
            {/* Contact details grid */}
            <div className="flex flex-col gap-1 text-right md:-mt-1 whitespace-nowrap">
              <div className="flex flex-wrap gap-x-3 gap-y-1 justify-start md:justify-end text-[11px] text-slate-500">
                {personalInfo.email && (
                  <div className="flex items-center gap-1.5 justify-start md:justify-end">
                    <Mail size={12} className={accentText} />
                    <a href={`mailto:${personalInfo.email}`} className="hover:underline">{personalInfo.email}</a>
                  </div>
                )}
                {personalInfo.phone && (
                  <div className="flex items-center gap-1.5 justify-start md:justify-end">
                    <Phone size={12} className={accentText} />
                    <span>{personalInfo.phone}</span>
                  </div>
                )}
                {personalInfo.location && (
                  <div className="flex items-center gap-1.5 justify-start md:justify-end">
                    <MapPin size={12} className={accentText} />
                    <span>{personalInfo.location}</span>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-x-3 gap-y-1 justify-start md:justify-end">
                {renderLink(personalInfo.website, <Globe size={12} className={accentText} />)}
                {renderLink(personalInfo.github, <Github size={12} className={accentText} />)}
                {renderLink(personalInfo.linkedin, <Linkedin size={12} className={accentText} />)}
              </div>
            </div>
          </div>

          {/* 2-Column Space-Efficient Layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 print:grid-cols-12 gap-5 items-start">
            
            {/* Main Column (8/12 height) */}
            <div className="md:col-span-8 print:col-span-8 space-y-4">
              {/* Profile Summary */}
              {personalInfo.rawSummary && (
                <div className="text-[11px] text-slate-700 leading-normal text-justify">
                  {personalInfo.rawSummary}
                </div>
              )}

              {/* Work Experience */}
              {experiences.length > 0 && (
                <div>
                  <h2 className={`${sectionHeaderStyle} ${accentBorder}`}>
                    Professional Experience
                  </h2>
                  <div className="space-y-3">
                    {experiences.map((exp) => (
                      <div key={exp.id} className="print:break-inside-avoid text-[11px]">
                        <div className="flex justify-between items-baseline font-bold text-slate-900 leading-tight">
                          <span>
                            {exp.role} <span className="font-normal text-slate-400">@</span> <span className={`${accentText} font-semibold`}>{exp.company}</span>
                          </span>
                          <span className="text-slate-505 font-normal italic text-[10px] whitespace-nowrap">
                            {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 italic mb-1 leading-none">
                          {exp.location}
                        </div>
                        <ul className={bulletStyle}>
                          {exp.bullets.map((b, i) => b.trim() && (
                            <li key={i} className="text-justify">{b}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects */}
              {projects.length > 0 && (
                <div className="print:break-inside-avoid">
                  <h2 className={`${sectionHeaderStyle} ${accentBorder}`}>
                    Projects & Achievements
                  </h2>
                  <div className="space-y-2.5">
                    {projects.map((proj) => (
                      <div key={proj.id} className="print:break-inside-avoid text-[11px]">
                        <div className="flex justify-between items-baseline font-bold text-slate-900 leading-tight">
                          <span>
                            {proj.title}
                            {proj.technologies.length > 0 && (
                              <span className="font-normal italic text-[9.5px] text-slate-400 ml-1.5">
                                ({proj.technologies.join(", ")})
                              </span>
                            )}
                          </span>
                        </div>
                        {proj.description && (
                          <p className="text-[10.5px] italic text-slate-500 mb-1">{proj.description}</p>
                        )}
                        <ul className={bulletStyle}>
                          {proj.bullets.map((b, i) => b.trim() && (
                            <li key={i} className="text-justify">{b}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar Column (4/12 height) */}
            <div className="md:col-span-4 print:col-span-4 space-y-4 border-l border-slate-200 pl-4 print:pl-4">
              {/* Technical Skills */}
              {skills.length > 0 && (
                <div className="print:break-inside-avoid">
                  <h2 className={`${sectionHeaderStyle} ${accentBorder}`}>
                    Skills
                  </h2>
                  <div className="space-y-2 text-[10.5px]">
                    {skills.map((grp) => (
                      <div key={grp.id} className="leading-snug">
                        <strong className="text-slate-800 block font-semibold">{grp.category}:</strong>
                        <span className="text-slate-600 block text-[10px] mt-0.5">{grp.items.filter(Boolean).join(", ")}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
              {education.length > 0 && (
                <div className="print:break-inside-avoid">
                  <h2 className={`${sectionHeaderStyle} ${accentBorder}`}>
                    Education
                  </h2>
                  <div className="space-y-2.5">
                    {education.map((edu) => (
                      <div key={edu.id} className="text-[10.5px]">
                        <h3 className="font-bold text-slate-900 leading-tight">{edu.degree}</h3>
                        {edu.field && <p className="text-slate-600 font-medium leading-tight">{edu.field}</p>}
                        <p className={`font-semibold ${accentText} mt-0.5`}>{edu.institution}</p>
                        <p className="text-slate-400 text-[9.5px] mt-0.5 whitespace-nowrap">{edu.startDate} – {edu.current ? "Present" : edu.endDate}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Certifications */}
              {certifications.length > 0 && (
                <div className="print:break-inside-avoid">
                  <h2 className={`${sectionHeaderStyle} ${accentBorder}`}>
                    Certifications
                  </h2>
                  <ul className="space-y-1.5 text-[10.5px] list-disc list-inside">
                    {certifications.map((c) => (
                      <li key={c.id} className="leading-snug text-slate-700">
                        <strong className="font-semibold text-slate-800">{c.name}</strong> 
                        {c.issuer && <span className="text-slate-500 block text-[9.5px] leading-tight pl-3">{c.issuer}</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Languages */}
              {languages.length > 0 && (
                <div className="print:break-inside-avoid">
                  <h2 className={`${sectionHeaderStyle} ${accentBorder}`}>
                    Languages
                  </h2>
                  <ul className="space-y-1 text-[10.5px] list-disc list-inside text-slate-700">
                    {languages.map((l) => (
                      <li key={l.id} className="leading-snug">
                        <span className="font-semibold">{l.name}</span> <span className="text-slate-500">({l.level})</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================== THEME 1.9: SPLIT-SIDEBAR (HIGH FIDELITY SCREENSHOT PATTERN) ==================== */}
      {theme === "split-sidebar" && (
        <div className="font-sans text-slate-800 bg-white min-h-full">
          {/* Header Band */}
          <div className="bg-slate-50 border-b border-slate-200/80 p-4 flex items-center gap-5">
            {/* Avatar / Circle profile image */}
            <div className="relative w-16 h-16 rounded-full overflow-hidden bg-slate-200 border-2 border-white shadow-sm flex-shrink-0">
              {personalInfo.photoUrl ? (
                <img 
                  src={personalInfo.photoUrl} 
                  alt={personalInfo.name} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className={`w-full h-full flex items-center justify-center text-lg font-bold bg-slate-300 text-slate-700`}>
                  {personalInfo.name ? personalInfo.name.split(" ").map(n => n[0]).join("").toUpperCase() : "JD"}
                </div>
              )}
            </div>

            {/* Name & Title */}
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 leading-none mb-1">
                {personalInfo.name || "Insert Name"}
              </h1>
              <p className="text-xs font-bold tracking-wide text-slate-500 uppercase leading-none">
                {personalInfo.title || "Target Professional Role"}
              </p>
            </div>
          </div>

          {/* Grid Body */}
          <div className="grid grid-cols-12 gap-4 p-3.5">
            {/* Left Column (Narrower Sidebar) */}
            <div className="col-span-3 space-y-3.5 pr-3 border-r border-slate-200/85">
              {/* CONTACT */}
              <div>
                <h2 className="text-[10px] font-extrabold tracking-[0.2em] text-slate-900 uppercase border-b border-slate-200 pb-0.5 mb-2">
                  CONTACT:
                </h2>
                <div className="space-y-1.5 text-[10px] text-slate-600">
                  {personalInfo.phone && (
                    <div className="flex items-center gap-1.5">
                      <Phone size={10} className={`${accentText} shrink-0`} />
                      <span>{personalInfo.phone}</span>
                    </div>
                  )}
                  {personalInfo.email && (
                    <div className="flex items-center gap-1.5 min-w-0">
                      <Mail size={10} className={`${accentText} shrink-0`} />
                      <span className="truncate">{personalInfo.email}</span>
                    </div>
                  )}
                  {personalInfo.location && (
                    <div className="flex items-center gap-1.5">
                      <MapPin size={10} className={`${accentText} shrink-0`} />
                      <span>{personalInfo.location}</span>
                    </div>
                  )}
                  {personalInfo.website && (
                    <div className="flex items-center gap-1.5">
                      <Globe size={10} className={`${accentText} shrink-0`} />
                      <span className="truncate">{personalInfo.website.replace(/^https?:\/\//, "")}</span>
                    </div>
                  )}
                  {personalInfo.github && (
                    <div className="flex items-center gap-1.5">
                      <Github size={10} className={`${accentText} shrink-0`} />
                      <span className="truncate">{personalInfo.github.replace(/^github\.com\//, "")}</span>
                    </div>
                  )}
                  {personalInfo.linkedin && (
                    <div className="flex items-center gap-1.5">
                      <Linkedin size={10} className={`${accentText} shrink-0`} />
                      <span className="truncate">{personalInfo.linkedin.replace(/^linkedin\.com\/in\//, "")}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* SKILLS */}
              {skills.length > 0 && (
                <div>
                  <h2 className="text-[10px] font-extrabold tracking-[0.2em] text-slate-900 uppercase border-b border-slate-200 pb-0.5 mb-2">
                    SKILLS:
                  </h2>
                  <ul className="space-y-1 text-[10px] text-slate-600">
                    {skills.map((grp) => (
                      <li key={grp.id} className="leading-snug">
                        <span className="font-bold text-slate-800">{grp.category}: </span>
                        <span>{grp.items.filter(Boolean).join(", ")}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* EDUCATION */}
              {education.length > 0 && (
                <div>
                  <h2 className="text-[10px] font-extrabold tracking-[0.2em] text-slate-900 uppercase border-b border-slate-200 pb-0.5 mb-2">
                    EDUCATION:
                  </h2>
                  <div className="space-y-2">
                    {education.map((edu) => (
                      <div key={edu.id} className="text-[10px] text-slate-600">
                        <div className="font-extrabold text-slate-900 uppercase leading-tight">
                          {edu.institution}
                        </div>
                        <div className="font-bold text-slate-700 text-[9.5px]">
                          {edu.startDate} - {edu.current ? "Present" : edu.endDate}
                        </div>
                        <div className="text-slate-500 italic text-[9.5px]">
                          {edu.degree} {edu.field ? `in ${edu.field}` : ""}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* LANGUAGE */}
              {languages.length > 0 && (
                <div>
                  <h2 className="text-[10px] font-extrabold tracking-[0.2em] text-slate-900 uppercase border-b border-slate-200 pb-0.5 mb-2">
                    LANGUAGE:
                  </h2>
                  <ul className="space-y-0.5 text-[10px] text-slate-600">
                    {languages.map((l) => (
                      <li key={l.id} className="leading-snug">
                        <span className="font-bold text-slate-800">{l.name}: </span>
                        <span>{l.level}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Right Column (Wider Body) */}
            <div className="col-span-9 space-y-4">
              {/* PROFESSIONAL SUMMARY */}
              {personalInfo.rawSummary && (
                <div>
                  <h2 className="text-[10px] font-extrabold tracking-[0.2em] text-slate-900 uppercase border-b border-slate-200 pb-0.5 mb-1.5">
                    PROFESSIONAL SUMMARY:
                  </h2>
                  <p className="text-[10px] text-slate-600 leading-normal text-justify">
                    {personalInfo.rawSummary}
                  </p>
                </div>
              )}

              {/* EXPERIENCE */}
              {experiences.length > 0 && (
                <div>
                  <h2 className="text-[10px] font-extrabold tracking-[0.2em] text-slate-900 uppercase border-b border-slate-200 pb-0.5 mb-1.5">
                    EXPERIENCE:
                  </h2>
                  <div className="space-y-3">
                    {experiences.map((exp) => (
                      <div key={exp.id} className="text-[10px] leading-snug">
                        {/* Company Name */}
                        <div className="text-[10.5px] font-bold text-slate-800 leading-tight">
                          {exp.company}
                        </div>
                        
                        {/* Role & Date range */}
                        <div className="font-extrabold uppercase text-slate-950 tracking-wide mt-0.5 flex justify-between items-baseline">
                          <span>{exp.role}</span>
                          <span className="text-slate-500 font-normal italic text-[9px]">
                            {exp.startDate.toUpperCase()} - {exp.current ? "PRESENT" : exp.endDate.toUpperCase()}
                          </span>
                        </div>

                        {/* Location */}
                        {exp.location && (
                          <div className="text-[9px] text-slate-400 italic mb-1">
                            {exp.location}
                          </div>
                        )}

                        {/* Bullet points */}
                        <ul className="list-disc list-inside space-y-0.5 text-slate-600 text-[10px] leading-normal mt-0.5">
                          {exp.bullets.map((b, i) => {
                            if (!b.trim()) return null;
                            const hasBold = b.includes("**");
                            if (hasBold) {
                              const parts = b.split("**");
                              return (
                                <li key={i} className="text-justify list-item pl-1">
                                  {parts.map((part, pIdx) => (
                                    pIdx % 2 === 1 ? <strong key={pIdx} className="font-bold text-slate-850">{part}</strong> : part
                                  ))}
                                </li>
                              );
                            }
                            return (
                              <li key={i} className="text-justify list-item pl-1">{b}</li>
                            );
                          })}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PROJECTS */}
              {projects.length > 0 && (
                <div>
                  <h2 className="text-[10px] font-extrabold tracking-[0.2em] text-slate-900 uppercase border-b border-slate-200 pb-0.5 mb-1.5">
                    PROJECTS:
                  </h2>
                  <div className="space-y-2.5">
                    {projects.map((proj) => (
                      <div key={proj.id} className="text-[10px]">
                        <div className="flex justify-between items-baseline font-bold text-slate-900">
                          <span>{proj.title}</span>
                          <span className="text-[9px] text-slate-400 font-normal italic font-sans">
                            {proj.technologies.join(", ")}
                          </span>
                        </div>
                        {proj.description && (
                          <p className="text-slate-500 italic mt-0.5 mb-0.5 text-[9.5px]">{proj.description}</p>
                        )}
                        <ul className="list-disc list-inside space-y-0.5 text-slate-600 text-[10px]">
                          {proj.bullets.map((b, i) => b.trim() && (
                            <li key={i} className="text-justify list-item pl-1">{b}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CERTIFICATIONS */}
              {certifications.length > 0 && (
                <div>
                  <h2 className="text-[10px] font-extrabold tracking-[0.2em] text-slate-900 uppercase border-b border-slate-200 pb-0.5 mb-1.5">
                    CERTIFICATIONS:
                  </h2>
                  <ul className="list-disc list-inside space-y-0.5 text-[10px] text-slate-600 pl-1">
                    {certifications.map((c) => (
                      <li key={c.id}>
                        <strong className="font-bold text-slate-800">{c.name}</strong> 
                        {c.issuer && <span className="text-slate-500"> ({c.issuer})</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================== THEME 2: EXECUTIVE ==================== */}
      {theme === "executive" && (
        <div className="space-y-5">
          {/* Centered Classical Header */}
          <div className="text-center border-b pb-4 space-y-1">
            <h1 className="text-3xl font-bold font-serif tracking-tight text-slate-900">{personalInfo.name || "Insert Name"}</h1>
            <p className={`text-md uppercase tracking-wider font-semibold ${accentText}`}>{personalInfo.title || "Professional Role"}</p>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-slate-600 mt-1">
              {personalInfo.email && <span className="flex items-center gap-1"><Mail size={11} /> {personalInfo.email}</span>}
              {personalInfo.phone && <span className="flex items-center gap-1"><Phone size={11} /> {personalInfo.phone}</span>}
              {personalInfo.location && <span className="flex items-center gap-1"><MapPin size={11} /> {personalInfo.location}</span>}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-slate-600">
              {renderLink(personalInfo.website, <Globe size={11} />)}
              {renderLink(personalInfo.github, <Github size={11} />)}
              {renderLink(personalInfo.linkedin, <Linkedin size={11} />)}
            </div>
          </div>

          {/* Profile Summary */}
          {personalInfo.rawSummary && (
            <div className="text-sm font-serif italic text-slate-700 leading-relaxed text-justify px-3 border-l-2 py-0.5">
              {personalInfo.rawSummary}
            </div>
          )}

          {/* Employment */}
          {experiences.length > 0 && (
            <div className="print:break-inside-avoid">
              <h2 className={`${sectionHeaderStyle} ${accentBorder}`}>
                Professional Experience
              </h2>
              <div className="space-y-4">
                {experiences.map((exp) => (
                  <div key={exp.id} className="print:break-inside-avoid">
                    <div className="flex justify-between items-baseline font-bold text-slate-900 text-sm">
                      <span>{exp.role}</span>
                      <span className="font-normal text-slate-500 text-xs italic">{exp.startDate} – {exp.current ? "Present" : exp.endDate}</span>
                    </div>
                    <div className="flex justify-between items-baseline text-xs font-semibold text-slate-600 mb-2">
                      <span className={accentText}>{exp.company}</span>
                      <span className="italic">{exp.location}</span>
                    </div>
                    <ul className={bulletStyle}>
                      {exp.bullets.map((b, i) => b.trim() && (
                        <li key={i} className="pl-1 text-[13px] text-justify">{b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dual blocks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
            {/* Education */}
            {education.length > 0 && (
              <div className="print:break-inside-avoid">
                <h2 className={`${sectionHeaderStyle} ${accentBorder}`}>
                  Education History
                </h2>
                <div className="space-y-3">
                  {education.map((edu) => (
                    <div key={edu.id} className="text-xs">
                      <div className="flex justify-between items-baseline font-bold text-slate-900">
                        <span>{edu.degree} – {edu.field}</span>
                        <span className="text-slate-500 font-normal italic">{edu.startDate} – {edu.current ? "Present" : edu.endDate}</span>
                      </div>
                      <p className={`font-semibold ${accentText} mt-0.5`}>{edu.institution}</p>
                      <p className="text-slate-400 mt-0.5">{edu.location}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications & Languages block */}
            <div className="space-y-4 print:break-inside-avoid">
              {skills.length > 0 && (
                <div>
                  <h2 className={`${sectionHeaderStyle} ${accentBorder}`}>
                    Technical Skills
                  </h2>
                  <div className="space-y-2">
                    {skills.map((grp) => (
                      <div key={grp.id} className="text-xs flex gap-2">
                        <strong className="text-slate-800 min-w-[80px] block">{grp.category}:</strong>
                        <span className="text-slate-600">{grp.items.filter(Boolean).join(", ")}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Projects */}
          {projects.length > 0 && (
            <div className="pt-1 print:break-inside-avoid">
              <h2 className={`${sectionHeaderStyle} ${accentBorder}`}>
                Selected Project Achievements
              </h2>
              <div className="space-y-3">
                {projects.map((proj) => (
                  <div key={proj.id} className="print:break-inside-avoid">
                    <div className="flex flex-col gap-0.5 mb-1.5">
                      <div className="font-semibold text-slate-900 text-xs">
                        <span>{proj.title} <span className="font-normal font-sans italic text-[11px] text-slate-400">({proj.technologies.slice(0, 3).join(", ")})</span></span>
                      </div>
                      <div className="flex flex-wrap gap-x-3 gap-y-0.5">
                        {proj.githubUrl && renderLink(proj.githubUrl, <Github size={10} />)}
                        {proj.liveUrl && renderLink(proj.liveUrl, <Globe size={10} />)}
                      </div>
                    </div>
                    <p className="text-xs italic text-slate-500 mt-0.5 mb-1">{proj.description}</p>
                    <ul className="list-disc list-inside text-xs text-slate-600 space-y-0.5 pl-2 leading-relaxed">
                      {proj.bullets.map((b, i) => b.trim() && <li key={i}>{b}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications and Languages */}
          {(certifications.length > 0 || languages.length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1 border-t print:break-inside-avoid">
              {certifications.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold font-serif italic text-slate-805 mb-2">Certifications</h3>
                  <ul className="list-disc list-inside text-xs text-slate-600 space-y-1">
                    {certifications.map((c) => (
                      <li key={c.id}>
                        <strong>{c.name}</strong> {c.issuer && <span className="text-slate-400">({c.issuer})</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {languages.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold font-serif italic text-slate-805 mb-2">Languages</h3>
                  <p className="text-xs text-slate-600">
                    {languages.map((l) => `${l.name} (${l.level})`).join(", ")}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}


      {/* ==================== THEME 3: CREATIVE ==================== */}
      {theme === "creative" && (
        <div className="space-y-6">
          {/* Playful & Bold Header */}
          <div className="bg-gradient-to-r from-neutral-50 to-neutral-100 p-5 rounded-2xl border border-neutral-200/60 flex flex-col md:flex-row gap-5 justify-between items-start print:bg-none print:border-none print:p-0">
            <div>
              <div className="inline-block bg-neutral-900 text-white text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full mb-2">Portfolio Resume</div>
              <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight leading-none">{personalInfo.name || "Insert Name"}</h1>
              <p className={`text-lg font-bold ${accentText} mt-1`}>{personalInfo.title || "Professional Role"}</p>
              {personalInfo.rawSummary && (
                <p className="text-xs text-neutral-500 max-w-xl mt-3 leading-relaxed">{personalInfo.rawSummary}</p>
              )}
            </div>
            
            <div className="flex flex-col gap-2 p-3 bg-white rounded-xl shadow-xs border border-neutral-100 min-w-[200px] print:border-none print:shadow-none print:p-0">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">Get In Touch:</span>
              {personalInfo.email && (
                <a href={`mailto:${personalInfo.email}`} className="flex items-center gap-2 text-xs text-neutral-600 hover:underline">
                  <Mail size={12} className="text-neutral-400" />
                  <span>{personalInfo.email}</span>
                </a>
              )}
              {personalInfo.phone && (
                <div className="flex items-center gap-2 text-xs text-neutral-600">
                  <Phone size={12} className="text-neutral-400" />
                  <span>{personalInfo.phone}</span>
                </div>
              )}
              {personalInfo.location && (
                <div className="flex items-center gap-2 text-xs text-neutral-600">
                  <MapPin size={12} className="text-neutral-400" />
                  <span>{personalInfo.location}</span>
                </div>
              )}
              <div className="flex flex-wrap gap-2 pt-1 border-t border-neutral-100 mt-1">
                {renderLink(personalInfo.website, <Globe size={11} />)}
                {renderLink(personalInfo.github, <Github size={11} />)}
                {renderLink(personalInfo.linkedin, <Linkedin size={11} />)}
              </div>
            </div>
          </div>

          {/* Grid setup */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-1">
            {/* Main pane (Experience and Projects) */}
            <div className="md:col-span-8 space-y-6">
              
              {/* Experiences */}
              {experiences.length > 0 && (
                <div className="print:break-inside-avoid">
                  <h2 className="text-sm font-black uppercase tracking-wider text-neutral-900 flex items-center gap-2 mb-4">
                    <span className="w-1.5 h-4 bg-neutral-900 rounded-xs"></span> Experience Showcase
                  </h2>
                  <div className="space-y-4 border-l border-neutral-200 pl-4 ml-1">
                    {experiences.map((exp) => (
                      <div key={exp.id} className="relative print:break-inside-avoid">
                        {/* Bullet circle dot */}
                        <span className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-neutral-900 border-2 border-white"></span>
                        
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1">
                          <h3 className="font-bold text-neutral-800 text-sm">{exp.role} <span className="font-normal text-neutral-401">at</span> <span className={`${accentText}`}>{exp.company}</span></h3>
                          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">{exp.startDate} - {exp.current ? "Present" : exp.endDate}</span>
                        </div>
                        <p className="text-xs italic text-neutral-400 mb-2">{exp.location}</p>
                        <ul className="list-disc list-inside space-y-1 text-xs text-neutral-600 leading-relaxed text-left pl-1">
                          {exp.bullets.map((b, i) => b.trim() && <li key={i}>{b}</li>)}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects */}
              {projects.length > 0 && (
                <div className="pt-2 print:break-inside-avoid">
                  <h2 className="text-sm font-black uppercase tracking-wider text-neutral-900 flex items-center gap-2 mb-4">
                    <span className="w-1.5 h-4 bg-neutral-900 rounded-xs"></span> Major Projects
                  </h2>
                  <div className="space-y-4">
                    {projects.map((proj) => (
                      <div key={proj.id} className="border border-neutral-100 rounded-xl p-4 bg-neutral-50/50 print:border-none print:p-0 print:bg-transparent print:break-inside-avoid">
                        <div className="flex flex-col gap-1 mb-1.5">
                          <h3 className="font-extrabold text-neutral-800 text-sm">{proj.title}</h3>
                          <div className="flex flex-wrap gap-x-3 gap-y-1">
                            {proj.githubUrl && renderLink(proj.githubUrl, <Github size={11} />)}
                            {proj.liveUrl && renderLink(proj.liveUrl, <Globe size={11} />)}
                          </div>
                        </div>
                        <p className="text-xs text-neutral-500 mb-2">{proj.description}</p>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {proj.technologies.map((t, i) => t.trim() && (
                            <span key={i} className="text-[9px] bg-neutral-200 text-neutral-800 px-2 py-0.5 rounded-full font-semibold">
                              {t}
                            </span>
                          ))}
                        </div>
                        <ul className="list-[circle] list-inside space-y-1 text-xs text-neutral-600">
                          {proj.bullets.map((b, i) => b.trim() && <li key={i}>{b}</li>)}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar pane (Skills, Education, Certifications) */}
            <div className="md:col-span-4 space-y-6">
              {/* Skills */}
              {skills.length > 0 && (
                <div className="print:break-inside-avoid bg-neutral-50 p-4 rounded-xl border border-neutral-100 print:bg-transparent print:border-none print:p-0">
                  <h2 className="text-sm font-black uppercase tracking-wider text-neutral-900 flex items-center gap-2 mb-3">
                    <span className="w-1.5 h-4 bg-neutral-900 rounded-xs"></span> Tech Arsenal
                  </h2>
                  <div className="space-y-3.5">
                    {skills.map((grp) => (
                      <div key={grp.id}>
                        <span className="text-[10px] font-bold text-neutral-410 uppercase tracking-widest block mb-1">{grp.category}:</span>
                        <div className="flex flex-wrap gap-1">
                          {grp.items.map((it, idx) => it.trim() && (
                            <span key={idx} className="bg-white text-neutral-700 text-xs py-1 px-2.5 rounded-lg border border-neutral-200 shadow-3xs font-medium">
                              {it}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
              {education.length > 0 && (
                <div className="print:break-inside-avoid">
                  <h2 className="text-sm font-black uppercase tracking-wider text-neutral-900 flex items-center gap-2 mb-3">
                    <span className="w-1.5 h-4 bg-neutral-900 rounded-xs"></span> Education
                  </h2>
                  <div className="space-y-3">
                    {education.map((edu) => (
                      <div key={edu.id} className="text-xs bg-white rounded-lg border border-neutral-100 p-3 print:p-0 print:border-none">
                        <h3 className="font-extrabold text-neutral-800">{edu.degree}</h3>
                        <p className="text-neutral-500 font-medium">{edu.field}</p>
                        <p className={`text-xs font-semibold ${accentText} mt-0.5`}>{edu.institution}</p>
                        <p className="text-[10px] text-neutral-400 mt-1 uppercase font-bold tracking-wider">{edu.startDate} - {edu.current ? "Present" : edu.endDate}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Certifications and Languages combined */}
              {(certifications.length > 0 || languages.length > 0) && (
                <div className="print:break-inside-avoid space-y-4">
                  {certifications.length > 0 && (
                    <div>
                      <h2 className="text-xs font-black uppercase tracking-wider text-neutral-900 mb-2">Qualifications</h2>
                      <div className="space-y-2">
                        {certifications.map((c) => (
                          <div key={c.id} className="text-xs border-b border-neutral-100 pb-1.5">
                            <span className="font-bold text-neutral-850 block">{c.name}</span>
                            <span className="text-neutral-400 text-[10px]">{c.issuer} | {c.date}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {languages.length > 0 && (
                    <div>
                      <h2 className="text-xs font-black uppercase tracking-wider text-neutral-900 mb-2">Languages</h2>
                      <div className="flex flex-wrap gap-2">
                        {languages.map((l) => (
                          <span key={l.id} className="bg-neutral-100 text-neutral-600 text-[11px] px-2.5 py-1 rounded font-bold uppercase">
                            {l.name} ({l.level})
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}


      {/* ==================== THEME 4: DEVELOPER ==================== */}
      {theme === "developer" && (
        <div className="space-y-5">
          {/* Mock Console Header */}
          <div className="border border-zinc-200 rounded-lg overflow-hidden bg-zinc-900 text-zinc-100 font-mono text-xs shadow-md p-4 print:border-none print:shadow-none print:bg-transparent print:text-zinc-900 print:p-0">
            <div className="flex justify-between items-center pb-2 border-b border-zinc-800 mb-3 print:hidden">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
              </div>
              <span className="text-zinc-500 text-[10px]">user@github.io:~/{personalInfo.name ? personalInfo.name.toLowerCase().replace(/\s+/g, "_") : "resume"}</span>
            </div>
            
            <div className="space-y-1 bg-zinc-950 p-3 rounded font-mono text-green-400 print:bg-transparent print:text-zinc-900 print:p-0">
              <p className="text-zinc-400"><span className="text-amber-500">$</span> cat profile.json</p>
              <div className="pl-4 text-zinc-300 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
                <div><span className="text-rose-400">"name"</span>: <span className="text-emerald-300">"{personalInfo.name}"</span>,</div>
                <div><span className="text-rose-400">"target"</span>: <span className="text-emerald-300">"{personalInfo.title}"</span>,</div>
                <div><span className="text-rose-400">"email"</span>: <span className="text-emerald-300">"{personalInfo.email}"</span>,</div>
                <div><span className="text-rose-400">"phone"</span>: <span className="text-emerald-300">"{personalInfo.phone}"</span>,</div>
                <div><span className="text-rose-400">"location"</span>: <span className="text-emerald-300">"{personalInfo.location}"</span>,</div>
                <div><span className="text-rose-400">"website"</span>: <span className="text-emerald-300">"{personalInfo.website}"</span>,</div>
                {personalInfo.github && <div><span className="text-rose-400">"github"</span>: <span className="text-emerald-300">"{personalInfo.github}"</span>,</div>}
                {personalInfo.linkedin && <div><span className="text-rose-400">"linkedin"</span>: <span className="text-emerald-300">"{personalInfo.linkedin}"</span></div>}
              </div>
            </div>
          </div>

          {/* Quick Summary Command */}
          {personalInfo.rawSummary && (
            <div className="bg-zinc-100 p-3 rounded border border-zinc-200 print:bg-transparent print:border-none print:p-0 print:break-inside-avoid">
              <p className="text-[10px] text-zinc-500 font-bold uppercase mb-1">// SYSTEM_BIO_SUMMARY</p>
              <p className="text-xs text-zinc-700 leading-relaxed text-justify">{personalInfo.rawSummary}</p>
            </div>
          )}

          {/* Experience Grid with Console Terminal Theme */}
          {experiences.length > 0 && (
            <div className="print:break-inside-avoid">
              <h2 className={`${sectionHeaderStyle} border-zinc-300`}>
                <span className="text-indigo-600 font-bold mr-1">&gt;</span> ./experience.sh
              </h2>
              <div className="space-y-4">
                {experiences.map((exp) => (
                  <div key={exp.id} className="border-l-2 border-zinc-200 pl-3.5 print:break-inside-avoid">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-bold text-zinc-900 text-xs">{exp.role} <span className="text-indigo-600">@ {exp.company}</span></h3>
                      <span className="text-[10px] font-mono text-zinc-500">{exp.startDate} - {exp.current ? "Present" : exp.endDate}</span>
                    </div>
                    <p className="text-[10px] text-zinc-400 mb-2 italic">Loc: {exp.location}</p>
                    <ul className={`${bulletStyle} list-inside`}>
                      {exp.bullets.map((b, i) => b.trim() && (
                        <li key={i} className="text-zinc-600 pl-1"><span className="text-emerald-600 mr-1.5">•</span>{b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tech stack */}
          {skills.length > 0 && (
            <div className="print:break-inside-avoid">
              <h2 className={`${sectionHeaderStyle} border-zinc-300`}>
                <span className="text-indigo-600 font-bold mr-1">&gt;</span> ./skills.json
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {skills.map((grp) => (
                  <div key={grp.id} className="bg-zinc-100 border border-zinc-200 rounded p-2.5 print:bg-transparent print:p-0 print:border-none print:break-inside-avoid">
                    <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">{grp.category}</h4>
                    <div className="flex flex-wrap gap-1">
                      {grp.items.map((val, idx) => val.trim() && (
                        <span key={idx} className="bg-white text-zinc-850 px-2 py-0.5 border border-zinc-200 rounded text-[11px] font-semibold">
                          {val}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education & Projects combined */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Education */}
            {education.length > 0 && (
              <div className="print:break-inside-avoid">
                <h2 className={`${sectionHeaderStyle} border-zinc-300`}>
                  <span className="text-indigo-600 font-bold mr-1">&gt;</span> ./education.txt
                </h2>
                <div className="space-y-3">
                  {education.map((edu) => (
                    <div key={edu.id} className="text-xs">
                      <p className="font-bold text-zinc-800">{edu.degree} in {edu.field}</p>
                      <p className="text-indigo-600 font-semibold">{edu.institution}</p>
                      <p className="text-[10px] text-zinc-400 italic">{edu.location} | {edu.startDate} - {edu.current ? "Present" : edu.endDate}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications and Languages combined */}
            {(certifications.length > 0 || languages.length > 0) && (
              <div className="print:break-inside-avoid space-y-4">
                {certifications.length > 0 && (
                  <div>
                    <h2 className={`${sectionHeaderStyle} border-zinc-300`}>
                      <span className="text-indigo-600 font-bold mr-1">&gt;</span> certificates.cfg
                    </h2>
                    <ul className="text-xs text-zinc-600 space-y-1">
                      {certifications.map((c) => (
                        <li key={c.id} className="font-mono">
                          - <span className="font-bold text-zinc-800">{c.name}</span> <span className="text-zinc-400">({c.issuer})</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Projects */}
          {projects.length > 0 && (
            <div className="print:break-inside-avoid pt-1">
              <h2 className={`${sectionHeaderStyle} border-zinc-300`}>
                <span className="text-indigo-600 font-bold mr-1">&gt;</span> ./projects_list
              </h2>
              <div className="space-y-3">
                {projects.map((p) => (
                  <div key={p.id} className="border border-zinc-200 rounded p-2.5 bg-zinc-50/50 print:bg-transparent print:border-none print:p-0 print:break-inside-avoid">
                    <div className="flex flex-col gap-1 mb-1.5">
                      <div className="flex justify-between items-baseline">
                        <span className="font-bold text-zinc-800 text-xs">{p.title}</span>
                        <span className="text-[9px] font-mono text-zinc-400">[{p.technologies.slice(0, 3).join(", ")}]</span>
                      </div>
                      <div className="flex flex-wrap gap-x-3 gap-y-1">
                        {p.githubUrl && renderLink(p.githubUrl, <Github size={11} />)}
                        {p.liveUrl && renderLink(p.liveUrl, <Globe size={11} />)}
                      </div>
                    </div>
                    <p className="text-[11px] text-zinc-500 mb-1.5">{p.description}</p>
                    <ul className="list-none space-y-0.5 text-[11px] text-zinc-650">
                      {p.bullets.map((bl, bIdx) => bl.trim() && (
                        <li key={bIdx} className="pl-2 border-l-2 border-zinc-300">{bl}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const ResumePreview: FC<ResumePreviewProps> = (props) => {
  const isShort = props.theme === "modern-short" || props.theme === "formal-short" || props.theme === "split-sidebar";
  const marginHeightClass = isShort ? "h-[0.5cm]" : "h-[1.5cm]";
  const paddingXClass = isShort ? "print:px-[0.6cm]" : "print:px-[1.5cm]";

  return (
    <div className="w-full">
      {/* High-fidelity layout wrapper to hide system metadata completely and repeat perfect blank margins */}
      <table className="w-full border-collapse border-none m-0 p-0 table-fixed">
        <thead className="hidden print:table-header-group">
          <tr>
            <td className={`${marginHeightClass} border-none p-0`}></td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className={`p-0 border-none ${paddingXClass} align-top text-left`}>
              <ResumePreviewContent {...props} />
            </td>
          </tr>
        </tbody>
        <tfoot className="hidden print:table-footer-group">
          <tr>
            <td className={`${marginHeightClass} border-none p-0`}></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};
