"use client";

import Link from "next/link";
import { useBooks } from "@/lib/queries";
import BookCard from "./BookCard";
import { EmptyState, ErrorState, SkeletonGrid } from "./BookGridStates";
import Reveal from "./Reveal";

export default function NewArrivals() {
  const { data, isPending, isError, error, refetch } = useBooks({ sort: "newest", limit: 6 });
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6" aria-labelledby="new-arrivals">
      <Reveal>
        <h2 id="new-arrivals" className="mb-2 text-3xl sm:text-4xl">New Arrivals</h2>
        <p className="mb-8 text-base-content/70">The latest books added to the shelves.</p>
      </Reveal>
      {isPending ? (
        <SkeletonGrid />
      ) : isError ? (
        <ErrorState message={error.message} onRetry={() => refetch()} />
      ) : data.length === 0 ? (
        <EmptyState title="The shelves are quiet for now." message="No books have been added yet. Be the first to add one." />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((b, i) => (
            <Reveal key={b._id} delay={i * 0.05}><BookCard book={b} /></Reveal>
          ))}
        </div>
      )}
      <div className="mt-10 text-center">
        <Link href="/books" className="btn btn-primary">See All Books</Link>
      </div>
    </section>
  );
}
