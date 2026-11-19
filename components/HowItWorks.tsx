import { BookOpen, RotateCcw, Search } from "lucide-react";
import Reveal from "./Reveal";

const STEPS = [
  { icon: Search, title: "Find a book", text: "Browse the catalogue or search by title, author, or shelf." },
  { icon: BookOpen, title: "Borrow a copy", text: "Confirm your loan and see your return date straight away." },
  { icon: RotateCcw, title: "Return it", text: "Give it back in one click so the next reader can enjoy it." },
];

export default function HowItWorks() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6" aria-labelledby="how">
      <Reveal>
        <h2 id="how" className="mb-2 text-3xl sm:text-4xl">How Borrowing Works</h2>
        <p className="mb-8 text-base-content/70">Three simple steps, no fuss.</p>
      </Reveal>
      <ol className="grid gap-6 md:grid-cols-3">
        {STEPS.map((s, i) => (
          <li key={s.title}>
            <Reveal delay={i * 0.08} className="h-full">
              <div className="h-full rounded-box border border-base-content/10 bg-base-200 p-6">
                <div className="mb-4 flex items-center justify-between">
                  <span className="font-serif text-5xl text-primary/80">{i + 1}</span>
                  <s.icon className="size-8 text-primary" aria-hidden="true" />
                </div>
                <h3 className="mb-2 text-xl">{s.title}</h3>
                <p className="text-base-content/70">{s.text}</p>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  );
}
