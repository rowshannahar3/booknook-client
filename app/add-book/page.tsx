import type { Metadata } from "next";
import { Suspense } from "react";
import PageSpinner from "@/components/PageSpinner";
import AddBookView from "@/components/views/AddBookView";

export const metadata: Metadata = { title: "BookNook | Add Book" };

export default function Page() {
  return (
    <Suspense fallback={<PageSpinner />}>
      <AddBookView />
    </Suspense>
  );
}
