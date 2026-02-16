import { GoogleGenAI, Type } from "@google/genai";

const FALLBACK_REPORT = {
  persona: {
    title: "SaaS and Product Decision Maker",
    description: "Forward-thinking founder or operator looking for tools to scale, automate, and reach the right customers.",
    jobRoles: ["SaaS Founder", "Product Manager", "Tech Lead", "Growth Lead"],
    userType: "Founder",
    technicalLevel: "Semi-Technical",
    industry: "Software & Technology",
    painPoints: ["High customer acquisition cost", "Unclear where ideal users spend time", "Generic marketing that doesn't convert"],
  },
  platforms: [
    { name: "Reddit", communities: ["r/startups", "r/SaaS", "r/indiehackers"], importance: "Founders ask for tool recommendations.", bestPostTypes: ["AMA style", "How I solved X"], frequency: "2-3x per week", visibility: "High", engagement: "High", conversionIntent: "High" },
    { name: "X (Twitter)", communities: ["#buildinpublic", "#indiehackers"], importance: "Real-time founder community.", bestPostTypes: ["Threads", "Ship updates"], frequency: "Daily", visibility: "High", engagement: "High", conversionIntent: "High" },
  ],
  advanced: {
    competitorPresence: "Moderate in Reddit and LinkedIn.",
    gaps: ["Under-served in Reddit recommendation threads"],
    keywordClusters: ["SaaS marketing", "customer discovery", "founder tools"],
    whatToSayExamples: [{ platform: "Reddit", example: "I built [product] after spending months on [specific pain].", whyItWorks: "Relatable problem-solution." }],
    whoIsLookingForSolution: { summary: "SaaS founders looking for customer discovery tools.", searchPhrases: ["Where do my ideal customers hang out?"], whereTheyAsk: ["r/startups", "r/SaaS"], jobTitlesOrRoles: ["SaaS Founder", "Product Manager"] },
  },
};

function buildPrompt(input) {
  return `
You are a senior growth and customer-discovery analyst. Produce a PROFESSIONAL, HIGHLY DETAILED report that founders can use to find and reach their exact customers. This must NOT be generic; it must be specific to the product at the given URL.

PRODUCT TO ANALYZE:
- URL: ${input.url}
- Optional description: ${input.description || "Not provided"}
- Target region: ${input.region || "Global"}
- Language: ${input.language || "English"}

INSTRUCTIONS:
1. Infer or research what the product does (use the URL and description). Identify the EXACT ideal customer: job titles, industry, technical level, and 3-5 specific pain points they have that this product solves.
2. List 6-12 REAL platforms where these customers actually spend time. For each platform provide:
   - Full, real community names: subreddits (e.g. r/startups, r/SaaS), LinkedIn group names, X/Twitter hashtags and accounts, Discord server names, forums (e.g. Indie Hackers, Hacker News). Use ONLY real, discoverable names that exist.
   - A detailed "importance" sentence: why THIS audience is there, what they discuss, and how it fits this product (2-3 sentences).
   - bestPostTypes: 2-4 concrete content types that work on this platform.
   - frequency: recommended posting cadence.
   - visibility, engagement, conversionIntent: set appropriately (High/Medium/Low).
3. In "advanced":
   - competitorPresence: 1-2 sentences on where competitors show up.
   - gaps: 3-5 specific opportunities.
   - keywordClusters: 5-10 real search phrases and hashtags.
   - whatToSayExamples: 3-6 examples across different platforms.
   - whoIsLookingForSolution: REQUIRED. Identify who is ACTIVELY SEARCHING FOR the solution. Include: summary, searchPhrases, whereTheyAsk, jobTitlesOrRoles.

OUTPUT: Return valid JSON only. Be specific and actionable. NEVER return an error or non-JSON.
`;
}

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    persona: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        description: { type: Type.STRING },
        jobRoles: { type: Type.ARRAY, items: { type: Type.STRING } },
        userType: { type: Type.STRING },
        technicalLevel: { type: Type.STRING },
        industry: { type: Type.STRING },
        painPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      required: ["title", "description", "jobRoles", "userType", "technicalLevel", "industry", "painPoints"],
    },
    platforms: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          communities: { type: Type.ARRAY, items: { type: Type.STRING } },
          importance: { type: Type.STRING },
          bestPostTypes: { type: Type.ARRAY, items: { type: Type.STRING } },
          frequency: { type: Type.STRING },
          visibility: { type: Type.STRING },
          engagement: { type: Type.STRING },
          conversionIntent: { type: Type.STRING },
        },
        required: ["name", "communities", "importance", "bestPostTypes", "frequency", "visibility", "engagement", "conversionIntent"],
      },
    },
    strategies: {
      type: Type.OBJECT,
      properties: {
        organic: { type: Type.OBJECT, properties: {}, required: [] },
        paid: { type: Type.OBJECT, properties: {}, required: [] },
      },
      required: ["organic", "paid"],
    },
    advanced: {
      type: Type.OBJECT,
      properties: {
        competitorPresence: { type: Type.STRING },
        gaps: { type: Type.ARRAY, items: { type: Type.STRING } },
        keywordClusters: { type: Type.ARRAY, items: { type: Type.STRING } },
        whatToSayExamples: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: { platform: { type: Type.STRING }, example: { type: Type.STRING }, whyItWorks: { type: Type.STRING } },
            required: ["platform", "example", "whyItWorks"],
          },
        },
        whoIsLookingForSolution: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            searchPhrases: { type: Type.ARRAY, items: { type: Type.STRING } },
            whereTheyAsk: { type: Type.ARRAY, items: { type: Type.STRING } },
            jobTitlesOrRoles: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["summary", "searchPhrases", "whereTheyAsk", "jobTitlesOrRoles"],
        },
      },
      required: ["competitorPresence", "gaps", "keywordClusters", "whatToSayExamples", "whoIsLookingForSolution"],
    },
  },
  required: ["persona", "platforms", "strategies", "advanced"],
};

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

