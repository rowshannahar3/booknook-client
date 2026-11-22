import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen } from "lucide-react";

export const metadata: Metadata = { title: "BookNook | Page Not Found" };

export default function NotFound() {
  return (
    <div className="mx-auto grid min-h-[60vh] max-w-lg place-items-center px-4 py-16 text-center">
      <div>
        <BookOpen className="mx-auto mb-4 size-16 text-primary" aria-hidden="true" />
        <p className="font-serif text-7xl text-primary">404</p>
        <h1 className="mt-2 text-3xl">This page wandered off the shelf.</h1>
        <p className="mb-8 mt-3 text-base-content/70">The page you are looking for doesn&apos;t exist or has moved.</p>
        <Link href="/" className="btn btn-primary">Back to Home</Link>
      </div>
    </div>
  );
}
