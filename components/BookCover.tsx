"use client";

import { useState } from "react";
import { BookOpen } from "lucide-react";

/* Consistent 2:3 cover frame with a graceful fallback when an image is missing or fails to load. */
export default function BookCover({ src, title, className = "" }: { src?: string; title: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className={`relative aspect-[2/3] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-orange-100 to-orange-200 ${className}`}>
      {src && !failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={`Cover of ${title}`} className="size-full object-cover" loading="lazy" onError={() => setFailed(true)} />
      ) : (
        <div className="grid size-full place-items-center text-orange-900/60">
          <BookOpen className="size-10" aria-hidden="true" />
          <span className="sr-only">No cover available for {title}</span>
        </div>
      )}
    </div>
  );
}
