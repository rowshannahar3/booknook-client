"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";
import { useBorrow } from "@/lib/queries";
import { formatDate, LOAN_DAYS } from "@/lib/utils";
import type { Book } from "@/lib/types";
import Modal from "./Modal";

export default function BorrowModal({ book, open, due, onClose }: { book: Book; open: boolean; due: Date | null; onClose: () => void }) {
  const { data: session } = useSession();
  const router = useRouter();
  const borrow = useBorrow();

  function confirm() {
    borrow.mutate(book._id, {
      onSuccess: () => {
        toast.success("You're all set. This book has been added to your borrowed shelf.");
        onClose();
        router.push("/my-borrows");
      },
      onError: (err) => toast.error(err.message),
    });
  }

  return (
    <Modal open={open} onClose={onClose} title="Confirm your borrow">
      <p className="mb-4 text-base-content/80">
        You are borrowing <strong>{book.title}</strong>. It is due back on <strong>{due ? formatDate(due) : "—"}</strong> ({LOAN_DAYS} days).
      </p>
      <div className="space-y-3">
        <label className="form-control block">
          <span className="mb-1 block text-sm">Your name</span>
          <input className="input input-bordered w-full" value={session?.user.name ?? ""} readOnly />
        </label>
        <label className="form-control block">
          <span className="mb-1 block text-sm">Your email</span>
          <input className="input input-bordered w-full" value={session?.user.email ?? ""} readOnly />
        </label>
      </div>
      <div className="modal-action">
        <button type="button" className="btn btn-ghost" onClick={onClose} disabled={borrow.isPending}>Cancel</button>
        <button type="button" className="btn btn-primary" onClick={confirm} disabled={borrow.isPending}>
          {borrow.isPending && <span className="loading loading-spinner loading-sm" aria-hidden="true" />}
          Confirm Borrow
        </button>
      </div>
    </Modal>
  );
}
