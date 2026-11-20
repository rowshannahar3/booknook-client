"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useBook } from "@/lib/queries";
import { formatDate, LOAN_DAYS } from "@/lib/utils";
import RequireAuth from "../RequireAuth";
import PageSpinner from "../PageSpinner";
import BookCover from "../BookCover";
import AvailabilityBadge from "../AvailabilityBadge";
import BorrowModal from "../BorrowModal";
import { ErrorState } from "../BookGridStates";

function Details() {
  const { id } = useParams<{ id: string }>();
  const { data: book, isPending, isError, error, refetch } = useBook(id);
  const [open, setOpen] = useState(false);
  const [due, setDue] = useState<Date | null>(null);
  const openBorrow = () => { setDue(new Date(Date.now() + LOAN_DAYS * 86_400_000)); setOpen(true); };

  if (isPending) return <PageSpinner label="Opening the book…" />;
  if (isError) return <div className="mx-auto max-w-3xl px-4 py-16"><ErrorState message={error.message} onRetry={() => refetch()} /></div>;

  const soldOut = book.availableCopies <= 0;
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <Link href="/books" className="mb-6 inline-flex items-center gap-2 text-sm text-base-content/70 hover:text-primary">
        <ArrowLeft className="size-4" aria-hidden="true" /> Back to all books
      </Link>
      <div className="grid gap-10 md:grid-cols-[minmax(0,360px)_1fr]">
        <div className="rounded-[2rem] bg-gradient-to-br from-orange-100 to-orange-200 p-6">
          <BookCover src={book.image} title={book.title} />
        </div>
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="badge badge-outline">{book.category}</span>
            <AvailabilityBadge book={book} />
          </div>
          <h1 className="text-4xl sm:text-5xl">{book.title}</h1>
          <p className="text-lg text-base-content/80">by {book.author}</p>
          <p className="whitespace-pre-line leading-relaxed text-base-content/80">{book.description}</p>
          <dl className="grid gap-3 rounded-box border border-base-content/10 bg-base-200 p-5 text-sm sm:grid-cols-2">
            <div><dt className="text-base-content/60">Added by</dt><dd className="font-medium">{book.ownerName}</dd></div>
            <div><dt className="text-base-content/60">Added on</dt><dd className="font-medium">{formatDate(book.addedAt)}</dd></div>
            <div><dt className="text-base-content/60">Copies available</dt><dd className="font-medium">{book.availableCopies} of {book.totalCopies}</dd></div>
          </dl>
          <button type="button" className="btn btn-primary w-full sm:w-auto" disabled={soldOut} onClick={openBorrow}>
            {soldOut ? "Not Available" : "Borrow This Book"}
          </button>
          {soldOut && <p className="text-sm text-base-content/70">This title is currently checked out. Check back soon for another available copy.</p>}
        </div>
      </div>
      <BorrowModal book={book} open={open} due={due} onClose={() => setOpen(false)} />
    </div>
  );
}

export default function BookDetailsView() {
  return <RequireAuth><Details /></RequireAuth>;
}
