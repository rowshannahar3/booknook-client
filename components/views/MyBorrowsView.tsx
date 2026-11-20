"use client";

import Link from "next/link";
import { Undo2 } from "lucide-react";
import { toast } from "sonner";
import { useBorrows, useReturnBook } from "@/lib/queries";
import { formatDate, loanStatus } from "@/lib/utils";
import type { Borrow } from "@/lib/types";
import RequireAuth from "../RequireAuth";
import BookCover from "../BookCover";
import PageSpinner from "../PageSpinner";
import { EmptyState, ErrorState } from "../BookGridStates";

const TONE = { success: "badge-success", warning: "badge-warning", error: "badge-error" } as const;

function MyBorrows() {
  const { data, isPending, isError, error, refetch } = useBorrows();
  const ret = useReturnBook();

  const giveBack = (b: Borrow) =>
    ret.mutate(b._id, {
      onSuccess: () => toast.success("Book returned. Thanks for keeping the BookNook shelves moving."),
      onError: (e) => toast.error(e.message),
    });

  const ReturnButton = ({ b }: { b: Borrow }) => (
    <button type="button" className="btn btn-primary btn-sm" disabled={ret.isPending && ret.variables === b._id} onClick={() => giveBack(b)} aria-label={`Return ${b.bookTitle}`}>
      <Undo2 className="size-4" aria-hidden="true" /> Return Book
    </button>
  );
  const Status = ({ b }: { b: Borrow }) => { const s = loanStatus(b.returnDate); return <span className={`badge ${TONE[s.tone]}`}>{s.label}</span>; };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="mb-2 text-4xl">My Borrows</h1>
      <p className="mb-8 text-base-content/70">Books you have on loan. The return date is the day each one is due back.</p>

      {isPending ? <PageSpinner label="Loading your loans…" /> : isError ? <ErrorState message={error.message} onRetry={() => refetch()} /> : data.length === 0 ? (
        <EmptyState title="Nothing on your borrowed shelf." message="When you borrow a book it will appear here.">
          <Link href="/books" className="btn btn-primary">Browse Books</Link>
        </EmptyState>
      ) : (
        <>
          <div className="hidden overflow-x-auto rounded-box border border-base-content/10 bg-base-200 md:block">
            <table className="table">
              <thead><tr><th>Cover</th><th>Title</th><th>Borrow date</th><th>Return date</th><th>Status</th><th><span className="sr-only">Action</span></th></tr></thead>
              <tbody>
                {data.map((b) => (
                  <tr key={b._id}>
                    <td className="w-20"><BookCover src={b.bookImage} title={b.bookTitle} className="!rounded-lg" /></td>
                    <td><Link href={`/books/${b.bookId}`} className="font-medium hover:text-primary">{b.bookTitle}</Link></td>
                    <td>{formatDate(b.borrowDate)}</td>
                    <td>{formatDate(b.returnDate)}</td>
                    <td><Status b={b} /></td>
                    <td><ReturnButton b={b} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ul className="grid gap-4 md:hidden">
            {data.map((b) => (
              <li key={b._id} className="flex gap-4 rounded-box border border-base-content/10 bg-base-200 p-4">
                <div className="w-24 shrink-0"><BookCover src={b.bookImage} title={b.bookTitle} className="!rounded-lg" /></div>
                <div className="flex flex-1 flex-col gap-2">
                  <Link href={`/books/${b.bookId}`} className="font-serif text-xl">{b.bookTitle}</Link>
                  <p className="text-sm text-base-content/70">Due {formatDate(b.returnDate)}</p>
                  <div><Status b={b} /></div>
                  <div className="mt-auto"><ReturnButton b={b} /></div>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default function MyBorrowsView() {
  return <RequireAuth><MyBorrows /></RequireAuth>;
}
