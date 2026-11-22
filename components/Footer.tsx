import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import Logo from "./Logo";
import XIcon from "./XIcon";

const SOCIALS = [
  { label: "Facebook", href: "https://facebook.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
];

export default function Footer() {
  return (
    <footer className="border-t border-base-content/10 bg-base-200">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div className="space-y-4">
          <Logo className="h-10" />
          <p className="max-w-xs text-sm text-base-content/70">
            A small online library where readers add a book, borrow a book, and return it with ease.
          </p>
        </div>
        <div>
          <h2 className="mb-3 text-lg">Contact</h2>
          <ul className="space-y-2 text-sm text-base-content/70">
            <li className="flex items-center gap-2"><Mail className="size-4 text-primary" aria-hidden="true" /> hello@booknook.example</li>
            <li className="flex items-center gap-2"><Phone className="size-4 text-primary" aria-hidden="true" /> +880 1700 000000</li>
            <li className="flex items-center gap-2"><MapPin className="size-4 text-primary" aria-hidden="true" /> Chattogram, Bangladesh</li>
          </ul>
        </div>
        <div>
          <h2 className="mb-3 text-lg">Follow us</h2>
          <ul className="flex flex-wrap items-center gap-2">
            <li>
              <a href="https://x.com" target="_blank" rel="noreferrer" aria-label="BookNook on X" className="btn btn-outline btn-sm">
                X
              </a>
            </li>
            {SOCIALS.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noreferrer" aria-label={`BookNook on ${s.label}`} className="btn btn-outline btn-sm">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
          <Link href="/books" className="mt-4 inline-block text-sm text-base-content/70 hover:text-primary">Browse the shelves</Link>
        </div>
      </div>
      <p className="border-t border-base-content/10 py-4 text-center text-xs text-base-content/60">
        © 2026 BookNook. All rights reserved.
      </p>
    </footer>
  );
}