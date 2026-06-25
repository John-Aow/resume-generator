import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3002;

// Enable JSON middleware for parsing request bodies
app.use(express.json({ limit: "10mb" }));

// Initialize the shared Gemini client on the server side
let ai: GoogleGenAI | null = null;
try {
  if (process.env.GEMINI_API_KEY) {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
} catch (err) {
  console.error("Failed to initialize GoogleGenAI client:", err);
}

// 1. API: Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Helper for checking Gemini client configuration
function getAiClient() {
  if (!ai) {
    throw new Error("GEMINI_API_KEY is not configured on the server. Please check your secrets.");
  }
  return ai;
}

// 2. API: Optimize a specific bullet point, bio, or experience description
app.post("/api/gemini/optimize", async (req, res) => {
  try {
    const client = getAiClient();
    const { text, context, type } = req.body;

    if (!text || typeof text !== "string") {
      res.status(400).json({ error: "Missing text to optimize." });
      return;
    }

    const systemPrompt = `You are a professional resume writer and career coach specialized in high-performance job applications.
Your job is to optimize the user's input of a resume bullet point, sentence, summary, or background details.
Maximize professional impact, clarity, action verbs, and quantify achievements wherever possible.
Adopt standard high-impact industry patterns (e.g., the Google "X-Y-Z formula": Accomplished [X] as measured by [Y], by doing [Z]). ${
      context ? `Context for this entry (e.g., job role, industry): ${context}` : ""
    }`;

    let instruction = "";
    if (type === "summary") {
      instruction = "Rewrite this draft professional summary/bio into a highly compelling, crisp 2-3 sentence overview targeting recruiters. Return a single pristine paragraph.";
    } else {
      instruction = "Rewrite this raw text into 3 distinct, alternative polished high-impact bullet points. Each alternative should demonstrate a slightly different angle (e.g., metrics-focused, tech stack/action-oriented, leadership/collaboration).";
    }

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        { text: instruction },
        { text: `Raw draft text: "${text}"` }
      ],
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.2, // Moderate temperature to keep output highly professional and relevant
        responseMimeType: type === "summary" ? "text/plain" : "application/json",
        responseSchema: type === "summary" ? undefined : {
          type: Type.OBJECT,
          properties: {
            alternatives: {
              type: Type.ARRAY,
              description: "Three distinct, excellent professional resume bullet points of different styles",
              items: { type: Type.STRING }
            }
          },
          required: ["alternatives"]
        }
      }
    });

    const resultText = response.text || "";
    
    if (type === "summary") {
      res.json({ text: resultText.trim() });
    } else {
      try {
        const parsed = JSON.parse(resultText);
        res.json(parsed);
      } catch (parseErr) {
        // Fallback parsing if JSON wasn't returned cleanly or model had a glitch
        console.error("Failed to parse JSON result, sending raw response:", resultText);
        const bulletAlternatives = resultText
          .split("\n")
          .map(line => line.replace(/^[-*•\d\s.]+/g, "").trim())
          .filter(Boolean)
          .slice(0, 3);
        res.json({ alternatives: bulletAlternatives.length > 0 ? bulletAlternatives : [resultText.trim()] });
      }
    }
  } catch (error: any) {
    console.error("Gemini optimization error:", error);
    res.status(500).json({ error: error.message || "Failed to contact Gemini API." });
  }
});

// 3. API: Generate Complete Resume from messy info or old pasting
app.post("/api/gemini/generate-full", async (req, res) => {
  try {
    const client = getAiClient();
    const { rawInput } = req.body;

    if (!rawInput || typeof rawInput !== "string") {
      res.status(400).json({ error: "Missing biographical input." });
      return;
    }

    const systemPrompt = `You are an expert resume compiler. You take raw, unorganized textual information about a person's life, career, projects, or background, and transform it into a gorgeous, fully structured career resume schema.
Fill in gaps professionally, invent plausible details if necessary but keep descriptions highly aligned and truthful to the input. Ensure dates follow a standard "MMM YYYY" format or similar. Group skills into cohesive categories (e.g. "Languages", "Frontend", "Certifications").`;

    const resumeSchema = {
      type: Type.OBJECT,
      properties: {
        personalInfo: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            title: { type: Type.STRING, description: "Professional target job title" },
            email: { type: Type.STRING },
            phone: { type: Type.STRING },
            location: { type: Type.STRING, description: "City, State or City, Country" },
            website: { type: Type.STRING },
            github: { type: Type.STRING, description: "Deduce username or provide placeholder" },
            linkedin: { type: Type.STRING, description: "Deduce username or provide placeholder" },
            rawSummary: { type: Type.STRING, description: "Compelling professional bio summary statement" }
          },
          required: ["name", "title", "rawSummary"]
        },
        experiences: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              company: { type: Type.STRING },
              role: { type: Type.STRING },
              location: { type: Type.STRING },
              startDate: { type: Type.STRING, description: "e.g., Jun 2021" },
              endDate: { type: Type.STRING, description: "e.g., Present or Dec 2024" },
              current: { type: Type.BOOLEAN },
              bullets: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "3-4 standard, high-impact bullet points using strong action verbs"
              }
            },
            required: ["company", "role", "startDate", "endDate", "bullets"]
          }
        },
        education: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              institution: { type: Type.STRING },
              degree: { type: Type.STRING, description: "e.g., Bachelor of Science" },
              field: { type: Type.STRING, description: "e.g., Computer Science" },
              location: { type: Type.STRING },
              startDate: { type: Type.STRING },
              endDate: { type: Type.STRING },
              current: { type: Type.BOOLEAN }
            },
            required: ["institution", "degree", "field", "startDate", "endDate"]
          }
        },
        projects: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING, description: "Brief core description of what it is" },
              technologies: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "A list of 3-5 tech keywords"
              },
              githubUrl: { type: Type.STRING },
              liveUrl: { type: Type.STRING },
              bullets: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "2-3 high-impact accomplishments within this project"
              }
            },
            required: ["title", "description", "technologies", "bullets"]
          }
        },
        skills: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              category: { type: Type.STRING, description: "e.g. Languages, Frontend, Tools" },
              items: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Individual skills inside this category"
              }
            },
            required: ["category", "items"]
          }
        },
        certifications: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              issuer: { type: Type.STRING },
              date: { type: Type.STRING }
            },
            required: ["name"]
          }
        },
        languages: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              level: { type: Type.STRING, description: "e.g. Native, Fluent, Conversational" }
            },
            required: ["name", "level"]
          }
        }
      },
      required: ["personalInfo", "experiences", "education", "skills", "projects"]
    };

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        { text: "Transform the following career details into the schema strictly, filling blanks professionally:" },
        { text: rawInput }
      ],
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.2,
        responseMimeType: "application/json",
        responseSchema: resumeSchema
      }
    });

    const outputText = response.text || "{}";
    res.json(JSON.parse(outputText));
  } catch (error: any) {
    console.error("Gemini full compilation error:", error);
    res.status(500).json({ error: error.message || "Failed to generate structured resume." });
  }
});

// Vite middleware flow for web app serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production serving: point to built client assets
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Resume Web App] Server boot complete. Listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
