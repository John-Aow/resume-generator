import { useState, useEffect } from "react";
import {
  Mail, Phone, MapPin, Globe, Github, Linkedin, Briefcase, GraduationCap,
  Code, FolderGit, Award, Languages, Plus, Trash2, Sparkles, Download,
  Check, RefreshCw, Layers, Palette, Clipboard, Cpu, FileJson,
  ArrowRight, ExternalLink, HelpCircle, Save, BookOpen, AlertCircle,
  ALargeSmall, ListIndentIncrease, RotateCcw
} from "lucide-react";
import { ResumeData, SAMPLE_RESUMES, DesignTheme } from "./types";
import { ResumePreview } from "./components/ResumeTemplates";

// Safe ID Generator
const generateId = () => Math.random().toString(36).substring(2, 9);
const DEFAULT_FONT_SIZE = 100;
const DEFAULT_INDENT_SCALE = 100;
const clampFontSize = (value: number) => Math.min(120, Math.max(80, value));
const clampIndentScale = (value: number) => Math.min(150, Math.max(50, value));

export default function App() {
  // Application settings and theme loaded synchronously from localStorage or URL parameters
  const [theme, setTheme] = useState<DesignTheme>(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlTheme = params.get("theme");
      if (urlTheme) return urlTheme as DesignTheme;

      const savedTheme = localStorage.getItem("resume_theme");
      if (savedTheme) return savedTheme as DesignTheme;
    }
    return "modern";
  });

  const [accentColor, setAccentColor] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlAccent = params.get("accentColor");
      if (urlAccent) return urlAccent;

      const savedColor = localStorage.getItem("resume_accent_color");
      if (savedColor) return savedColor;
    }
    return "blue";
  });

  const [fontSize, setFontSize] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlFontSize = Number(params.get("fontSize"));
      if (Number.isFinite(urlFontSize) && urlFontSize > 0) {
        return clampFontSize(urlFontSize);
      }

      const savedFontSize = Number(localStorage.getItem("resume_font_size"));
      if (Number.isFinite(savedFontSize) && savedFontSize > 0) {
        return clampFontSize(savedFontSize);
      }
    }
    return DEFAULT_FONT_SIZE;
  });

  const [indentScale, setIndentScale] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlIndentScale = Number(params.get("indentScale"));
      if (Number.isFinite(urlIndentScale) && urlIndentScale > 0) {
        return clampIndentScale(urlIndentScale);
      }

      const savedIndentScale = Number(localStorage.getItem("resume_indent_scale"));
      if (Number.isFinite(savedIndentScale) && savedIndentScale > 0) {
        return clampIndentScale(savedIndentScale);
      }
    }
    return DEFAULT_INDENT_SCALE;
  });

  // Resume state pre-filled with Software Engineer draft or loaded synchronously from localStorage
  const [resumeData, setResumeData] = useState<ResumeData>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("resume_web_app_data");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (err) {
          console.error("Failed to parse saved resume from storage:", err);
        }
      }
    }
    return SAMPLE_RESUMES.software_engineer.data;
  });

  // Editor navigation
  const [activeTab, setActiveTab] = useState<string>("personal");

  // AI-related states
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [aiRawInput, setAiRawInput] = useState<string>("");
  const [aiError, setAiError] = useState<string>("");
  const [aiSuccessMessage, setAiSuccessMessage] = useState<string>("");

  // Interactive inline optimizer state
  const [optimizerTarget, setOptimizerTarget] = useState<{
    type: "bullet" | "summary";
    expId?: string;
    bulletIndex?: number;
    originalText: string;
    context?: string;
  } | null>(null);

  const [aiOptimizing, setAiOptimizing] = useState<boolean>(false);
  const [optAlternatives, setOptAlternatives] = useState<string[]>([]);
  const [optSingleText, setOptSingleText] = useState<string>("");
  const [optError, setOptError] = useState<string>("");

  // Export & Deployment variables
  const [showDeployGuide, setShowDeployGuide] = useState<boolean>(true);
  const [isSavedLocal, setIsSavedLocal] = useState<boolean>(false);
  const [isPrintMode, setIsPrintMode] = useState<boolean>(false);

  // Automatically persist selected theme to localStorage
  useEffect(() => {
    localStorage.setItem("resume_theme", theme);
  }, [theme]);

  // Automatically persist selected color accent to localStorage
  useEffect(() => {
    localStorage.setItem("resume_accent_color", accentColor);
  }, [accentColor]);

  // Automatically persist selected resume font size to localStorage
  useEffect(() => {
    localStorage.setItem("resume_font_size", String(fontSize));
  }, [fontSize]);

  // Automatically persist selected resume indent scale to localStorage
  useEffect(() => {
    localStorage.setItem("resume_indent_scale", String(indentScale));
  }, [indentScale]);

  // Automatically persist resume data whenever it is edited
  useEffect(() => {
    localStorage.setItem("resume_web_app_data", JSON.stringify(resumeData));
  }, [resumeData]);

  // Dynamically set page title when personal info name changes, ensuring printable files are named beautifully
  useEffect(() => {
    if (typeof window !== "undefined") {
      const candidateName = resumeData?.personalInfo?.name?.trim();
      document.title = candidateName ? `${candidateName} - Resume` : "Resume";
    }
  }, [resumeData?.personalInfo?.name]);

  // Load state parameters and detect print mode triggers
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("print") === "true") {
      setIsPrintMode(true);
      const urlTheme = params.get("theme");
      if (urlTheme) setTheme(urlTheme as DesignTheme);
      const urlAccent = params.get("accentColor");
      if (urlAccent) setAccentColor(urlAccent);
      const urlFontSize = Number(params.get("fontSize"));
      if (Number.isFinite(urlFontSize) && urlFontSize > 0) {
        setFontSize(clampFontSize(urlFontSize));
      }
      const urlIndentScale = Number(params.get("indentScale"));
      if (Number.isFinite(urlIndentScale) && urlIndentScale > 0) {
        setIndentScale(clampIndentScale(urlIndentScale));
      }

      // Let font downloading and browser rendering settle before auto-firing print
      const timer = setTimeout(() => {
        window.print();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Manual save to local storage indicator helper
  const handleSaveToLocalStorage = () => {
    localStorage.setItem("resume_web_app_data", JSON.stringify(resumeData));
    setIsSavedLocal(true);
    setTimeout(() => setIsSavedLocal(false), 3000);
  };

  // Safe handler to load predefined samples
  const handleLoadSample = (sampleKey: keyof typeof SAMPLE_RESUMES) => {
    const freshSample = JSON.parse(JSON.stringify(SAMPLE_RESUMES[sampleKey].data));
    setResumeData(freshSample);
    setAiSuccessMessage(`Loaded ${SAMPLE_RESUMES[sampleKey].label} profile successfully.`);
    setTimeout(() => setAiSuccessMessage(""), 4000);
  };

  // Helper selectors and updates
  const updatePersonalInfo = (field: keyof typeof resumeData.personalInfo, value: string) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }));
  };

  // 1. Experiences actions
  const addExperience = () => {
    const newExp = {
      id: "exp-" + generateId(),
      company: "New Company Inc.",
      role: "Software Professional",
      location: "San Francisco, CA",
      startDate: "Jan 2026",
      endDate: "Present",
      current: true,
      bullets: ["Developed software tools using TypeScript and React.", "Collaborated with team to deploy cloud microservices."]
    };
    setResumeData(prev => ({
      ...prev,
      experiences: [...prev.experiences, newExp]
    }));
  };

  const removeExperience = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      experiences: prev.experiences.filter(exp => exp.id !== id)
    }));
  };

  const updateExperience = (id: string, field: string, value: any) => {
    setResumeData(prev => ({
      ...prev,
      experiences: prev.experiences.map(exp => {
        if (exp.id === id) {
          return { ...exp, [field]: value };
        }
        return exp;
      })
    }));
  };

  const addExpBullet = (expId: string) => {
    setResumeData(prev => ({
      ...prev,
      experiences: prev.experiences.map(exp => {
        if (exp.id === expId) {
          return { ...exp, bullets: [...exp.bullets, "Accomplished a key delivery goal measured by metric benchmarks."] };
        }
        return exp;
      })
    }));
  };

  const removeExpBullet = (expId: string, idx: number) => {
    setResumeData(prev => ({
      ...prev,
      experiences: prev.experiences.map(exp => {
        if (exp.id === expId) {
          return { ...exp, bullets: exp.bullets.filter((_, bIdx) => bIdx !== idx) };
        }
        return exp;
      })
    }));
  };

  const updateExpBullet = (expId: string, idx: number, value: string) => {
    setResumeData(prev => ({
      ...prev,
      experiences: prev.experiences.map(exp => {
        if (exp.id === expId) {
          const freshBullets = [...exp.bullets];
          freshBullets[idx] = value;
          return { ...exp, bullets: freshBullets };
        }
        return exp;
      })
    }));
  };

  // 2. Education actions
  const addEducation = () => {
    const newEdu = {
      id: "edu-" + generateId(),
      institution: "State University",
      degree: "B.S.",
      field: "Computer Engineering",
      location: "Boston, MA",
      startDate: "Sep 2018",
      endDate: "May 2022",
      current: false
    };
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, newEdu]
    }));
  };

  const removeEducation = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  };

  const updateEducation = (id: string, field: string, value: any) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map(edu => {
        if (edu.id === id) {
          return { ...edu, [field]: value };
        }
        return edu;
      })
    }));
  };

  // 3. Projects actions
  const addProject = () => {
    const newProj = {
      id: "proj-" + generateId(),
      title: "Self-hosting Matrix Workspace",
      description: "A secure standalone notification engine leveraging Node proxies.",
      technologies: ["Node.js", "Docker", "Nginx"],
      githubUrl: "github.com/user/matrix-dns",
      liveUrl: "",
      bullets: ["Configured automatic server scaling hooks.", "Optimized static caching algorithms."]
    };
    setResumeData(prev => ({
      ...prev,
      projects: [...prev.projects, newProj]
    }));
  };

  const removeProject = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p.id !== id)
    }));
  };

  const updateProject = (id: string, field: string, value: any) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.map(p => {
        if (p.id === id) {
          return { ...p, [field]: value };
        }
        return p;
      })
    }));
  };

  const addProjBullet = (projId: string) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.map(p => {
        if (p.id === projId) {
          return { ...p, bullets: [...p.bullets, "Introduced structured error monitoring pipeline reducing crash logs by 15%."] };
        }
        return p;
      })
    }));
  };

  const removeProjBullet = (projId: string, idx: number) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.map(p => {
        if (p.id === projId) {
          return { ...p, bullets: p.bullets.filter((_, bIdx) => bIdx !== idx) };
        }
        return p;
      })
    }));
  };

  const updateProjBullet = (projId: string, idx: number, value: string) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.map(p => {
        if (p.id === projId) {
          const freshBullets = [...p.bullets];
          freshBullets[idx] = value;
          return { ...p, bullets: freshBullets };
        }
        return p;
      })
    }));
  };

  // 4. Skills actions
  const addSkillGroup = () => {
    const newGroup = {
      id: "skill-" + generateId(),
      category: "Tools & Clouds",
      items: ["Kubernetes", "AWS", "GitHub Actions"]
    };
    setResumeData(prev => ({
      ...prev,
      skills: [...prev.skills, newGroup]
    }));
  };

  const removeSkillGroup = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s.id !== id)
    }));
  };

  const updateSkillCategory = (id: string, cat: string) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.map(s => s.id === id ? { ...s, category: cat } : s)
    }));
  };

  const updateSkillItemsString = (id: string, commaString: string) => {
    const parsedList = commaString.split(",").map(val => val.trim());
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.map(s => s.id === id ? { ...s, items: parsedList } : s)
    }));
  };

  // 5. Certifications actions
  const addCertification = () => {
    const newCert = {
      id: "cert-" + generateId(),
      name: "CompTIA Security+",
      issuer: "CompTIA Association",
      date: "Nov 2025"
    };
    setResumeData(prev => ({
      ...prev,
      certifications: [...prev.certifications, newCert]
    }));
  };

  const removeCertification = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      certifications: prev.certifications.filter(c => c.id !== id)
    }));
  };

  const updateCertification = (id: string, field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      certifications: prev.certifications.map(c => c.id === id ? { ...c, [field]: value } : c)
    }));
  };

  // 6. Languages actions
  const addLanguage = () => {
    const newLang = {
      id: "lang-" + generateId(),
      name: "French",
      level: "Conversational"
    };
    setResumeData(prev => ({
      ...prev,
      languages: [...prev.languages, newLang]
    }));
  };

  const removeLanguage = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      languages: prev.languages.filter(l => l.id !== id)
    }));
  };

  const updateLanguage = (id: string, field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      languages: prev.languages.map(l => l.id === id ? { ...l, [field]: value } : l)
    }));
  };


  // ==================== CALL API: COMPILATION ====================
  const handleFullAIGenerate = async () => {
    if (!aiRawInput.trim()) {
      setAiError("Please supply some text, background outline, or old resume pastes first.");
      return;
    }

    setIsAiLoading(true);
    setAiError("");
    setAiSuccessMessage("");

    try {
      const response = await fetch("/api/gemini/generate-full", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawInput: aiRawInput })
      });

      if (!response.ok) {
        throw new Error(await response.text() || "Failed to contact resume compiler.");
      }

      const rawJson = await response.json();

      // Post-process response to ensure every element contains robust client-use IDs
      const mappedResult: ResumeData = {
        personalInfo: {
          name: rawJson.personalInfo?.name || "Expert Professional",
          title: rawJson.personalInfo?.title || "Target Job Role",
          email: rawJson.personalInfo?.email || "",
          phone: rawJson.personalInfo?.phone || "",
          location: rawJson.personalInfo?.location || "",
          website: rawJson.personalInfo?.website || "",
          github: rawJson.personalInfo?.github || "",
          linkedin: rawJson.personalInfo?.linkedin || "",
          rawSummary: rawJson.personalInfo?.rawSummary || "",
          photoUrl: rawJson.personalInfo?.photoUrl || ""
        },
        experiences: (rawJson.experiences || []).map((exp: any, idx: number) => ({
          ...exp,
          id: `exp-${generateId()}-${idx}`,
          bullets: exp.bullets || ["Delivered primary business operations milestones."]
        })),
        education: (rawJson.education || []).map((edu: any, idx: number) => ({
          ...edu,
          id: `edu-${generateId()}-${idx}`
        })),
        projects: (rawJson.projects || []).map((p: any, idx: number) => ({
          ...p,
          id: `proj-${generateId()}-${idx}`,
          technologies: p.technologies || [],
          bullets: p.bullets || ["Created primary software components."]
        })),
        skills: (rawJson.skills || []).map((s: any, idx: number) => ({
          ...s,
          id: `skill-${generateId()}-${idx}`,
          items: s.items || []
        })),
        certifications: (rawJson.certifications || []).map((c: any, idx: number) => ({
          ...c,
          id: `cert-${generateId()}-${idx}`,
          name: c.name || "Specialized Course Certificate",
          issuer: c.issuer || "",
          date: c.date || ""
        })),
        languages: (rawJson.languages || []).map((l: any, idx: number) => ({
          ...l,
          id: `lang-${generateId()}-${idx}`,
          name: l.name || "Global Communication Language",
          level: l.level || "Fluent"
        }))
      };

      setResumeData(mappedResult);
      setAiSuccessMessage("Fabulous! Gemini successfully parsed and structured your resume. Check your details in preview!");
      setAiRawInput("");
      setActiveTab("personal"); // Switch user back to fine-tune section
    } catch (err: any) {
      console.error(err);
      setAiError(err.message || "Something went wrong creating structural resume.");
    } finally {
      setIsAiLoading(false);
    }
  };


  // ==================== CALL API: ACTIVE INTEGRATION ====================
  const handleOpenBulletOptimizer = (type: "bullet" | "summary", originalText: string, context?: string, expId?: string, bulletIndex?: number) => {
    setOptimizerTarget({ type, originalText, context, expId, bulletIndex });
    setOptAlternatives([]);
    setOptSingleText("");
    setOptError("");
    setAiOptimizing(true);

    // Call API quickly
    fetch("/api/gemini/optimize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: originalText,
        context: context || "General professional resume context",
        type: type
      })
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(await res.text() || "Optimization API call failed.");
        }
        return res.json();
      })
      .then((data) => {
        if (type === "summary") {
          setOptSingleText(data.text);
        } else {
          setOptAlternatives(data.alternatives || [originalText]);
        }
      })
      .catch((err: any) => {
        console.error("Optimizer Error:", err);
        setOptError(err.message || "Failed to contact Gemini optimizer.");
      })
      .finally(() => {
        setAiOptimizing(false);
      });
  };

  const handleApplyOptimization = (chosenText: string) => {
    if (!optimizerTarget) return;

    if (optimizerTarget.type === "summary") {
      updatePersonalInfo("rawSummary", chosenText);
    } else if (optimizerTarget.type === "bullet" && optimizerTarget.expId !== undefined && optimizerTarget.bulletIndex !== undefined) {
      updateExpBullet(optimizerTarget.expId, optimizerTarget.bulletIndex, chosenText);
    }

    // Reset Optimizer modal state
    setOptimizerTarget(null);
  };

  // Helper trigger to export standard backups
  const downloadBackupJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(resumeData, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `resume_backup_${resumeData.personalInfo.name.toLowerCase().replace(/\s+/g, "_")}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  if (isPrintMode) {
    return (
      <div id="print-canvas" className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col items-center p-4 sm:p-10 select-none">
        {/* Helper print bar at the top, hidden when printing */}
        <div className="w-full max-w-[21cm] bg-white rounded-xl shadow-md border border-slate-200/80 p-4 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 print:hidden">
          <div className="space-y-1">
            <h1 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 uppercase tracking-wider">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              PDF Print Companion Active
            </h1>
            <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
              We've prepared your high-fidelity resume document. In the print dialog, choose **Destination: Save to PDF**, set **Margins: None**, and enable **Background Graphics** to render all custom branding colors perfectly!
            </p>
          </div>
          <div className="flex items-center gap-2.5 self-start md:self-auto shrink-0 z-10">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 text-xs bg-blue-600 hover:bg-blue-500 text-white font-bold px-3.5 py-2 rounded-lg transition shadow-sm cursor-pointer"
            >
              <Clipboard size={14} />
              <span>Trigger Print System</span>
            </button>
            <a
              href="/"
              onClick={(e) => {
                if (window.history.length > 1) {
                  e.preventDefault();
                  window.close();
                }
              }}
              className="flex items-center gap-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-bold px-3.5 py-2 rounded-lg transition"
            >
              Back to Editor
            </a>
          </div>
        </div>

          {/* Pure Resume Sheet */}
        <div className="w-full max-w-[210mm] bg-white print:p-0 print:shadow-none print:w-full print:border-none print:m-0 shadow-lg border border-slate-200 rounded-sm">
          <ResumePreview
            data={resumeData}
            theme={theme}
            accentColor={accentColor}
            fontSize={fontSize}
            indentScale={indentScale}
          />
        </div>
      </div>
    );
  }

  return (
    <div id="main-frame" className="min-h-screen bg-slate-900 text-slate-100 font-sans flex flex-col selection:bg-blue-500 selection:text-white">
      {/* Top Navigation Bar */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-6 py-3.5 flex justify-between items-center print-hide">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-2 rounded-xl text-white shadow-md shadow-blue-500/20">
            <Cpu size={20} className="animate-pulse" />
          </div>
          <div>
            <span className="text-xl font-extrabold text-white tracking-tight flex items-center gap-1.5 leading-none">
              Resume Generator
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-medium px-2 py-0.5 rounded-full uppercase">Live IDE</span>
            </span>
          </div>
        </div>

        {/* Global Toolbar */}
        <div className="flex items-center gap-3">
          {/* Quick loading state list */}
          <div className="hidden lg:flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg p-1">
            <span className="text-xs font-semibold text-slate-400 pl-2 pr-1 flex items-center gap-1">
              <BookOpen size={11} /> Profiles:
            </span>
            <button
              onClick={() => handleLoadSample("software_engineer")}
              className="text-xs font-semibold text-slate-200 hover:text-white px-2.5 py-1 hover:bg-slate-800 rounded-md transition"
            >
              Engineer
            </button>
            <span className="text-slate-800">|</span>
            <button
              onClick={() => handleLoadSample("product_manager")}
              className="text-xs font-semibold text-slate-200 hover:text-white px-2.5 py-1 hover:bg-slate-800 rounded-md transition"
            >
              Product Mgr
            </button>
          </div>

          <button
            onClick={handleSaveToLocalStorage}
            className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700 bg-slate-900 px-3 py-1.5 rounded-lg font-medium transition cursor-pointer"
          >
            {isSavedLocal ? (
              <>
                <Check size={14} className="text-emerald-400" />
                <span>Saved Local!</span>
              </>
            ) : (
              <>
                <Save size={14} />
                <span>Save Local</span>
              </>
            )}
          </button>

          <button
            onClick={downloadBackupJSON}
            title="Download full resume database backup as standard JSON metadata file"
            className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700 bg-slate-900 px-3 py-1.5 rounded-lg font-medium transition cursor-pointer"
          >
            <Download size={14} />
            <span className="hidden sm:inline">Export JSON</span>
          </button>

          <a
            href={`/resume-generator/?print=true&theme=${theme}&accentColor=${accentColor}&fontSize=${fontSize}&indentScale=${indentScale}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              // Ensure everything is fully saved to localStorage before opening
              localStorage.setItem("resume_web_app_data", JSON.stringify(resumeData));
              localStorage.setItem("resume_theme", theme);
              localStorage.setItem("resume_accent_color", accentColor);
              localStorage.setItem("resume_font_size", String(fontSize));
              localStorage.setItem("resume_indent_scale", String(indentScale));
            }}
            className="flex items-center gap-1.5 text-xs bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30 font-bold px-4 py-2 rounded-lg transition hover:scale-[1.02] cursor-pointer"
          >
            <Clipboard size={14} />
            <span>Generate PDF / Print</span>
          </a>
        </div>
      </header>

      {/* Main split viewport layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-65px)]">

        {/* ==================== LEFT VIEWPORT: FORM EDITORS & DEPLOYER (Col: 5) ==================== */}
        <section className="lg:col-span-5 bg-slate-950 border-r border-slate-800 flex flex-col print-hide max-h-[calc(100vh-65px)] overflow-y-auto">

          {/* Quick tab ribbon selector */}
          <nav className="flex flex-wrap border-b border-slate-800 bg-slate-900/60 p-2 gap-1 sticky top-0 z-30">
            <button
              onClick={() => setActiveTab("personal")}
              className={`flex-1 text-center py-2 px-1 text-xs font-medium rounded-lg transition flex flex-col items-center gap-1 min-w-[70px] ${activeTab === "personal" ? "bg-blue-600/20 text-blue-400 border border-blue-500/20" : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                }`}
            >
              <MapPin size={14} />
              <span>Personal</span>
            </button>
            <button
              onClick={() => setActiveTab("experience")}
              className={`flex-1 text-center py-2 px-1 text-xs font-medium rounded-lg transition flex flex-col items-center gap-1 min-w-[70px] ${activeTab === "experience" ? "bg-blue-600/20 text-blue-400 border border-blue-500/20" : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                }`}
            >
              <Briefcase size={14} />
              <span>Jobs</span>
            </button>
            <button
              onClick={() => setActiveTab("skills")}
              className={`flex-1 text-center py-2 px-1 text-xs font-medium rounded-lg transition flex flex-col items-center gap-1 min-w-[70px] ${activeTab === "skills" ? "bg-blue-600/20 text-blue-400 border border-blue-500/20" : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                }`}
            >
              <Code size={14} />
              <span>Skills</span>
            </button>
            <button
              onClick={() => setActiveTab("education")}
              className={`flex-1 text-center py-2 px-1 text-xs font-medium rounded-lg transition flex flex-col items-center gap-1 min-w-[70px] ${activeTab === "education" ? "bg-blue-600/20 text-blue-400 border border-blue-500/20" : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                }`}
            >
              <GraduationCap size={14} />
              <span>Edu & Cert</span>
            </button>
            <button
              onClick={() => setActiveTab("projects")}
              className={`flex-1 text-center py-2 px-1 text-xs font-medium rounded-lg transition flex flex-col items-center gap-1 min-w-[70px] ${activeTab === "projects" ? "bg-blue-600/20 text-blue-400 border border-blue-500/20" : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                }`}
            >
              <FolderGit size={14} />
              <span>Projects</span>
            </button>
          </nav>

          {/* Editor Contents Panel */}
          <div className="p-5 flex-1 space-y-6">

            {/* Success messages alerts */}
            {aiSuccessMessage && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs px-3.5 py-2.5 rounded-lg flex items-start gap-2">
                <Check size={14} className="mt-0.5 shrink-0" />
                <span>{aiSuccessMessage}</span>
              </div>
            )}

            {/* TAB: PERSONAL */}
            {activeTab === "personal" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                  <h3 className="font-extrabold text-white text-md flex items-center gap-2">
                    <MapPin size={16} className="text-blue-500" /> Personal Identity Details
                  </h3>
                  <span className="text-[10px] font-mono text-slate-500">SECTION_HEADER_1</span>
                </div>

                {/* Profile Photo Uploader */}
                <div className="bg-slate-950/40 border border-slate-800/60 p-3 rounded-lg flex items-center gap-4">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden bg-slate-850 border border-slate-700 flex items-center justify-center shrink-0">
                    {resumeData.personalInfo.photoUrl ? (
                      <img
                        src={resumeData.personalInfo.photoUrl}
                        alt="Profile Preview"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <span className="text-[10px] text-slate-500 font-bold uppercase">No Pic</span>
                    )}
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Profile Photo</label>
                    <div className="flex gap-2">
                      <label className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-[10px] px-2.5 py-1 rounded cursor-pointer transition select-none flex items-center gap-1">
                        Upload Image
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                updatePersonalInfo("photoUrl", reader.result as string);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                      {resumeData.personalInfo.photoUrl && (
                        <button
                          onClick={() => updatePersonalInfo("photoUrl", "")}
                          className="bg-slate-850 hover:bg-red-950/40 hover:text-red-400 text-slate-400 font-medium text-[10px] px-2.5 py-1 rounded transition cursor-pointer"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      placeholder="Or paste an image URL..."
                      value={resumeData.personalInfo.photoUrl || ""}
                      onChange={(e) => updatePersonalInfo("photoUrl", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-[10px] text-white focus:outline-none focus:border-blue-500 transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Full Name</label>
                    <input
                      type="text"
                      value={resumeData.personalInfo.name}
                      onChange={(e) => updatePersonalInfo("name", e.target.value)}
                      placeholder="Alex Rivera"
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Job Title</label>
                    <input
                      type="text"
                      value={resumeData.personalInfo.title}
                      onChange={(e) => updatePersonalInfo("title", e.target.value)}
                      placeholder="Senior Software Engineer"
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Email Address</label>
                    <input
                      type="email"
                      value={resumeData.personalInfo.email}
                      onChange={(e) => updatePersonalInfo("email", e.target.value)}
                      placeholder="alex.rivera@dev.com"
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Phone Number</label>
                    <input
                      type="text"
                      value={resumeData.personalInfo.phone}
                      onChange={(e) => updatePersonalInfo("phone", e.target.value)}
                      placeholder="+1 (555) 341-9901"
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Location</label>
                    <input
                      type="text"
                      value={resumeData.personalInfo.location}
                      onChange={(e) => updatePersonalInfo("location", e.target.value)}
                      placeholder="San Francisco, CA"
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Portfolio Website</label>
                    <input
                      type="text"
                      value={resumeData.personalInfo.website}
                      onChange={(e) => updatePersonalInfo("website", e.target.value)}
                      placeholder="https://alexrivera.dev"
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">GitHub URL / Username</label>
                    <input
                      type="text"
                      value={resumeData.personalInfo.github}
                      onChange={(e) => updatePersonalInfo("github", e.target.value)}
                      placeholder="github.com/alexriveradev"
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">LinkedIn Profile</label>
                    <input
                      type="text"
                      value={resumeData.personalInfo.linkedin}
                      onChange={(e) => updatePersonalInfo("linkedin", e.target.value)}
                      placeholder="linkedin.com/in/alex-rivera-dev"
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 transition"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest">Professional Bio Summary</label>
                  </div>
                  <textarea
                    rows={4}
                    value={resumeData.personalInfo.rawSummary}
                    onChange={(e) => updatePersonalInfo("rawSummary", e.target.value)}
                    placeholder="Brief professional profile summary..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-blue-500 transition resize-y font-sans leading-relaxed"
                  />
                  <p className="text-[10px] text-slate-500 italic mt-1">Recruiter-focused overview.</p>
                </div>
              </div>
            )}

            {/* TAB: EXPERIENCE */}
            {activeTab === "experience" && (
              <div className="space-y-5">
                <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                  <h3 className="font-extrabold text-white text-md flex items-center gap-2">
                    <Briefcase size={16} className="text-blue-500" /> Work History & Roles
                  </h3>
                  <button
                    onClick={addExperience}
                    className="text-[10px] font-bold bg-blue-600/30 text-blue-400 border border-blue-500/30 hover:bg-blue-600 hover:text-white px-2 py-1 rounded transition flex items-center gap-1 cursor-pointer"
                  >
                    <Plus size={11} /> Add Job
                  </button>
                </div>

                {resumeData.experiences.length === 0 ? (
                  <div className="text-center py-10 bg-slate-900 border border-slate-800 rounded-xl">
                    <p className="text-xs text-slate-400 mb-2">No work history active.</p>
                    <button onClick={addExperience} className="text-xs text-blue-400 hover:underline">Add fresh experience entry</button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {resumeData.experiences.map((exp, pIdx) => (
                      <div key={exp.id} className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-3 relative">
                        <button
                          onClick={() => removeExperience(exp.id)}
                          className="absolute right-3.5 top-3.5 text-slate-500 hover:text-red-400 transition"
                          title="Delete professional experience"
                        >
                          <Trash2 size={13} />
                        </button>

                        <span className="text-[10px] font-bold bg-slate-800 text-slate-400 px-2 py-0.5 rounded uppercase font-mono">Job #{pIdx + 1}</span>

                        <div className="grid grid-cols-2 gap-3.5">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Company</label>
                            <input
                              type="text"
                              value={exp.company}
                              onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Role / Job Title</label>
                            <input
                              type="text"
                              value={exp.role}
                              onChange={(e) => updateExperience(exp.id, "role", e.target.value)}
                              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">StartDate</label>
                            <input
                              type="text"
                              value={exp.startDate}
                              placeholder="e.g. Jun 2021"
                              onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)}
                              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs text-white focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">EndDate</label>
                            <input
                              type="text"
                              value={exp.endDate}
                              disabled={exp.current}
                              placeholder="e.g. Present"
                              onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)}
                              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs text-white focus:outline-none disabled:opacity-40"
                            />
                          </div>
                          <div className="flex items-center pt-4">
                            <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider cursor-pointer">
                              <input
                                type="checkbox"
                                checked={exp.current}
                                onChange={(e) => {
                                  updateExperience(exp.id, "current", e.target.checked);
                                  if (e.target.checked) updateExperience(exp.id, "endDate", "Present");
                                }}
                                className="rounded text-blue-600 focus:ring-0 cursor-pointer bg-slate-950"
                              />
                              <span>Current</span>
                            </label>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Location</label>
                          <input
                            type="text"
                            value={exp.location}
                            placeholder="e.g. San Francisco, CA"
                            onChange={(e) => updateExperience(exp.id, "location", e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none"
                          />
                        </div>

                        {/* Bullets Sub-section */}
                        <div className="pt-2 border-t border-slate-800 space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Accomplishment Bullets</span>
                            <button
                              onClick={() => addExpBullet(exp.id)}
                              className="text-[9px] bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-2 py-0.5 rounded transition flex items-center gap-0.5"
                            >
                              <Plus size={10} /> Add Bullet
                            </button>
                          </div>

                          <div className="space-y-1.5">
                            {exp.bullets.map((bullet, idx) => (
                              <div key={idx} className="flex gap-2 items-center bg-slate-950/80 p-1.5 rounded-lg border border-slate-800">
                                <span className="text-[10px] font-mono font-bold text-slate-500 w-4 pl-1">{idx + 1}.</span>
                                <input
                                  type="text"
                                  value={bullet}
                                  onChange={(e) => updateExpBullet(exp.id, idx, e.target.value)}
                                  className="flex-1 bg-transparent text-xs text-slate-200 border-none focus:outline-none"
                                />
                                <div className="flex items-center gap-1.5 shrink-0">
                                  <button
                                    onClick={() => removeExpBullet(exp.id, idx)}
                                    title="Delete bullet"
                                    className="text-slate-500 hover:text-red-400 p-1 hover:bg-slate-800 rounded transition"
                                  >
                                    <Trash2 size={11} />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB: SKILLS */}
            {activeTab === "skills" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                  <h3 className="font-extrabold text-white text-md flex items-center gap-2">
                    <Code size={16} className="text-blue-500" /> Technologies & Skills
                  </h3>
                  <button
                    onClick={addSkillGroup}
                    className="text-[10px] font-bold bg-blue-600/30 text-blue-400 border border-blue-500/30 hover:bg-blue-600 hover:text-white px-2 py-1 rounded transition flex items-center gap-1 cursor-pointer"
                  >
                    <Plus size={11} /> Add Group
                  </button>
                </div>

                <div className="space-y-4">
                  {resumeData.skills.map((grp) => (
                    <div key={grp.id} className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-3 relative">
                      <button
                        onClick={() => removeSkillGroup(grp.id)}
                        className="absolute right-3.5 top-3.5 text-slate-500 hover:text-red-400 transition"
                      >
                        <Trash2 size={13} />
                      </button>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Group Title (e.g. Back-end)</label>
                        <input
                          type="text"
                          value={grp.category}
                          onChange={(e) => updateSkillCategory(grp.id, e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Individual Skills (comma separated)</label>
                        <input
                          type="text"
                          value={grp.items.join(", ")}
                          onChange={(e) => updateSkillItemsString(grp.id, e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none font-sans"
                        />
                        <p className="text-[10px] text-slate-500 italic mt-1">Separate skills with commas (e.g., Python, Node.js, Django)</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: EDUCATION & CERTIFICATIONS */}
            {activeTab === "education" && (
              <div className="space-y-6">

                {/* Education section */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                    <h3 className="font-extrabold text-white text-md flex items-center gap-1.5">
                      <GraduationCap size={16} className="text-blue-500" /> Academic Qualifications
                    </h3>
                    <button
                      onClick={addEducation}
                      className="text-[10px] font-bold bg-blue-600/30 text-blue-400 px-2 py-0.5 rounded transition flex items-center gap-0.5"
                    >
                      <Plus size={10} /> Add Education
                    </button>
                  </div>

                  <div className="space-y-4">
                    {resumeData.education.map((edu, eIdx) => (
                      <div key={edu.id} className="bg-slate-900/60 p-4 border border-slate-500/10 rounded-xl space-y-3 relative">
                        <button
                          onClick={() => removeEducation(edu.id)}
                          className="absolute right-3.5 top-3.5 text-slate-500 hover:text-red-400 transition"
                        >
                          <Trash2 size={13} />
                        </button>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">School / Institution</label>
                            <input
                              type="text"
                              value={edu.institution}
                              onChange={(e) => updateEducation(edu.id, "institution", e.target.value)}
                              className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Degree Title</label>
                            <input
                              type="text"
                              value={edu.degree}
                              onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                              className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-xs"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Field of Study</label>
                            <input
                              type="text"
                              value={edu.field}
                              onChange={(e) => updateEducation(edu.id, "field", e.target.value)}
                              className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Location</label>
                            <input
                              type="text"
                              value={edu.location}
                              onChange={(e) => updateEducation(edu.id, "location", e.target.value)}
                              className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-xs"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">StartDate</label>
                            <input
                              type="text"
                              value={edu.startDate}
                              onChange={(e) => updateEducation(edu.id, "startDate", e.target.value)}
                              className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">EndDate</label>
                            <input
                              type="text"
                              value={edu.endDate}
                              onChange={(e) => updateEducation(edu.id, "endDate", e.target.value)}
                              className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-xs"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Certifications and Languages dual section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-800">
                  {/* Certifications list */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] font-bold text-indigo-400 uppercase flex items-center gap-1">
                        <Award size={13} /> Certificates
                      </span>
                      <button
                        onClick={addCertification}
                        className="text-[9px] bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-1.5 py-0.5 rounded"
                      >
                        + Add
                      </button>
                    </div>

                    <div className="space-y-2">
                      {resumeData.certifications.map((cert) => (
                        <div key={cert.id} className="bg-slate-900 border border-slate-800 p-2.5 rounded-lg space-y-1.5 relative">
                          <button
                            onClick={() => removeCertification(cert.id)}
                            className="absolute right-1 text-slate-500 hover:text-red-400"
                          >
                            <Trash2 size={11} />
                          </button>
                          <input
                            type="text"
                            value={cert.name}
                            onChange={(e) => updateCertification(cert.id, "name", e.target.value)}
                            placeholder="Name"
                            className="bg-transparent text-xs text-white border-b border-transparent focus:border-slate-700 w-[90%] focus:outline-none"
                          />
                          <div className="grid grid-cols-2 gap-1">
                            <input
                              type="text"
                              value={cert.issuer}
                              onChange={(e) => updateCertification(cert.id, "issuer", e.target.value)}
                              placeholder="Issuer"
                              className="bg-transparent text-[10px] text-slate-400 border-none focus:outline-none"
                            />
                            <input
                              type="text"
                              value={cert.date}
                              onChange={(e) => updateCertification(cert.id, "date", e.target.value)}
                              placeholder="Date"
                              className="bg-transparent text-[10px] text-slate-400 border-none text-right focus:outline-none"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Languages list */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] font-bold text-indigo-400 uppercase flex items-center gap-1">
                        <Languages size={13} /> Languages
                      </span>
                      <button
                        onClick={addLanguage}
                        className="text-[9px] bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-1.5 py-0.5 rounded"
                      >
                        + Add
                      </button>
                    </div>

                    <div className="space-y-2">
                      {resumeData.languages.map((lang) => (
                        <div key={lang.id} className="bg-slate-900 border border-slate-800 p-2 rounded-lg flex gap-1.5 items-center relative">
                          <input
                            type="text"
                            value={lang.name}
                            onChange={(e) => updateLanguage(lang.id, "name", e.target.value)}
                            placeholder="e.g. English"
                            className="bg-transparent text-xs text-white w-1/2 focus:outline-none"
                          />
                          <input
                            type="text"
                            value={lang.level}
                            onChange={(e) => updateLanguage(lang.id, "level", e.target.value)}
                            placeholder="e.g. Native"
                            className="bg-transparent text-[10px] text-indigo-400 w-1/3 focus:outline-none text-right font-semibold"
                          />
                          <button
                            onClick={() => removeLanguage(lang.id)}
                            className="absolute right-1.5 text-slate-500 hover:text-red-400"
                          >
                            <Trash2 size={11} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* TAB: PROJECTS */}
            {activeTab === "projects" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                  <h3 className="font-extrabold text-white text-md flex items-center gap-1.5">
                    <FolderGit size={16} className="text-blue-500" /> Showcase Projects
                  </h3>
                  <button
                    onClick={addProject}
                    className="text-[10px] font-bold bg-blue-600/30 text-blue-400 border border-blue-500/30 hover:bg-blue-600 hover:text-white px-2 py-1 rounded transition flex items-center gap-1 cursor-pointer"
                  >
                    <Plus size={11} /> Add Project
                  </button>
                </div>

                <div className="space-y-5">
                  {resumeData.projects.map((proj) => (
                    <div key={proj.id} className="bg-slate-900 p-4 border border-slate-800 rounded-xl space-y-3 relative">
                      <button
                        onClick={() => removeProject(proj.id)}
                        className="absolute right-3.5 top-3.5 text-slate-500 hover:text-red-400 transition"
                      >
                        <Trash2 size={13} />
                      </button>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Project Name</label>
                          <input
                            type="text"
                            value={proj.title}
                            onChange={(e) => updateProject(proj.id, "title", e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-xs text-white focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">GitHub / Code Repository</label>
                          <input
                            type="text"
                            value={proj.githubUrl}
                            placeholder="github.com/alex/scribeflow"
                            onChange={(e) => updateProject(proj.id, "githubUrl", e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-xs text-slate-200 focus:outline-none font-mono"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Core Technologies (comma series)</label>
                          <input
                            type="text"
                            value={proj.technologies.join(", ")}
                            onChange={(e) => {
                              const list = e.target.value.split(",").map(val => val.trim());
                              updateProject(proj.id, "technologies", list);
                            }}
                            className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-xs text-white focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Live URL Demo</label>
                          <input
                            type="text"
                            value={proj.liveUrl}
                            placeholder="scribeflow-live.co"
                            onChange={(e) => updateProject(proj.id, "liveUrl", e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-xs text-slate-200 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Short Elevator Pitch / Description</label>
                        <input
                          type="text"
                          value={proj.description}
                          onChange={(e) => updateProject(proj.id, "description", e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none"
                        />
                      </div>

                      {/* Project accomplishments bullets */}
                      <div className="pt-2 border-t border-slate-800 space-y-1.5">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-mono font-semibold text-slate-400">Accomplishment Points</span>
                          <button
                            onClick={() => addProjBullet(proj.id)}
                            className="text-[9px] bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-1.5 py-0.5 rounded"
                          >
                            + Add Bullet
                          </button>
                        </div>

                        {proj.bullets.map((b, bIdx) => (
                          <div key={bIdx} className="flex gap-2 items-center bg-slate-950/80 p-1 rounded-lg">
                            <span className="text-[10px] font-bold text-slate-500 pl-1">{bIdx + 1}</span>
                            <input
                              type="text"
                              value={b}
                              onChange={(e) => updateProjBullet(proj.id, bIdx, e.target.value)}
                              className="flex-1 bg-transparent text-xs text-slate-300 border-none focus:outline-none"
                            />
                            <button
                              onClick={() => removeProjBullet(proj.id, bIdx)}
                              className="text-slate-500 hover:text-red-400 p-0.5"
                            >
                              <Trash2 size={11} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </section>

        {/* ==================== RIGHT VIEWPORT: LIVE PREVIEW CANVAS (Col: 7) ==================== */}
        <section className="lg:col-span-7 bg-slate-900 p-4 sm:p-6 overflow-y-auto flex flex-col items-center">

          {/* Customizer Control Board sticky wrapper */}
          <div className="w-full max-w-2xl bg-slate-950 p-3 rounded-xl border border-slate-800/80 mb-5 flex flex-col gap-3 shadow-lg print-hide">

            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
              {/* Theme choices */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1"><Layers size={13} className="inline mr-1 text-blue-500" /> Theme:</span>
                <div className="bg-slate-900 border border-slate-800 p-0.5 rounded-lg flex flex-wrap gap-0.5">
                  {(["modern", "modern-short", "pboom", "executive", "formal-short", "split-sidebar", "creative", "developer"] as DesignTheme[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTheme(t)}
                      className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md transition ${theme === t ? "bg-slate-800 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
                        }`}
                    >
                      {t === "split-sidebar" ? "Split-Sidebar" : t === "formal-short" ? "Formal-Short" : t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Accent selection choices */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1"><Palette size={13} className="inline mr-1 text-indigo-500" /> Color:</span>
                <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1.5 gap-2">
                  {[
                    { name: "blue", bg: "bg-blue-500" },
                    { name: "emerald", bg: "bg-emerald-500" },
                    { name: "violet", bg: "bg-violet-500" },
                    { name: "rose", bg: "bg-rose-500" },
                    { name: "amber", bg: "bg-amber-500" },
                    { name: "slate", bg: "bg-slate-600" }
                  ].map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setAccentColor(c.name)}
                      title={`Select ${c.name} style`}
                      className={`w-3.5 h-3.5 rounded-full transition-transform hover:scale-125 ${c.bg} ${accentColor === c.name ? "ring-2 ring-white/60 scale-110" : "opacity-70"
                        }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Font size control */}
            <div className="grid grid-cols-1 gap-3 border-t border-slate-800 pt-3">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <div className="flex items-center justify-between sm:justify-start gap-2 sm:w-36">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">
                    <ALargeSmall size={13} className="inline mr-1 text-emerald-500" /> Font:
                  </span>
                  <span className="text-[10px] font-bold text-slate-200 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-md tabular-nums">
                    {fontSize}%
                  </span>
                </div>
                <input
                  type="range"
                  min="80"
                  max="120"
                  step="1"
                  value={fontSize}
                  onChange={(e) => setFontSize(clampFontSize(Number(e.target.value)))}
                  aria-label="Resume font size"
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <button
                  type="button"
                  onClick={() => setFontSize(DEFAULT_FONT_SIZE)}
                  title="Reset font size"
                  className="self-start sm:self-auto inline-flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800 bg-slate-900 rounded-md w-8 h-8 transition"
                >
                  <RotateCcw size={13} />
                </button>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <div className="flex items-center justify-between sm:justify-start gap-2 sm:w-36">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">
                    <ListIndentIncrease size={13} className="inline mr-1 text-cyan-500" /> Indent:
                  </span>
                  <span className="text-[10px] font-bold text-slate-200 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-md tabular-nums">
                    {indentScale}%
                  </span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="150"
                  step="1"
                  value={indentScale}
                  onChange={(e) => setIndentScale(clampIndentScale(Number(e.target.value)))}
                  aria-label="Resume indent scale"
                  className="w-full accent-cyan-500 cursor-pointer"
                />
                <button
                  type="button"
                  onClick={() => setIndentScale(DEFAULT_INDENT_SCALE)}
                  title="Reset indent scale"
                  className="self-start sm:self-auto inline-flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800 bg-slate-900 rounded-md w-8 h-8 transition"
                >
                  <RotateCcw size={13} />
                </button>
              </div>
            </div>
          </div>

          {/* Actual A4 Sized Sheet */}
          <div className="resume-a4-preview w-full max-w-[210mm] aspect-[210/297] shrink-0 overflow-hidden bg-white shadow-2xl rounded-sm">
            <ResumePreview
              data={resumeData}
              theme={theme}
              accentColor={accentColor}
              fontSize={fontSize}
              indentScale={indentScale}
            />
          </div>

          {/* Print advice footer */}
          <div className="w-full max-w-[21cm] mt-4 p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-[11px] text-justify text-indigo-300 print-hide flex gap-2">
            <HelpCircle size={14} className="mt-0.5 shrink-0" />
            <p>
              <strong>Print & Export Advice:</strong> Clicking **Generate PDF / Print** opens your native browser page compilation dialog. Choose **Destination: Save to PDF**, set **Margins: None**, and enable **Background Graphics** to capture the exact layout of your resume perfectly!
            </p>
          </div>
        </section>
      </div>

    </div>
  );
}