/**
 * Create the GoogleGenAI client.
 *
 * Supports two modes:
 * 1. Direct Gemini: set GEMINI_API_KEY
 * 2. Custom proxy (e.g. free-backed.web.app): set BACKEND_API_KEY and BACKEND_BASE_URL
 *
 * The proxy must be Gemini-API-compatible (same request/response format).
 */
function createAIClient() {
  const backendKey = process.env.BACKEND_API_KEY;
  const backendUrl = process.env.BACKEND_BASE_URL;
  const geminiKey = process.env.GEMINI_API_KEY;

  if (backendKey && backendUrl) {
    return new GoogleGenAI({ apiKey: backendKey, httpOptions: { baseUrl: backendUrl } });
  }
  if (backendKey) {
    return new GoogleGenAI({ apiKey: backendKey });
  }
  if (geminiKey) {
    return new GoogleGenAI({ apiKey: geminiKey });
  }
  return null;
}

/**
 * Vercel serverless API: analyze product URL with Gemini + Google Search.
 *
 * Env vars (set ONE pair):
 *   Option A — Your own backend proxy:
 *     BACKEND_API_KEY  = your free-backed API key (e.g. vck_...)
 *     BACKEND_BASE_URL = your backend URL (e.g. https://free-backed.web.app)
 *   Option B — Direct Gemini:
 *     GEMINI_API_KEY   = Google AI Studio key (AIzaSy...)
 */
export default async function handler(req, res) {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const ai = createAIClient();
  if (!ai) {
    return res.status(500).json({
      error: "No API key configured. Set BACKEND_API_KEY + BACKEND_BASE_URL (for your own backend) or GEMINI_API_KEY (for direct Gemini) in Vercel Environment Variables."
    });
  }

  const body = req.body || {};
  const { url, description, region, language, stream: useStream } = body;
  if (!url || typeof url !== "string" || !url.trim()) return res.status(400).json({ error: "url is required" });

  const input = { url: url.trim(), description: typeof description === "string" ? description : undefined, region: typeof region === "string" ? region : undefined, language: typeof language === "string" ? language : undefined };

  try {
    if (useStream) {
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache, no-transform");
      res.setHeader("Connection", "keep-alive");
      res.setHeader("X-Accel-Buffering", "no");
      res.status(200);
      if (typeof res.flushHeaders === "function") res.flushHeaders();

      let fullText = "";
      const stream = await ai.models.generateContentStream({
        model: "gemini-2.5-flash",
        contents: buildPrompt(input),
        config: { tools: [{ googleSearch: {} }], responseMimeType: "application/json", responseSchema: RESPONSE_SCHEMA },
      });
      for await (const chunk of stream) {
        const text = chunk?.text ?? "";
        if (text) {
          fullText += text;
          res.write(`data: ${JSON.stringify({ type: "chunk", text })}\n\n`);
        }
      }
      if (!fullText) res.write(`data: ${JSON.stringify({ type: "done", report: FALLBACK_REPORT })}\n\n`);
      else {
        try {
          res.write(`data: ${JSON.stringify({ type: "done", report: JSON.parse(fullText) })}\n\n`);
        } catch {
          res.write(`data: ${JSON.stringify({ type: "done", report: FALLBACK_REPORT })}\n\n`);
        }
      }
      res.end();
      return;
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: buildPrompt(input),
      config: { tools: [{ googleSearch: {} }], responseMimeType: "application/json", responseSchema: RESPONSE_SCHEMA },
    });
    const text = response?.text;
    if (!text) return res.status(200).json(FALLBACK_REPORT);
    return res.status(200).json(JSON.parse(text));
  } catch (err) {
    const errMsg = err?.message || String(err);
    if (useStream) {
      res.setHeader("Content-Type", "text/event-stream");
      res.status(200);
      res.write(`data: ${JSON.stringify({ type: "error", message: errMsg })}\n\n`);
      res.write(`data: ${JSON.stringify({ type: "done", report: FALLBACK_REPORT })}\n\n`);
      res.end();
    } else {
      return res.status(200).json(FALLBACK_REPORT);
    }
  }
}
