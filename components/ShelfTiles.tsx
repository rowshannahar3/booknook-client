import Link from "next/link";
import { Baby, BookOpen, FlaskConical, Landmark, Library } from "lucide-react";
import Reveal from "./Reveal";

const SHELVES = [
  { name: "Fiction", icon: BookOpen, blurb: "Novels and stories" },
  { name: "Science", icon: FlaskConical, blurb: "How the world works" },
  { name: "History", icon: Landmark, blurb: "Lives and eras" },
  { name: "Kids", icon: Baby, blurb: "Little readers" },
  { name: "Others", icon: Library, blurb: "Everything else" },
];

export default function ShelfTiles() {
  return (
    <section className="bg-base-200 py-16" aria-labelledby="shelves">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <h2 id="shelves" className="mb-2 text-3xl sm:text-4xl">Browse by Shelf</h2>
          <p className="mb-8 text-base-content/70">Start with a category and wander from there.</p>
        </Reveal>
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {SHELVES.map((s, i) => (
            <li key={s.name}>
              <Reveal delay={i * 0.05} className="h-full">
                <Link
                  href={`/books?category=${s.name}`}
                  className="flex h-full flex-col items-center gap-3 rounded-box border border-base-content/10 bg-base-100 p-6 text-center transition-transform duration-300 hover:-translate-y-1"
                >
                  <s.icon className="size-8 text-primary" aria-hidden="true" />
                  <span className="font-serif text-xl">{s.name}</span>
                  <span className="text-sm text-base-content/70">{s.blurb}</span>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
