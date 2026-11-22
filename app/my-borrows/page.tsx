import type { Metadata } from "next";
import { Suspense } from "react";
import PageSpinner from "@/components/PageSpinner";
import MyBorrowsView from "@/components/views/MyBorrowsView";

export const metadata: Metadata = { title: "BookNook | My Borrows" };

export default function Page() {
  return (
    <Suspense fallback={<PageSpinner />}>
      <MyBorrowsView />
    </Suspense>
  );
}
