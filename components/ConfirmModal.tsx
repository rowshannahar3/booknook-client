"use client";

import Modal from "./Modal";

export default function ConfirmModal({
  open, onClose, onConfirm, title, message, confirmLabel, busy,
}: { open: boolean; onClose: () => void; onConfirm: () => void; title: string; message: string; confirmLabel: string; busy?: boolean }) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p className="text-base-content/80">{message}</p>
      <div className="modal-action">
        <button type="button" className="btn btn-ghost" onClick={onClose} disabled={busy}>Cancel</button>
        <button type="button" className="btn btn-error" onClick={onConfirm} disabled={busy}>
          {busy && <span className="loading loading-spinner loading-sm" aria-hidden="true" />}
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
