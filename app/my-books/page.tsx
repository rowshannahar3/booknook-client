import type { Metadata } from "next";
import { Suspense } from "react";
import PageSpinner from "@/components/PageSpinner";
import MyBooksView from "@/components/views/MyBooksView";

export const metadata: Metadata = { title: "BookNook | My Books" };

export default function Page() {
  return (
    <Suspense fallback={<PageSpinner />}>
      <MyBooksView />
    </Suspense>
  );
}
