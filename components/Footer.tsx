import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import Logo from "./Logo";
import XIcon from "./XIcon";

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
          <h2 className="mb-3 text-lg">Follow</h2>
          <div className="flex gap-3">
            <a href="https://x.com" target="_blank" rel="noreferrer" aria-label="BookNook on X" className="btn btn-outline btn-circle btn-sm">
              <XIcon className="size-4" />
            </a>
            <Link href="/books" className="btn btn-ghost btn-sm">Browse the shelves</Link>
          </div>
        </div>
      </div>
      <p className="border-t border-base-content/10 py-4 text-center text-xs text-base-content/60">
        © 2026 BookNook. All rights reserved.
      </p>
    </footer>
  );
}
