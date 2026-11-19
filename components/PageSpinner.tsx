export default function PageSpinner({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="grid min-h-[50vh] place-items-center" role="status" aria-live="polite">
      <div className="flex flex-col items-center gap-3 text-base-content/70">
        <span className="loading loading-spinner loading-lg text-primary" aria-hidden="true" />
        <p className="text-sm">{label}</p>
      </div>
    </div>
  );
}
