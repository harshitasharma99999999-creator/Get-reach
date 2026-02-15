import { AnalysisInput, ReachReport } from "../types";

/** Base URL for the analyze API. Same-origin when deployed (Vercel); localhost uses env override or same-origin with `vercel dev`. */
function getAnalyzeUrl(): string {
  if (typeof window !== "undefined" && window.location?.origin) {
    const envUrl = import.meta.env.VITE_ANALYZE_API_URL;
    if (envUrl && typeof envUrl === "string") return envUrl;
    return `${window.location.origin}/api/analyze`;
  }
  return "/api/analyze";
}

const FALLBACK_REPORT: ReachReport = {
  persona: {
    title: "SaaS and Product Decision Maker",
    description: "Forward-thinking founder or operator looking for tools to scale, automate, and reach the right customers. Often evaluates tools based on ROI and time-to-value.",
    jobRoles: ["SaaS Founder", "Product Manager", "Tech Lead", "Growth Lead"],
    userType: 'Founder',
    technicalLevel: 'Semi-Technical',
    industry: "Software & Technology",
    painPoints: ["High customer acquisition cost", "Unclear where ideal users spend time", "Generic marketing that doesn't convert", "Lack of actionable channel data"]
  },
  platforms: [
    {
      name: "Reddit",
      communities: ["r/startups", "r/SaaS", "r/indiehackers", "r/Entrepreneur", "r/smallbusiness"],
      importance: "Founders and operators actively ask for tool recommendations and share what works. High intent when they mention pain points your product solves.",
      bestPostTypes: ["AMA style", "How I solved X", "Tool comparison threads"],
      frequency: "2-3x per week",
      visibility: 'High',
      engagement: 'High',
      conversionIntent: 'High'
    },
    {
      name: "LinkedIn",
      communities: ["SaaS Growth Network", "Indie Builders", "Product-Led Growth", "B2B SaaS Community"],
      importance: "B2B decision-makers and founders. Best for authority building and longer-form content that drives demos.",
      bestPostTypes: ["Case studies", "Data-backed insights", "Founder story"],
      frequency: "3-5x per week",
      visibility: 'Medium',
      engagement: 'High',
      conversionIntent: 'Medium'
    },
    {
      name: "X (Twitter)",
      communities: ["#buildinpublic", "#indiehackers", "#saas", "#startups"],
      importance: "Real-time founder and builder community. Strong for launch buzz and direct DMs.",
      bestPostTypes: ["Threads", "Polls", "Ship updates"],
      frequency: "Daily",
      visibility: 'High',
      engagement: 'High',
      conversionIntent: 'High'
    },
    {
      name: "Indie Hackers",
      communities: ["Indie Hackers Forum", "Product Hunt", "Launch threads"],
      importance: "Indie founders actively looking for tools and sharing wins. High intent.",
      bestPostTypes: ["Launch post", "Revenue story", "Tool stack"],
      frequency: "1-2x per week",
      visibility: 'Medium',
      engagement: 'High',
      conversionIntent: 'High'
    }
  ],
  advanced: {
    competitorPresence: "Moderate in Reddit and LinkedIn; less saturation in niche Discord and community forums. Opportunity in vertical-specific communities.",
    gaps: ["Under-served in Reddit recommendation threads", "Few comparison posts on LinkedIn", "Missing in YouTube 'tools I use' content"],
    keywordClusters: ["SaaS marketing", "customer discovery", "founder tools", "growth stack", "indie hacker tools", "PLG"],
    whatToSayExamples: [
      { platform: "Reddit", example: "I built [product] after spending months on [specific pain]. Here's what changed for us — happy to answer questions.", whyItWorks: "Relatable problem-solution; invites conversation." },
      { platform: "LinkedIn", example: "We cut [metric] by X% using [approach]. Key lesson: [insight]. What's working for you?", whyItWorks: "Data + open question drives comments." },
      { platform: "X (Twitter)", example: "Ship: We just launched [feature] for [audience]. Try it: [link]. Feedback welcome.", whyItWorks: "Short, clear CTA; build-in-public vibe." }
    ],
    whoIsLookingForSolution: {
      summary: "SaaS founders, product managers, and growth leads who are actively looking for tools to find where their ideal customers are. They ask for recommendations in Reddit, Indie Hackers, and X, and search for terms like 'customer discovery' and 'where to find my customers'.",
      searchPhrases: ["Where do my ideal customers hang out online?", "Best tools for customer discovery", "How to find my target audience on Reddit", "Customer acquisition channels for SaaS", "Indie hacker marketing communities"],
      whereTheyAsk: ["r/startups", "r/SaaS", "Indie Hackers", "X #buildinpublic", "LinkedIn growth groups"],
      jobTitlesOrRoles: ["SaaS Founder", "Product Manager", "Growth Lead", "Indie Hacker", "Marketing Lead"]
    }
  }
};

export interface FetchReportOptions {
  /** Use SSE streaming; report is returned when stream completes. */
  stream?: boolean;
  /** Called when a text chunk arrives (for progress UI). */
  onChunk?: (text: string) => void;
}

/**
 * Fetch a Reach report from the backend API.
 * The API runs Gemini with Google Search grounding to find who is looking for the solution across the internet.
 * Set options.stream = true for SSE streaming; the report is returned when the stream completes.
 */
export const fetchReportFromAPI = async (
  input: AnalysisInput,
  options?: FetchReportOptions
): Promise<ReachReport> => {
  const useStream = options?.stream === true;

  try {
    const res = await fetch(getAnalyzeUrl(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: input.url,
        description: input.description,
        region: input.region,
        language: input.language,
        stream: useStream,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: res.statusText }));
      throw new Error(err?.error || `API error ${res.status}`);
    }

    if (useStream && res.body) {
      return await consumeSSEStream(res, options?.onChunk);
    }

    const report = await res.json();
    return report as ReachReport;
  } catch {
    return FALLBACK_REPORT;
  }
};

/** Parse SSE stream from the analyze API and return the final report. */
async function consumeSSEStream(
  res: Response,
  onChunk?: (text: string) => void
): Promise<ReachReport> {
  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      if (line.startsWith("data: ")) {
        try {
          const payload = JSON.parse(line.slice(6));
          if (payload.type === "chunk" && payload.text) {
            onChunk?.(payload.text);
          } else if (payload.type === "done" && payload.report) {
            return payload.report as ReachReport;
          }
        } catch {
          // ignore parse errors for malformed chunks
        }
      }
    }
  }

  // fallback if stream ended without done event
  return FALLBACK_REPORT;
}
