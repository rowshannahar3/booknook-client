import { auth } from "@/lib/auth";

const MAX_BYTES = 5 * 1024 * 1024;

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return Response.json({ message: "Please sign in to upload an image." }, { status: 401 });

  const form = await req.formData();
  const file = form.get("image");
  if (!(file instanceof File)) return Response.json({ message: "No image was provided." }, { status: 400 });
  if (!file.type.startsWith("image/")) return Response.json({ message: "Please choose an image file." }, { status: 400 });
  if (file.size > MAX_BYTES) return Response.json({ message: "Images must be 5 MB or smaller." }, { status: 400 });

  const body = new FormData();
  body.append("image", file);
  const res = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`, {
    method: "POST",
    body,
  });
  const json = await res.json().catch(() => null);
  const url: string | undefined = json?.data?.display_url ?? json?.data?.url;
  if (!res.ok || !url) return Response.json({ message: "The image host rejected the upload." }, { status: 502 });
  return Response.json({ url });
}
