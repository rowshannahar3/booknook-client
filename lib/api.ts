import { authClient } from "./auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";
const FALLBACK = "We couldn't complete that request. Please try again in a moment.";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

type Options = { method?: string; body?: unknown; auth?: boolean };

export async function api<T>(path: string, { method = "GET", body, auth = true }: Options = {}): Promise<T> {
  const headers: Record<string, string> = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";

  if (auth) {
    const { data } = await authClient.token(); // short-lived JWT from BetterAuth
    if (!data?.token) throw new ApiError(401, "Your session has expired. Please sign in again to continue.");
    headers.Authorization = `Bearer ${data.token}`;
  }

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(0, FALLBACK);
  }

  const json = await res.json().catch(() => null);
  if (!res.ok) throw new ApiError(res.status, json?.message ?? FALLBACK);
  return json as T;
}
