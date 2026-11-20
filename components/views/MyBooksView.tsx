"use client";

import { useState } from "react";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useDeleteBook, useMyBooks } from "@/lib/queries";
import { copiesOnLoan } from "@/lib/utils";
import type { Book } from "@/lib/types";
import RequireAuth from "../RequireAuth";
import BookCover from "../BookCover";
import ConfirmModal from "../ConfirmModal";
import { EmptyState, ErrorState } from "../BookGridStates";
import PageSpinner from "../PageSpinner";

function MyBooks() {
  const { data, isPending, isError, error, refetch } = useMyBooks();
  const del = useDeleteBook();
  const [target, setTarget] = useState<Book | null>(null);

  function confirmDelete() {
    if (!target) return;
    del.mutate(target._id, {
      onSuccess: () => { toast.success("Book removed from your listings."); setTarget(null); },
      onError: (e) => { toast.error(e.message); setTarget(null); },
    });
  }

  const Actions = ({ b }: { b: Book }) => {
    const onLoan = copiesOnLoan(b) > 0;
    return (
      <div className="flex gap-2">
        <Link href={`/my-books/${b._id}/edit`} className="btn btn-outline btn-sm" aria-label={`Edit ${b.title}`}><Pencil className="size-4" aria-hidden="true" /> Edit</Link>
        <button type="button" className="btn btn-outline btn-error btn-sm" disabled={onLoan} title={onLoan ? "This book is on loan right now, so it can't be removed yet." : undefined}
          onClick={() => setTarget(b)} aria-label={`Delete ${b.title}`}><Trash2 className="size-4" aria-hidden="true" /> Delete</button>
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="mb-2 text-4xl">My Books</h1>
      <p className="mb-8 text-base-content/70">Manage the books you have added to the library.</p>

      {isPending ? <PageSpinner label="Loading your books…" /> : isError ? <ErrorState message={error.message} onRetry={() => refetch()} /> : data.length === 0 ? (
        <EmptyState title="You haven't added any books yet." message="Add a title to start building your shelf.">
          <Link href="/add-book" className="btn btn-primary">Add a Book</Link>
        </EmptyState>
      ) : (
        <>
          <div className="hidden overflow-x-auto rounded-box border border-base-content/10 bg-base-200 md:block">
            <table className="table">
              <thead><tr><th>Cover</th><th>Title</th><th>Category</th><th>Copies</th><th><span className="sr-only">Actions</span></th></tr></thead>
              <tbody>
                {data.map((b) => (
                  <tr key={b._id}>
                    <td className="w-20"><BookCover src={b.image} title={b.title} className="!rounded-lg" /></td>
                    <td><Link href={`/books/${b._id}`} className="font-medium hover:text-primary">{b.title}</Link><div className="text-sm text-base-content/70">{b.author}</div></td>
                    <td>{b.category}</td>
                    <td>{b.availableCopies} / {b.totalCopies}</td>
                    <td><Actions b={b} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ul className="grid gap-4 md:hidden">
            {data.map((b) => (
              <li key={b._id} className="flex gap-4 rounded-box border border-base-content/10 bg-base-200 p-4">
                <div className="w-24 shrink-0"><BookCover src={b.image} title={b.title} className="!rounded-lg" /></div>
                <div className="flex flex-1 flex-col gap-2">
                  <Link href={`/books/${b._id}`} className="font-serif text-xl">{b.title}</Link>
                  <p className="text-sm text-base-content/70">{b.category} · {b.availableCopies} / {b.totalCopies} available</p>
                  <div className="mt-auto"><Actions b={b} /></div>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      <ConfirmModal
        open={!!target}
        onClose={() => setTarget(null)}
        onConfirm={confirmDelete}
        busy={del.isPending}
        title="Delete this book?"
        message={`Remove "${target?.title ?? ""}" from your listings? This action cannot be undone.`}
        confirmLabel="Delete"
      />
    </div>
  );
}

export default function MyBooksView() {
  return <RequireAuth><MyBooks /></RequireAuth>;
}
