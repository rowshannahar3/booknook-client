"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, Circle } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { PASSWORD_RULES, safeRedirect } from "@/lib/utils";
import Logo from "../Logo";

function isUrl(v: string) {
  try { const u = new URL(v); return u.protocol === "http:" || u.protocol === "https:"; } catch { return false; }
}

export default function RegisterView() {
  const router = useRouter();
  const redirect = safeRedirect(useSearchParams().get("redirect"));
  const [form, setForm] = useState({ name: "", email: "", image: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: e.target.value });
  const rulesOk = PASSWORD_RULES.every((r) => r.test(form.password));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.name.trim()) return setError("Please enter your name.");
    if (form.image && !isUrl(form.image)) return setError("Please enter a valid photo URL, or leave it empty.");
    if (!rulesOk) return setError("Your password doesn't meet all the rules below.");

    setBusy(true);
    const { error } = await authClient.signUp.email({
      name: form.name.trim(),
      email: form.email,
      password: form.password,
      image: form.image || undefined,
    });
    setBusy(false);
    if (error) {
      const msg = error.message || "We couldn't create your account. Please try again.";
      setError(msg);
      toast.error(msg);
      return;
    }
    toast.success("Account created. Please log in.");
    router.push(`/login${redirect !== "/" ? `?redirect=${encodeURIComponent(redirect)}` : ""}`);
  }

  return (
    <div className="mx-auto grid min-h-[70vh] max-w-md place-items-center px-4 py-12">
      <div className="w-full rounded-box border border-base-content/10 bg-base-200 p-8">
        <div className="mb-6 flex justify-center"><Logo /></div>
        <h1 className="mb-6 text-center text-3xl">Create your account</h1>
        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <label className="block"><span className="mb-1 block text-sm">Name</span>
            <input required autoComplete="name" className="input input-bordered w-full" value={form.name} onChange={set("name")} /></label>
          <label className="block"><span className="mb-1 block text-sm">Email</span>
            <input type="email" required autoComplete="email" className="input input-bordered w-full" value={form.email} onChange={set("email")} /></label>
          <label className="block"><span className="mb-1 block text-sm">Photo URL (optional)</span>
            <input type="url" placeholder="https://" className="input input-bordered w-full" value={form.image} onChange={set("image")} /></label>
          <label className="block"><span className="mb-1 block text-sm">Password</span>
            <input type="password" required autoComplete="new-password" className="input input-bordered w-full" value={form.password} onChange={set("password")} aria-describedby="pw-rules" /></label>
          <ul id="pw-rules" className="space-y-1 text-sm">
            {PASSWORD_RULES.map((r) => {
              const ok = r.test(form.password);
              return (
                <li key={r.id} className={`flex items-center gap-2 ${ok ? "text-success" : "text-base-content/60"}`}>
                  {ok ? <Check className="size-4" aria-hidden="true" /> : <Circle className="size-4" aria-hidden="true" />}
                  {r.label}<span className="sr-only">{ok ? " (met)" : " (not met)"}</span>
                </li>
              );
            })}
          </ul>
          {error && <p role="alert" className="text-sm text-error">{error}</p>}
          <button type="submit" className="btn btn-primary w-full" disabled={busy}>
            {busy && <span className="loading loading-spinner loading-sm" aria-hidden="true" />} Register
          </button>
        </form>
        <div className="divider text-xs">or</div>
        <button type="button" className="btn btn-outline w-full" onClick={() => authClient.signIn.social({ provider: "google", callbackURL: "/" })}>
          Continue with Google
        </button>
        <p className="mt-6 text-center text-sm text-base-content/70">
          Already have an account? <Link className="link link-primary" href="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
