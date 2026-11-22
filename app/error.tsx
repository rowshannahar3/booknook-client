"use client";

import Link from "next/link";
import { TriangleAlert } from "lucide-react";

/* Shown when a page crashes unexpectedly, instead of a blank screen. */
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto grid min-h-[60vh] max-w-lg place-items-center px-4 py-16 text-center">
      <div>
        <TriangleAlert className="mx-auto mb-4 size-14 text-primary" aria-hidden="true" />
        <h1 className="text-3xl">Something went wrong on this page.</h1>
        <p className="mb-8 mt-3 text-base-content/70">Please try again. If it keeps happening, head back to the home page.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <button type="button" className="btn btn-primary" onClick={() => reset()}>Try again</button>
          <Link href="/" className="btn btn-outline btn-primary">Back to Home</Link>
        </div>
      </div>
    </div>
  );
}