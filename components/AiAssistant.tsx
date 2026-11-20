"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";

type Result = { _id: string; title: string; author: string; category: string; matched: string[] };

/* Optional extra. Hidden unless NEXT_PUBLIC_AI_ENABLED=true, and ordinary search always still works. */
export default function AiAssistant() {
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState<Result[] | null>(null);

  async function ask(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setError(""); setResults(null);
    try {
      const res = await fetch("/api/discover", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ query }) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message);
      setResults(json.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "The assistant couldn't help just now. Try the search box instead.");
    } finally { setBusy(false); }
  }

  return (
    <section className="mb-8 rounded-box border border-primary/40 bg-base-200 p-5" aria-labelledby="ai-title">
      <h2 id="ai-title" className="mb-1 flex items-center gap-2 text-xl"><Sparkles className="size-5 text-primary" aria-hidden="true" /> Ask the shelf assistant</h2>
      <p className="mb-3 text-sm text-base-content/70">Describe what you feel like reading. Suggestions come only from books in this library.</p>
      <form onSubmit={ask} className="flex flex-col gap-2 sm:flex-row">
        <input className="input input-bordered flex-1" value={query} onChange={(e) => setQuery(e.target.value)} placeholder='e.g. "a light fantasy for a weekend"' aria-label="What would you like to read?" />
        <button className="btn btn-primary" disabled={busy || query.trim().length < 3}>{busy && <span className="loading loading-spinner loading-sm" aria-hidden="true" />} Suggest</button>
      </form>
      <div aria-live="polite" className="mt-3">
        {error && <p className="text-sm text-error">{error}</p>}
        {results && results.length === 0 && <p className="text-sm text-base-content/70">Nothing matched that yet. Try different words or use the search box.</p>}
        {results && results.length > 0 && (
          <>
            <p className="mb-2 text-xs uppercase tracking-wide text-primary">AI suggestion</p>
            <ul className="space-y-2">
              {results.map((r) => (
                <li key={r._id}><Link href={`/books/${r._id}`} className="link link-hover font-medium">{r.title}</Link>
                  <span className="text-sm text-base-content/70"> by {r.author} · {r.category}{r.matched.length ? ` · matched: ${r.matched.join(", ")}` : ""}</span></li>
              ))}
            </ul>
          </>
        )}
      </div>
    </section>
  );
}
