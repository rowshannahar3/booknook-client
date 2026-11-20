"use client";

import { useEffect, useRef, type ReactNode } from "react";

/* Native <dialog>: focus is trapped, Escape closes it, and focus returns to the opener. */
export default function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog ref={ref} className="modal" onClose={onClose} aria-labelledby="modal-title">
      <div className="modal-box border border-base-content/10 bg-base-200">
        <h3 id="modal-title" className="mb-4 text-2xl">{title}</h3>
        {children}
      </div>
      <form method="dialog" className="modal-backdrop">
        <button aria-label="Close dialog">close</button>
      </form>
    </dialog>
  );
}
