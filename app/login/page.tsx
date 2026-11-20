import type { Metadata } from "next";
import { Suspense } from "react";
import PageSpinner from "@/components/PageSpinner";
import LoginView from "@/components/views/LoginView";

export const metadata: Metadata = { title: "BookNook | Login" };

export default function Page() {
  return (
    <Suspense fallback={<PageSpinner />}>
      <LoginView />
    </Suspense>
  );
}