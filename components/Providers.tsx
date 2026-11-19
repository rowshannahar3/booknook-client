"use client";

import { useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider, useTheme } from "next-themes";
import { MotionConfig } from "framer-motion";
import { Toaster } from "sonner";

function ThemedToaster() {
  const { resolvedTheme } = useTheme();
  return <Toaster theme={resolvedTheme === "light" ? "light" : "dark"} position="top-right" richColors closeButton />;
}

export default function Providers({ children }: { children: ReactNode }) {
  const [client] = useState(
    () => new QueryClient({ defaultOptions: { queries: { staleTime: 30_000, retry: 1, refetchOnWindowFocus: false } } }),
  );
  return (
    <ThemeProvider
      attribute="data-theme"
      defaultTheme="dark"
      enableSystem={false}
      value={{ dark: "booknook-dark", light: "booknook-light" }}
    >
      <QueryClientProvider client={client}>
        <MotionConfig reducedMotion="user">{children}</MotionConfig>
        <ThemedToaster />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
