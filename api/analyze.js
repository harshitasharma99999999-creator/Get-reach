import { GoogleGenAI } from "@google/genai";

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

REPORT STRUCTURE (return as JSON):
{
  "persona": {
    "title": "string",
    "description": "string",
    "jobRoles": ["string"],
    "userType": "Founder|Consumer|Business Owner|Developer",
    "technicalLevel": "Non-Technical|Semi-Technical|Technical",
    "industry": "string",
    "painPoints": ["string"]
  },
  "platforms": [
    {
      "name": "string",
      "communities": ["real community names"],
      "importance": "2-3 sentence explanation",
      "bestPostTypes": ["string"],
      "frequency": "string",
      "visibility": "High|Medium|Low",
      "engagement": "High|Medium|Low",
      "conversionIntent": "High|Medium|Low"
    }
  ],
  "advanced": {
    "competitorPresence": "string",
    "gaps": ["string"],
    "keywordClusters": ["string"],
    "whatToSayExamples": [
      { "platform": "string", "example": "string", "whyItWorks": "string" }
    ],
    "whoIsLookingForSolution": {
      "summary": "string",
      "searchPhrases": ["string"],
      "whereTheyAsk": ["string"],
      "jobTitlesOrRoles": ["string"]
    }
  }
}

Return ONLY valid JSON. No markdown, no code fences, no explanation — just the JSON object. Every data point must come from your web research.
`;
}

/**
 * Extract JSON from a text response that may contain markdown fences or extra text.
 */
function extractJSON(text) {
  let cleaned = text.trim();
  // Remove markdown code fences if present
  const fenceMatch = cleaned.match(/```(?:json)?\s*\n?([\s\S]*?)\n?\s*```/);
  if (fenceMatch) cleaned = fenceMatch[1].trim();
  // Find the outermost { ... }
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start !== -1 && end > start) {
    cleaned = cleaned.substring(start, end + 1);
  }
  return JSON.parse(cleaned);
}

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function createAIClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
}

/**
 * Vercel serverless API: analyze product URL with Gemini + live Google Search.
 * Google Search grounding is enabled so Gemini searches the real internet.
 * No responseMimeType/responseSchema (incompatible with googleSearch tool).
 * JSON is extracted from the text response instead.
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

  const geminiConfig = {
    tools: [{ googleSearch: {} }],
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
        config: geminiConfig,
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
        const report = extractJSON(fullText);
        res.write(`data: ${JSON.stringify({ type: "done", report })}\n\n`);
      } catch {
        res.write(`data: ${JSON.stringify({ type: "error", message: "Failed to parse the analysis report. Please try again." })}\n\n`);
      }
      res.end();
      return;
    }

    // Non-streaming
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: buildPrompt(input),
      config: geminiConfig,
    });
    const text = response?.text;
    if (!text) return res.status(502).json({ error: "Gemini returned empty response. Please try again." });
    const report = extractJSON(text);
    return res.status(200).json(report);
  } catch (err) {
    const errMsg = err?.message || String(err);
    if (useStream) {
      try { res.write(`data: ${JSON.stringify({ type: "error", message: errMsg })}\n\n`); } catch {}
      try { res.end(); } catch {}
    } else {
      return res.status(502).json({ error: errMsg });
    }
  }
}
