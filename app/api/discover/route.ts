import { auth } from "@/lib/auth";
import { CATEGORIES, type Book } from "@/lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";
const MODEL = process.env.ANTHROPIC_MODEL ?? "claude-haiku-5-5";

// Tiny in-memory rate limit (per server instance): 8 requests per minute per user.
const hits = new Map<string, number[]>();
function limited(key: string) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < 60_000);
  recent.push(now);
  hits.set(key, recent);
  return recent.length > 8;
}

const SYSTEM = `You turn a reader's request into search filters for a library catalogue.
Reply with JSON only, no prose and no code fences, in exactly this shape:
{"category": one of ${JSON.stringify(CATEGORIES)} or null, "keywords": [up to 6 lowercase single words about genre, theme, mood or subject]}
Never name specific books.`;

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return Response.json({ message: "Please sign in to use the assistant." }, { status: 401 });
  if (!process.env.ANTHROPIC_API_KEY) return Response.json({ message: "The assistant isn't available right now." }, { status: 503 });
  if (limited(session.user.id)) return Response.json({ message: "That's a lot of questions. Please try again in a minute." }, { status: 429 });

  const { query } = (await req.json().catch(() => ({}))) as { query?: unknown };
  if (typeof query !== "string" || query.trim().length < 3 || query.length > 300)
    return Response.json({ message: "Tell me a little about what you'd like to read (3 to 300 characters)." }, { status: 400 });

  // 1) Ask the model for structured filters only.
  let category: string | null = null;
  let keywords: string[] = [];
  try {
    const ai = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": process.env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({ model: MODEL, max_tokens: 200, system: SYSTEM, messages: [{ role: "user", content: query.trim() }] }),
    });
    const data = await ai.json();
    const text: string = data?.content?.find((b: { type: string }) => b.type === "text")?.text ?? "";
    const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
    if ((CATEGORIES as readonly string[]).includes(parsed.category)) category = parsed.category;
    if (Array.isArray(parsed.keywords))
      keywords = parsed.keywords.filter((k: unknown) => typeof k === "string").map((k: string) => k.toLowerCase().slice(0, 30)).slice(0, 6);
  } catch {
    return Response.json({ message: "The assistant couldn't understand that. Try the search box instead." }, { status: 502 });
  }

  // 2) Ground the answer in real catalogue records. The model never names books.
  const res = await fetch(`${API_URL}/books?limit=100`, { cache: "no-store" });
  if (!res.ok) return Response.json({ message: "The catalogue is unavailable right now." }, { status: 502 });
  const books = (await res.json()) as Book[];

  const ranked = books
    .map((b) => {
      const matched = keywords.filter((k) => `${b.title} ${b.author} ${b.description} ${b.category}`.toLowerCase().includes(k));
      const score = matched.length * 2 + (category && b.category === category ? 3 : 0);
      return { book: b, matched, score };
    })
    .filter((r) => r.score > 0 && r.book.availableCopies > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map((r) => ({ _id: r.book._id, title: r.book.title, author: r.book.author, category: r.book.category, matched: r.matched }));

  return Response.json({ category, keywords, results: ranked });
}
