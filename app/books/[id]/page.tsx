import type { Metadata } from "next";
import { Suspense } from "react";
import PageSpinner from "@/components/PageSpinner";
import BookDetailsView from "@/components/views/BookDetailsView";

export const metadata: Metadata = { title: "BookNook | Book Details" };

export default function Page() {
  return (
    <Suspense fallback={<PageSpinner />}>
      <BookDetailsView />
    </Suspense>
  );
}
