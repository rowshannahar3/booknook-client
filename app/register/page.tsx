import type { Metadata } from "next";
import { Suspense } from "react";
import PageSpinner from "@/components/PageSpinner";
import RegisterView from "@/components/views/RegisterView";

export const metadata: Metadata = { title: "BookNook | Register" };

export default function Page() {
  return (
    <Suspense fallback={<PageSpinner />}>
      <RegisterView />
    </Suspense>
  );
}