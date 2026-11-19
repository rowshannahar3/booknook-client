import type { Metadata } from "next";
import { Suspense } from "react";
import PageSpinner from "@/components/PageSpinner";
import HomeView from "@/components/views/HomeView";

export const metadata: Metadata = { title: "BookNook | Home" };

export default function Page() {
  return (
    <Suspense fallback={<PageSpinner />}>
      <HomeView />
    </Suspense>
  );
}
