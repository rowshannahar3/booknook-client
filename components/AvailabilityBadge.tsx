import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { availability } from "@/lib/utils";
import type { Book } from "@/lib/types";

const TONE = { success: "badge-success", warning: "badge-warning", error: "badge-error" } as const;
const ICON = { success: CheckCircle2, warning: AlertTriangle, error: XCircle } as const;

/* Always text + icon, never colour alone. */
export default function AvailabilityBadge({ book }: { book: Pick<Book, "totalCopies" | "availableCopies"> }) {
  const { label, tone } = availability(book);
  const Icon = ICON[tone];
  return (
    <span className={`badge ${TONE[tone]} gap-1 whitespace-nowrap`}>
      <Icon className="size-3.5" aria-hidden="true" />
      {label}
    </span>
  );
}
