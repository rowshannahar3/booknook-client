"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAddBook } from "@/lib/queries";
import RequireAuth from "../RequireAuth";
import BookForm from "../BookForm";

function AddBook() {
  const router = useRouter();
  const add = useAddBook();
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="mb-2 text-4xl">Add a Book</h1>
      <p className="mb-8 text-base-content/70">Share a title with the library. The date it was added is saved for you.</p>
      <BookForm
        submitLabel="Add Book"
        busy={add.isPending}
        onSubmit={(values) =>
          add.mutate(values, {
            onSuccess: (book) => {
              toast.success("Book added to the shelves.", { action: { label: "View listing", onClick: () => router.push(`/books/${book._id}`) } });
              router.push("/my-books");
            },
            onError: (e) => toast.error(e.message),
          })
        }
      />
    </div>
  );
}

export default function AddBookView() {
  return <RequireAuth><AddBook /></RequireAuth>;
}
