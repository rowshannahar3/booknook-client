import { RefreshCw } from "lucide-react";

export function BookCardSkeleton() {
  return (
    <div className="flex h-full flex-col gap-4 rounded-box border border-base-content/10 bg-base-200 p-4" aria-hidden="true">
      <div className="skeleton aspect-[2/3] w-full rounded-2xl" />
      <div className="skeleton h-4 w-1/2" />
      <div className="skeleton h-6 w-4/5" />
      <div className="skeleton h-4 w-1/3" />
      <div className="skeleton mt-2 h-12 w-full" />
    </div>
  );
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div role="status" aria-label="Loading books">
      <div className="mb-6 flex items-center justify-center gap-3 text-base-content/70">
        <span className="loading loading-spinner loading-md text-primary" aria-hidden="true" />
        <span className="text-sm">Loading books…</span>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: count }, (_, i) => <BookCardSkeleton key={i} />)}
      </div>
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <div className="rounded-box border border-error/40 bg-base-200 p-8 text-center" role="alert">
      <p className="mb-4">{message ?? "We couldn't complete that request. Please try again in a moment."}</p>
      {onRetry && (
        <button type="button" className="btn btn-outline btn-error btn-sm" onClick={onRetry}>
          <RefreshCw className="size-4" aria-hidden="true" /> Try again
        </button>
      )}
    </div>
  );
}

export function EmptyState({ title, message, children }: { title: string; message: string; children?: React.ReactNode }) {
  return (
    <div className="rounded-box border border-dashed border-base-content/20 bg-base-200 p-10 text-center">
      <h3 className="mb-2 text-2xl">{title}</h3>
      <p className="mx-auto mb-6 max-w-md text-base-content/70">{message}</p>
      {children}
    </div>
  );
}
