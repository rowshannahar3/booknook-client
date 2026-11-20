import type { Book } from "./types";

export const LOAN_DAYS = 7;
export const DUE_SOON_DAYS = 2;

export function formatDate(iso: string | Date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

/** Only allow same-site relative redirects such as /books/123. */
export function safeRedirect(value: string | null | undefined, fallback = "/") {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return fallback;
  return value;
}

export function copiesOnLoan(book: Pick<Book, "totalCopies" | "availableCopies">) {
  return book.totalCopies - book.availableCopies;
}

export function availability(book: Pick<Book, "totalCopies" | "availableCopies">) {
  const n = book.availableCopies;
  if (n <= 0) return { label: "Not Available", tone: "error" as const };
  if (n === 1 && book.totalCopies > 1) return { label: "Low stock (1 copy)", tone: "warning" as const };
  return { label: `Available (${n} ${n === 1 ? "copy" : "copies"})`, tone: "success" as const };
}

export function daysLeft(returnDate: string) {
  return Math.ceil((new Date(returnDate).getTime() - Date.now()) / 86_400_000);
}

export function loanStatus(returnDate: string) {
  const left = daysLeft(returnDate);
  if (left < 0) return { label: "Overdue", tone: "error" as const };
  if (left <= DUE_SOON_DAYS) return { label: "Due Soon", tone: "warning" as const };
  return { label: "Active", tone: "success" as const };
}

export const PASSWORD_RULES = [
  { id: "len", label: "At least 6 characters", test: (p: string) => p.length >= 6 },
  { id: "upper", label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { id: "lower", label: "One lowercase letter", test: (p: string) => /[a-z]/.test(p) },
];