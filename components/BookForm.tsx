"use client";

import { useState } from "react";
import { ImagePlus } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";
import { uploadImage } from "@/lib/upload";
import { CATEGORIES, type BookInput } from "@/lib/types";
import BookCover from "./BookCover";

type Props = {
  initial?: BookInput;
  minCopies?: number; // copies currently on loan (edit mode)
  submitLabel: string;
  busy: boolean;
  onSubmit: (values: BookInput) => void;
};

const EMPTY: BookInput = { title: "", author: "", category: "Fiction", image: "", description: "", totalCopies: 1 };

export default function BookForm({ initial, minCopies = 1, submitLabel, busy, onSubmit }: Props) {
  const { data: session } = useSession();
  const [v, setV] = useState<BookInput>(initial ?? EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [progress, setProgress] = useState<number | null>(null);
  const min = Math.max(1, minCopies);

  function validate() {
    const e: Record<string, string> = {};
    if (!v.title.trim()) e.title = "Please enter the book title.";
    if (!v.author.trim()) e.author = "Please enter the author's name.";
    if (!v.image) e.image = "Please upload a cover image.";
    if (v.description.trim().length < 20) e.description = "Please write at least 20 characters.";
    if (!Number.isInteger(v.totalCopies) || v.totalCopies < min)
      e.totalCopies = min > 1 ? `Total copies can't be lower than the ${min} currently on loan.` : "Enter a whole number of 1 or more.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onFile(file?: File) {
    if (!file) return;
    setProgress(0);
    try {
      const url = await uploadImage(file, setProgress);
      setV((p) => ({ ...p, image: url }));
      setErrors((p) => ({ ...p, image: "" }));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "The image upload failed. Please try again.");
    } finally {
      setProgress(null);
    }
  }

  const field = (id: keyof BookInput) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setV({ ...v, [id]: id === "totalCopies" ? Number(e.target.value) : e.target.value });

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); if (validate()) onSubmit({ ...v, title: v.title.trim(), author: v.author.trim(), description: v.description.trim() }); }}
      className="space-y-8 rounded-box border border-base-content/10 bg-base-200 p-6 sm:p-8"
      noValidate
    >
      <fieldset className="space-y-4">
        <legend className="mb-2 font-serif text-2xl">Book information</legend>
        <label className="block"><span className="mb-1 block text-sm">Book title</span>
          <input className="input input-bordered w-full" value={v.title} onChange={field("title")} aria-invalid={!!errors.title} />
          {errors.title && <span role="alert" className="mt-1 block text-sm text-error">{errors.title}</span>}</label>
        <label className="block"><span className="mb-1 block text-sm">Author name</span>
          <input className="input input-bordered w-full" value={v.author} onChange={field("author")} aria-invalid={!!errors.author} />
          {errors.author && <span role="alert" className="mt-1 block text-sm text-error">{errors.author}</span>}</label>
        <label className="block"><span className="mb-1 block text-sm">Category</span>
          <select className="select select-bordered w-full" value={v.category} onChange={field("category")}>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select></label>
        <label className="block"><span className="mb-1 block text-sm">Short description</span>
          <textarea rows={4} maxLength={1000} className="textarea textarea-bordered w-full" value={v.description} onChange={field("description")} aria-invalid={!!errors.description} />
          {errors.description && <span role="alert" className="mt-1 block text-sm text-error">{errors.description}</span>}</label>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="mb-2 font-serif text-2xl">Cover image</legend>
        <div className="grid gap-4 sm:grid-cols-[160px_1fr] sm:items-start">
          <BookCover src={v.image} title={v.title || "new book"} />
          <div className="space-y-3">
            <label className="flex cursor-pointer items-center gap-2 rounded-field border border-dashed border-base-content/30 p-4 text-sm hover:border-primary">
              <ImagePlus className="size-5 text-primary" aria-hidden="true" />
              <span>{v.image ? "Replace the cover image" : "Choose a cover image (JPG or PNG, up to 5 MB)"}</span>
              <input type="file" accept="image/*" className="sr-only" onChange={(e) => onFile(e.target.files?.[0])} />
            </label>
            {progress !== null && <progress className="progress progress-primary w-full" value={progress} max={100} aria-label="Upload progress" />}
            {errors.image && <p role="alert" className="text-sm text-error">{errors.image}</p>}
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="mb-2 font-serif text-2xl">Availability</legend>
        <label className="block"><span className="mb-1 block text-sm">Total copies</span>
          <input type="number" min={min} step={1} className="input input-bordered w-full sm:w-40" value={v.totalCopies} onChange={field("totalCopies")} aria-invalid={!!errors.totalCopies} />
          {minCopies > 1 && <span className="mt-1 block text-sm text-base-content/70">{minCopies} {minCopies === 1 ? "copy is" : "copies are"} currently on loan.</span>}
          {errors.totalCopies && <span role="alert" className="mt-1 block text-sm text-error">{errors.totalCopies}</span>}</label>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="mb-2 font-serif text-2xl">Contributor</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block"><span className="mb-1 block text-sm">Your name</span>
            <input className="input input-bordered w-full" value={session?.user.name ?? ""} readOnly /></label>
          <label className="block"><span className="mb-1 block text-sm">Your email</span>
            <input className="input input-bordered w-full" value={session?.user.email ?? ""} readOnly /></label>
        </div>
      </fieldset>

      <button type="submit" className="btn btn-primary w-full sm:w-auto" disabled={busy || progress !== null}>
        {busy && <span className="loading loading-spinner loading-sm" aria-hidden="true" />} {submitLabel}
      </button>
    </form>
  );
}
