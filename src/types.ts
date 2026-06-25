/**
 * Type declarations for the Resume Web App
 */

export interface PersonalInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  github: string;
  linkedin: string;
  rawSummary: string;
  photoUrl?: string;
  photoCropX?: number;
  photoCropY?: number;
  photoZoom?: number;
}

export interface Experience {
  id: string; // React key friendly
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  githubUrl: string;
  liveUrl: string;
  bullets: string[];
}

export interface SkillGroup {
  id: string;
  category: string;
  items: string[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

export interface Language {
  id: string;
  name: string;
  level: string; // e.g., Native, Fluent, Conversational
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  experiences: Experience[];
  education: Education[];
  projects: Project[];
  skills: SkillGroup[];
  certifications: Certification[];
  languages: Language[];
}

export type DesignTheme = "modern" | "executive" | "creative" | "developer" | "modern-short" | "formal-short" | "split-sidebar" | "pboom";

export const SAMPLE_RESUMES: Record<string, { label: string; data: ResumeData }> = {
  software_engineer: {
    label: "Software Engineer",
    data: {
      personalInfo: {
        name: "Alex Rivera",
        title: "Senior Full-Stack Engineer",
        email: "alex.rivera@devmail.com",
        phone: "+1 (555) 342-9901",
        location: "San Francisco, CA",
        website: "https://alexrivera.dev",
        github: "github.com/alexriveradev",
        linkedin: "linkedin.com/in/alex-rivera-dev",
        rawSummary: "Pragmatic Full-Stack Engineer with 6+ years of experience crafting high-performance, accessible web applications. Expert in TypeScript, React, and Node.js microservices. Proven track record of optimizing page load speeds by 40% and leading high-performing product delivery teams in fast-paced cloud environments.",
      },
      experiences: [
        {
          id: "exp-1",
          company: "CloudSynergy Inc.",
          role: "Senior Software Engineer",
          location: "San Francisco, CA",
          startDate: "Jan 2023",
          endDate: "Present",
          current: true,
          bullets: [
            "Architected and migrated legacy monolith to a Next.js / NestJS microservices suite, increasing API response times by 35% and system reliability to 99.99%.",
            "Designed and implemented active developer workspaces on React 18, enhancing dashboard responsiveness and boosting weekly interactive user engagement by 22%.",
            "Mentored 5 junior and mid-level web developers, conducting thorough code reviews and enforcing structured TypeScript typing standards.",
            "Spearheaded automated CI/CD pipeline consolidation with GitHub Actions, reducing manual build overhead times from 45 minutes to 8 minutes."
          ]
        },
        {
          id: "exp-2",
          company: "PixelCraft Labs",
          role: "Full-Stack Engineer",
          location: "Austin, TX",
          startDate: "Mar 2020",
          endDate: "Dec 2022",
          current: false,
          bullets: [
            "Engineered fluid consumer-facing checkout interfaces using React and Tailwind CSS, increasing aggregate payment processing conversions by 14%.",
            "Collaborated on designing secure RESTful API integrations in Node.js, managing seamless integrations with Stripe gateways and CRM hooks.",
            "Integrated comprehensive end-to-end testing infrastructure with Cypress and Jest, successfully increasing codebase test coverage from 60% up to 88%."
          ]
        }
      ],
      education: [
        {
          id: "edu-1",
          institution: "University of Texas at Austin",
          degree: "Bachelor of Science",
          field: "Computer Science",
          location: "Austin, TX",
          startDate: "Sep 2016",
          endDate: "May 2020",
          current: false,
        }
      ],
      projects: [
        {
          id: "proj-1",
          title: "ScribeFlow",
          description: "An offline-first markdown editing system with real-time browser preview modules and cloud sync.",
          technologies: ["React", "TypeScript", "IndexedDB", "Tailwind CSS"],
          githubUrl: "github.com/alexriveradev/scribeflow",
          liveUrl: "scribeflow-live.dev",
          bullets: [
            "Designed state synchronization engines using Web Workers to prevent frame drops during long typing sequences.",
            "Engineered modular custom markdown parsing tokens that reduced page load compilation times by 50% relative to standard NPM utilities."
          ]
        },
        {
          id: "proj-2",
          title: "NestSecure",
          description: "Token-based lightweight API gateway proxy configured for rates limiting and JWT credential authorization.",
          technologies: ["Node.js", "Express", "Redis", "Docker"],
          githubUrl: "github.com/alexriveradev/nestsecure",
          liveUrl: "",
          bullets: [
            "Developed strict rate-limiting middlewares using Redis token-leaky buckets to prevent denial-of-service attempts.",
            "Designed Docker configurations to scale containers seamlessly under high request congestion states."
          ]
        }
      ],
      skills: [
        {
          id: "skill-1",
          category: "Languages",
          items: ["TypeScript", "JavaScript (ES6+)", "Python", "HTML5/CSS3", "SQL"]
        },
        {
          id: "skill-2",
          category: "Libraries & Core",
          items: ["React", "Express", "Node.js", "Next.js", "GraphQL", "Tailwind CSS", "Redux Toolkit"]
        },
        {
          id: "skill-3",
          category: "Tooling & Infra",
          items: ["Git", "Docker", "AWS (S3, EC2)", "GitHub Actions", "Redis", "Vite", "Jest", "Cypress"]
        }
      ],
      certifications: [
        {
          id: "cert-1",
          name: "AWS Certified Solutions Architect",
          issuer: "Amazon Web Services",
          date: "Sep 2024"
        },
        {
          id: "cert-2",
          name: "Certified ScrumMaster (CSM)",
          issuer: "Scrum Alliance",
          date: "Feb 2022"
        }
      ],
      languages: [
        {
          id: "lang-1",
          name: "English",
          level: "Native"
        },
        {
          id: "lang-2",
          name: "Spanish",
          level: "Conversational"
        }
      ]
    }
  },
  product_manager: {
    label: "Product Manager",
    data: {
      personalInfo: {
        name: "Eleanor Vance",
        title: "Senior Product Manager",
        email: "eleanor.vance@prodmail.com",
        phone: "+1 (555) 781-2290",
        location: "New York, NY",
        website: "https://eleanorvance.co",
        github: "",
        linkedin: "linkedin.com/in/eleanorvance-product",
        rawSummary: "Impact-oriented Product Manager with 5+ years of experience steering high-visibility SaaS product pipelines. Trusted leader skilled at translating user research and complex multi-stakeholder requirements into precise backlogs. Proven track record of increasing customer lifetime value (LTV) by 30% and leading cohesive cross-functional agile teams.",
      },
      experiences: [
        {
          id: "exp-1",
          company: "StreamlineSaaS",
          role: "Senior Product Manager",
          location: "New York, NY",
          startDate: "Oct 2022",
          endDate: "Present",
          current: true,
          bullets: [
            "Spearheaded user onboarding redesign sequence, exceeding expected client conversions by 40% and shortening standard trial activation spans from 5 days to 2 days.",
            "Owned a $2M annual product development budget; engineered strategic quarterly maps aligning Engineering, Sales, and Marketing stakeholders.",
            "Created automated telemetry dashboards with Mixpanel, discovering actionable user churn trends to implement retention campaigns saving $45K/month in ARR."
          ]
        },
        {
          id: "exp-2",
          company: "MetricsForce Studios",
          role: "Growth Product Manager",
          location: "Chicago, IL",
          startDate: "Jun 2020",
          endDate: "Sep 2022",
          current: false,
          bullets: [
            "Conducted over 50 deep customer qualitative interviews, establishing critical design patterns that drove the development of 3 new product features.",
            "Launched localized marketing push campaigns across LATAM and EMEA, driving a 35% surge in monthly active user acquisitions in target areas."
          ]
        }
      ],
      education: [
        {
          id: "edu-1",
          institution: "Northwestern University",
          degree: "Master of Business Administration (MBA)",
          field: "Tech Administration & Marketing",
          location: "Evanston, IL",
          startDate: "Sep 2018",
          endDate: "Jun 2020",
          current: false,
        }
      ],
      projects: [
        {
          id: "proj-1",
          title: "OnboardPro Hub",
          description: "Interactive visual analytics engine providing targeted in-app tooltip wizards to self-activating enterprise leads.",
          technologies: ["Segment API", "Mixpanel", "Amplitude", "Figma Design"],
          githubUrl: "",
          liveUrl: "onboardpro-demo.ca",
          bullets: [
            "Achieved a 94% retention rating on test consumer cohorts utilizing customized guides.",
            "Streamlined cross-department review pipelines, cutting standard software requirement spec drafts assembly time in half."
          ]
        }
      ],
      skills: [
        {
          id: "skill-1",
          category: "Product Leadership",
          items: ["Agile/Scrum", "Product Roadmap Planning", "Data-Driven Decisions", "User Research", "Stakeholder Alignment"]
        },
        {
          id: "skill-2",
          category: "Analytics & Tools",
          items: ["Jira / Confluence", "Mixpanel", "Amplitude", "Google Analytics", "Figma", "SQL (Queries & Joins)", "Notion"]
        }
      ],
      certifications: [
        {
          id: "cert-1",
          name: "Pragmatic Certified Product Manager (Level VI)",
          issuer: "Pragmatic Institute",
          date: "Nov 2023"
        }
      ],
      languages: [
        {
          id: "lang-1",
          name: "English",
          level: "Native"
        },
        {
          id: "lang-2",
          name: "Mandarin Chinese",
          level: "Professional"
        }
      ]
    }
  }
};
