import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "./api";
import type { Book, BookInput, Borrow } from "./types";

export type BookQuery = {
  q?: string;
  category?: string;
  sort?: "newest" | "oldest" | "title";
  limit?: number;
};

function qs(params: Record<string, string | number | undefined>) {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) if (v !== undefined && v !== "") sp.set(k, String(v));
  const s = sp.toString();
  return s ? `?${s}` : "";
}

export const useBooks = (params: BookQuery) =>
  useQuery({
    queryKey: ["books", "list", params],
    queryFn: () => api<Book[]>(`/books${qs(params)}`, { auth: false }),
    placeholderData: keepPreviousData,
  });

export const useMyBooks = () =>
  useQuery({ queryKey: ["books", "mine"], queryFn: () => api<Book[]>("/books?mine=1") });

export const useBook = (id: string) =>
  useQuery({ queryKey: ["books", "detail", id], queryFn: () => api<Book>(`/books/${id}`) });

export const useBorrows = () =>
  useQuery({ queryKey: ["borrows"], queryFn: () => api<Borrow[]>("/borrows") });

function useInvalidate() {
  const qc = useQueryClient();
  return () =>
    Promise.all([
      qc.invalidateQueries({ queryKey: ["books"] }),
      qc.invalidateQueries({ queryKey: ["borrows"] }),
    ]);
}

export function useAddBook() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: (input: BookInput) => api<Book>("/books", { method: "POST", body: input }),
    onSuccess: invalidate,
  });
}

export function useUpdateBook(id: string) {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: (input: BookInput) => api<Book>(`/books/${id}`, { method: "PATCH", body: input }),
    onSuccess: invalidate,
  });
}

export function useDeleteBook() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: (id: string) => api<{ message: string }>(`/books/${id}`, { method: "DELETE" }),
    onSuccess: invalidate,
  });
}

export function useBorrow() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: (bookId: string) => api<Borrow>("/borrows", { method: "POST", body: { bookId } }),
    onSuccess: invalidate,
  });
}

export function useReturnBook() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: (borrowId: string) => api<{ message: string }>(`/borrows/${borrowId}`, { method: "DELETE" }),
    onSuccess: invalidate,
  });
}
