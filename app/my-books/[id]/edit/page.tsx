import type { Metadata } from "next";
import { Suspense } from "react";
import PageSpinner from "@/components/PageSpinner";
import EditBookView from "@/components/views/EditBookView";

export const metadata: Metadata = { title: "BookNook | Edit Book" };

export default function Page() {
  return (
    <Suspense fallback={<PageSpinner />}>
      <EditBookView />
    </Suspense>
  );
}
