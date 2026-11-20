"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { useBooks, type BookQuery } from "@/lib/queries";
import { CATEGORIES } from "@/lib/types";
import BookCard from "../BookCard";
import { EmptyState, ErrorState, SkeletonGrid } from "../BookGridStates";
import AiAssistant from "../AiAssistant";

export default function BooksView() {
  const params = useSearchParams();
  const initial = params.get("category");
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [category, setCategory] = useState<string>(CATEGORIES.includes(initial as never) ? (initial as string) : "");
  const [sort, setSort] = useState<NonNullable<BookQuery["sort"]>>("newest");

  useEffect(() => {
    const id = setTimeout(() => setDebounced(search.trim()), 300);
    return () => clearTimeout(id);
  }, [search]);

  const { data, isPending, isError, error, refetch, isFetching } = useBooks({ q: debounced, category, sort });
  const clear = () => { setSearch(""); setCategory(""); setSort("newest"); };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <header className="mb-8 max-w-2xl">
        <h1 className="mb-2 text-4xl sm:text-5xl">All Books</h1>
        <p className="text-base-content/70">Search the shared catalogue, filter by shelf, and find your next read.</p>
      </header>

      {process.env.NEXT_PUBLIC_AI_ENABLED === "true" && <AiAssistant />}

      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center">
        <label className="input input-bordered flex flex-1 items-center gap-2">
          <Search className="size-4 opacity-60" aria-hidden="true" />
          <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by title or author" aria-label="Search by title or author" className="grow" />
        </label>
        <label className="select select-bordered w-full md:w-52">
          <span className="sr-only">Sort books</span>
          <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)}>
            <option value="newest">Recently added</option>
            <option value="oldest">Oldest first</option>
            <option value="title">Title A–Z</option>
          </select>
        </label>
      </div>

      <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Filter by category">
        {["", ...CATEGORIES].map((c) => (
          <button key={c || "all"} type="button" aria-pressed={category === c} onClick={() => setCategory(c)}
            className={`btn btn-sm rounded-full ${category === c ? "btn-primary" : "btn-outline"}`}>
            {c || "All"}
          </button>
        ))}
      </div>

      <div aria-live="polite" className="sr-only">{isFetching ? "Loading books" : `${data?.length ?? 0} books found`}</div>

      {isPending ? (
        <SkeletonGrid count={6} />
      ) : isError ? (
        <ErrorState message={error.message} onRetry={() => refetch()} />
      ) : data.length === 0 ? (
        <EmptyState title="The shelves are quiet for now." message="No books match these filters. Try another search or explore all categories.">
          <button type="button" className="btn btn-primary" onClick={clear}>Clear filters</button>
        </EmptyState>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((b) => <BookCard key={b._id} book={b} />)}
        </div>
      )}
    </div>
  );
}
