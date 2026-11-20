"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import PageSpinner from "./PageSpinner";

/* Waits for the session check before deciding, so a signed-in user is never bounced to Login on reload. */
export default function RequireAuth({ children }: { children: ReactNode }) {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isPending && !session) router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
  }, [isPending, session, router, pathname]);

  if (isPending || !session) return <PageSpinner label="Checking your session…" />;
  return <>{children}</>;
}
