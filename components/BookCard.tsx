import Link from "next/link";
import type { Book } from "@/lib/types";
import BookCover from "./BookCover";
import AvailabilityBadge from "./AvailabilityBadge";

export default function BookCard({ book }: { book: Book }) {
  return (
    <article className="flex h-full flex-col gap-4 rounded-box border border-base-content/10 bg-base-200 p-4 transition-transform duration-300 hover:-translate-y-1">
      <BookCover src={book.image} title={book.title} />
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="badge badge-outline">{book.category}</span>
          <AvailabilityBadge book={book} />
        </div>
        <h3 className="line-clamp-2 text-xl">{book.title}</h3>
        <p className="text-sm text-base-content/70">by {book.author}</p>
      </div>
      <Link href={`/books/${book._id}`} className="btn btn-outline btn-primary mt-auto" aria-label={`View details for ${book.title}`}>
        View Details
      </Link>
    </article>
  );
}
