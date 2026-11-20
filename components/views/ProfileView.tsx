"use client";

import { useSession } from "@/lib/auth-client";
import { useBorrows, useMyBooks } from "@/lib/queries";
import RequireAuth from "../RequireAuth";
import Avatar from "../Avatar";

function Profile() {
  const { data: session } = useSession();
  const books = useMyBooks();
  const borrows = useBorrows();
  const user = session?.user;
  return (
    <div className="mx-auto max-w-xl px-4 py-12 sm:px-6">
      <h1 className="mb-8 text-4xl">My Profile</h1>
      <div className="rounded-box border border-base-content/10 bg-base-200 p-8 text-center">
        <div className="mb-4 flex justify-center"><Avatar name={user?.name} image={user?.image} size="size-24" /></div>
        <h2 className="text-2xl">{user?.name}</h2>
        <p className="text-base-content/70">{user?.email}</p>
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="rounded-box bg-base-100 p-4"><div className="font-serif text-3xl text-primary">{books.data?.length ?? "–"}</div><div className="text-sm text-base-content/70">Books added</div></div>
          <div className="rounded-box bg-base-100 p-4"><div className="font-serif text-3xl text-primary">{borrows.data?.length ?? "–"}</div><div className="text-sm text-base-content/70">Active loans</div></div>
        </div>
      </div>
    </div>
  );
}

export default function ProfileView() {
  return <RequireAuth><Profile /></RequireAuth>;
}
