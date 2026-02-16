import { GoogleGenAI, Type } from "@google/genai";

function buildPrompt(input) {
  return `
You are a senior growth and customer-discovery analyst with access to Google Search. You MUST use Google Search to research the product and find REAL data. Do NOT rely on your training data alone.

CRITICAL RULES:
- You MUST search the internet for this product URL and understand what it does.
- You MUST search for REAL communities, subreddits, forums, and groups where this product's target audience actually exists RIGHT NOW.
- You MUST search for REAL people and conversations where someone is asking for a solution like this product.
- Every community name, subreddit, group, hashtag, and forum you mention MUST be a real, existing, currently active community that you found via search.
- Do NOT invent or hallucinate community names. If you cannot verify a community exists, do NOT include it.
- Do NOT provide generic or templated responses. Every piece of data must be specific to THIS product.

PRODUCT TO ANALYZE:
- URL: ${input.url}
- Optional description: ${input.description || "Not provided"}
- Target region: ${input.region || "Global"}
- Language: ${input.language || "English"}

RESEARCH STEPS (use Google Search for each):
1. Visit/research the product URL to understand what it does, who it's for, and what problem it solves.
2. Search for the product's target audience: where do they hang out online? Search for relevant subreddits, LinkedIn groups, X/Twitter communities, Discord servers, forums, Slack groups.
3. Search for people actively asking for solutions like this product. Find real search phrases, real forum threads, real questions.
4. Search for competitors and where they have presence.

REPORT STRUCTURE:
1. PERSONA: Identify the EXACT ideal customer based on your research. Include job titles, industry, technical level, and 3-5 specific pain points.
2. PLATFORMS (6-12): For each platform provide:
   - Real, verified community names (subreddits like r/startups, LinkedIn groups, X hashtags, Discord servers, forums)
   - Why THIS audience is specifically there (2-3 sentences based on your research)
   - bestPostTypes: 2-4 content types that work on this platform
   - frequency: recommended posting cadence
   - visibility, engagement, conversionIntent: High/Medium/Low
3. ADVANCED:
   - competitorPresence: Where competitors actually show up (based on search)
   - gaps: 3-5 real opportunities you found
   - keywordClusters: 5-10 real search terms people use
   - whatToSayExamples: 3-6 platform-specific examples
   - whoIsLookingForSolution: WHO is actively searching. Include real search phrases, real places they ask, real job titles.

OUTPUT: Return valid JSON only. Every data point must come from your web research. NEVER return generic data.
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
  required: ["persona", "platforms", "advanced"],
};

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

/**
 * Create the GoogleGenAI client.
 * Reads GEMINI_API_KEY from env. This key is free from Google AI Studio.
 */
function createAIClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
}

/**
 * Vercel serverless API: analyze product URL with Gemini + Google Search.
 * Gemini uses live Google Search to find real communities and real people.
 * No simulation — every data point comes from web research.
 *
 * Env: GEMINI_API_KEY (free from https://aistudio.google.com/apikey)
 */
export default async function handler(req, res) {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const ai = createAIClient();
  if (!ai) {
    return res.status(500).json({
      error: "GEMINI_API_KEY not configured. Get a free key from https://aistudio.google.com/apikey and add it in Vercel Environment Variables."
    });
  }

  const body = req.body || {};
  const { url, description, region, language, stream: useStream } = body;
  if (!url || typeof url !== "string" || !url.trim()) return res.status(400).json({ error: "url is required" });

  const input = {
    url: url.trim(),
    description: typeof description === "string" ? description : undefined,
    region: typeof region === "string" ? region : undefined,
    language: typeof language === "string" ? language : undefined,
  };

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
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json",
          responseSchema: RESPONSE_SCHEMA,
        },
      });
      for await (const chunk of stream) {
        const text = chunk?.text ?? "";
        if (text) {
          fullText += text;
          res.write(`data: ${JSON.stringify({ type: "chunk", text })}\n\n`);
        }
      }

      if (!fullText) {
        res.write(`data: ${JSON.stringify({ type: "error", message: "Gemini returned empty response. Please try again." })}\n\n`);
        res.end();
        return;
      }

      try {
        const report = JSON.parse(fullText);
        res.write(`data: ${JSON.stringify({ type: "done", report })}\n\n`);
      } catch {
        res.write(`data: ${JSON.stringify({ type: "error", message: "Failed to parse report. Please try again." })}\n\n`);
      }
      res.end();
      return;
    }

    // Non-streaming
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: buildPrompt(input),
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
      },
    });
    const text = response?.text;
    if (!text) return res.status(502).json({ error: "Gemini returned empty response. Please try again." });
    return res.status(200).json(JSON.parse(text));
  } catch (err) {
    const errMsg = err?.message || String(err);
    if (useStream) {
      res.write(`data: ${JSON.stringify({ type: "error", message: errMsg })}\n\n`);
      res.end();
    } else {
      return res.status(502).json({ error: errMsg });
    }
  }
}
