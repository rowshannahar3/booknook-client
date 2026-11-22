import type { Metadata } from "next";
import { Suspense } from "react";
import PageSpinner from "@/components/PageSpinner";
import ProfileView from "@/components/views/ProfileView";

export const metadata: Metadata = { title: "BookNook | My Profile" };

export default function Page() {
  return (
    <Suspense fallback={<PageSpinner />}>
      <ProfileView />
    </Suspense>
  );
}
