"use client";

import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";
import { useBook, useUpdateBook } from "@/lib/queries";
import { copiesOnLoan } from "@/lib/utils";
import RequireAuth from "../RequireAuth";
import PageSpinner from "../PageSpinner";
import BookForm from "../BookForm";
import { ErrorState } from "../BookGridStates";

function EditBook() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: session } = useSession();
  const { data: book, isPending, isError, error } = useBook(id);
  const update = useUpdateBook(id);

  if (isPending) return <PageSpinner label="Loading your listing…" />;
  if (isError) return <div className="mx-auto max-w-2xl px-4 py-16"><ErrorState message={error.message} /></div>;
  if (book.ownerId !== session?.user.id)
    return <div className="mx-auto max-w-2xl px-4 py-16"><ErrorState message="You can only edit books that you added." /></div>;

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="mb-8 text-4xl">Edit Book</h1>
      <BookForm
        initial={{ title: book.title, author: book.author, category: book.category, image: book.image, description: book.description, totalCopies: book.totalCopies }}
        minCopies={copiesOnLoan(book)}
        submitLabel="Save Changes"
        busy={update.isPending}
        onSubmit={(values) =>
          update.mutate(values, {
            onSuccess: () => { toast.success("Your changes have been saved."); router.push("/my-books"); },
            onError: (e) => toast.error(e.message),
          })
        }
      />
    </div>
  );
}

export default function EditBookView() {
  return <RequireAuth><EditBook /></RequireAuth>;
}
