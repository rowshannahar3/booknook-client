import type { Metadata } from "next";
import { Suspense } from "react";
import PageSpinner from "@/components/PageSpinner";
import BooksView from "@/components/views/BooksView";

export const metadata: Metadata = { title: "BookNook | All Books" };

export default function Page() {
  return (
    <Suspense fallback={<PageSpinner />}>
      <BooksView />
    </Suspense>
  );
}
