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

export interface FetchReportOptions {
  /** Use SSE streaming; report is returned when stream completes. */
  stream?: boolean;
  /** Called when a text chunk arrives (for progress UI). */
  onChunk?: (text: string) => void;
}

/**
 * Fetch a Reach report from the backend API.
 * The API runs Gemini with Google Search grounding — it searches the real internet
 * for communities, forums, and people looking for the solution. No simulation.
 *
 * Throws an Error if the API fails so the UI can show a real error message.
 */
export const fetchReportFromAPI = async (
  input: AnalysisInput,
  options?: FetchReportOptions
): Promise<ReachReport> => {
  const useStream = options?.stream === true;

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
          } else if (payload.type === "error" && payload.message) {
            throw new Error(payload.message);
          }
        } catch (e) {
          if (e instanceof Error && e.message !== "Unexpected end of JSON input") throw e;
        }
      }
    }
  }

  throw new Error("Analysis did not complete. Please try again.");
}
