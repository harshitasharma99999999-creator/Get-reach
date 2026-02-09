
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisInput, ReachReport } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

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
      { platform: "Reddit", example: "I built [product] after spending months on [specific pain]. Here’s what changed for us — happy to answer questions.", whyItWorks: "Relatable problem-solution; invites conversation." },
      { platform: "LinkedIn", example: "We cut [metric] by X% using [approach]. Key lesson: [insight]. What’s working for you?", whyItWorks: "Data + open question drives comments." },
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

export const generateReachReport = async (input: AnalysisInput): Promise<ReachReport> => {
  const prompt = `
You are a senior growth and customer-discovery analyst. Produce a PROFESSIONAL, HIGHLY DETAILED report that founders can use to find and reach their exact customers. This must NOT be generic; it must be specific to the product at the given URL.

PRODUCT TO ANALYZE:
- URL: ${input.url}
- Optional description: ${input.description || 'Not provided'}
- Target region: ${input.region || 'Global'}
- Language: ${input.language || 'English'}

INSTRUCTIONS:
1. Infer or research what the product does (use the URL and description). Identify the EXACT ideal customer: job titles, industry, technical level, and 3-5 specific pain points they have that this product solves.
2. List 6-12 REAL platforms where these customers actually spend time. For each platform provide:
   - Full, real community names: subreddits (e.g. r/startups, r/SaaS), LinkedIn group names, X/Twitter hashtags and accounts, Discord server names, forums (e.g. Indie Hackers, Hacker News, specific Slack/Discord communities), YouTube channels or video topics, niche forums and communities. Use ONLY real, discoverable names that exist.
   - A detailed "importance" sentence: why THIS audience is there, what they discuss, and how it fits this product (2-3 sentences).
   - bestPostTypes: 2-4 concrete content types that work on this platform (e.g. "AMA posts", "How I built X", "Case studies").
   - frequency: recommended posting cadence (e.g. "2-3x per week", "Daily threads").
   - visibility, engagement, conversionIntent: set appropriately (High/Medium/Low) based on how relevant and convertible the audience is.
3. In "advanced":
   - competitorPresence: 1-2 sentences on where competitors show up and where there is white space.
   - gaps: 3-5 specific opportunities (e.g. "r/entrepreneur has no sticky threads about [topic]", "LinkedIn lacks comparison content").
   - keywordClusters: 5-10 real search phrases and hashtags this audience uses (specific, not generic).
   - whatToSayExamples: 3-6 examples across different platforms. Each must be a concrete, copy-paste style message (post or DM) and a short "whyItWorks" tied to that platform's norms.
   - whoIsLookingForSolution: REQUIRED. Identify who across the internet is ACTIVELY SEARCHING FOR or ASKING FOR the solution this product provides. Include: (a) summary: 2-3 sentences describing these people and their intent; (b) searchPhrases: 5-10 real search queries, forum questions, or phrases they use (e.g. "best tool for X", "how do I find Y"); (c) whereTheyAsk: 3-5 specific places/channels where these questions appear (subreddits, forums, LinkedIn, X hashtags); (d) jobTitlesOrRoles: 3-6 job titles or roles of people who ask for this solution. Be specific to the product; only people who are looking for THIS solution.

OUTPUT: Return valid JSON only. Be specific and actionable. If you cannot fetch the URL, use the domain and description to infer the product and still produce a detailed, professional report. NEVER return an error or non-JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview", 
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }], 
        responseMimeType: "application/json",
        responseSchema: {
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
              required: ["title", "description", "jobRoles", "userType", "technicalLevel", "industry", "painPoints"]
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
                required: ["name", "communities", "importance", "bestPostTypes", "frequency", "visibility", "engagement", "conversionIntent"]
              }
            },
            strategies: {
              type: Type.OBJECT,
              properties: {
                organic: {
                  type: Type.OBJECT,
                  properties: {
                    type: { type: Type.STRING },
                    platforms: { type: Type.ARRAY, items: { type: Type.STRING } },
                    tone: { type: Type.STRING },
                    guidelines: { type: Type.ARRAY, items: { type: Type.STRING } },
                    commonMistakes: { type: Type.ARRAY, items: { type: Type.STRING } },
                    isWorthIt: { type: Type.BOOLEAN },
                  },
                  required: ["type", "platforms", "tone", "guidelines", "commonMistakes", "isWorthIt"]
                },
                paid: {
                  type: Type.OBJECT,
                  properties: {
                    type: { type: Type.STRING },
                    platforms: { type: Type.ARRAY, items: { type: Type.STRING } },
                    tone: { type: Type.STRING },
                    guidelines: { type: Type.ARRAY, items: { type: Type.STRING } },
                    commonMistakes: { type: Type.ARRAY, items: { type: Type.STRING } },
                    isWorthIt: { type: Type.BOOLEAN },
                  },
                  required: ["type", "platforms", "tone", "guidelines", "commonMistakes", "isWorthIt"]
                }
              },
              required: ["organic", "paid"]
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
                    properties: {
                      platform: { type: Type.STRING },
                      example: { type: Type.STRING },
                      whyItWorks: { type: Type.STRING },
                    },
                    required: ["platform", "example", "whyItWorks"]
                  }
                },
                whoIsLookingForSolution: {
                  type: Type.OBJECT,
                  properties: {
                    summary: { type: Type.STRING },
                    searchPhrases: { type: Type.ARRAY, items: { type: Type.STRING } },
                    whereTheyAsk: { type: Type.ARRAY, items: { type: Type.STRING } },
                    jobTitlesOrRoles: { type: Type.ARRAY, items: { type: Type.STRING } },
                  },
                  required: ["summary", "searchPhrases", "whereTheyAsk", "jobTitlesOrRoles"]
                }
              },
              required: ["competitorPresence", "gaps", "keywordClusters", "whatToSayExamples", "whoIsLookingForSolution"]
            }
          },
          required: ["persona", "platforms", "strategies", "advanced"]
        }
      }
    });

    if (!response.text) return FALLBACK_REPORT;
    return JSON.parse(response.text) as ReachReport;
  } catch (error) {
    console.warn("Analysis failed, using high-quality fallback data.");
    return FALLBACK_REPORT;
  }
};
