"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { authClient, useSession } from "@/lib/auth-client";
import { safeRedirect } from "@/lib/utils";
import Logo from "../Logo";

export default function LoginView() {
  const router = useRouter();
  const redirect = safeRedirect(useSearchParams().get("redirect"));
  const { data: session } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (session) router.replace(redirect); }, [session, redirect, router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    const { error } = await authClient.signIn.email({ email, password });
    setBusy(false);
    if (error) {
      const msg = error.message || "That email and password don't match. Please try again.";
      setError(msg);
      toast.error(msg);
      return;
    }
    toast.success("Welcome back to BookNook.");
    router.replace(redirect);
  }

  async function google() {
    await authClient.signIn.social({ provider: "google", callbackURL: redirect });
  }

  return (
    <div className="mx-auto grid min-h-[70vh] max-w-md place-items-center px-4 py-12">
      <div className="w-full rounded-box border border-base-content/10 bg-base-200 p-8">
        <div className="mb-6 flex justify-center"><Logo /></div>
        <h1 className="mb-6 text-center text-3xl">Login</h1>
        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <label className="block">
            <span className="mb-1 block text-sm">Email</span>
            <input type="email" required autoComplete="email" className="input input-bordered w-full" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm">Password</span>
            <span className="input input-bordered flex w-full items-center gap-2">
              <input type={show ? "text" : "password"} required autoComplete="current-password" className="grow" value={password} onChange={(e) => setPassword(e.target.value)} />
              <button type="button" onClick={() => setShow(!show)} aria-label={show ? "Hide password" : "Show password"} className="opacity-70 hover:opacity-100">
                {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </span>
          </label>
          <div className="text-right">
            <button type="button" className="link link-hover text-sm" onClick={() => toast.info("Password reset isn't available yet. Please contact the library team.")}>
              Forgot password?
            </button>
          </div>
          {error && <p role="alert" className="text-sm text-error">{error}</p>}
          <button type="submit" className="btn btn-primary w-full" disabled={busy || !email || !password}>
            {busy && <span className="loading loading-spinner loading-sm" aria-hidden="true" />} Login
          </button>
        </form>
        <div className="divider text-xs">or</div>
        <button type="button" className="btn btn-outline w-full" onClick={google}>Continue with Google</button>
        <p className="mt-6 text-center text-sm text-base-content/70">
          New to BookNook? <Link className="link link-primary" href={`/register${redirect !== "/" ? `?redirect=${encodeURIComponent(redirect)}` : ""}`}>Register</Link>
        </p>
      </div>
    </div>
  );
}
