import type { Metadata } from "next";
import { Suspense, type ReactNode } from "react";
import "@fontsource-variable/playfair-display";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "BookNook | Home",
  description: "BookNook is a small online library: add a book, borrow a book, return a book.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col bg-base-100 text-base-content antialiased">
        <Providers>
          <Suspense fallback={<header className="h-16 border-b border-base-content/10 bg-base-100" />}>
            <Navbar />
          </Suspense>
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}