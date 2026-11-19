"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Menu } from "lucide-react";
import { authClient, useSession } from "@/lib/auth-client";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import Avatar from "./Avatar";

const PUBLIC_LINKS = [
  { href: "/", label: "Home" },
  { href: "/books", label: "All Books" },
];
const PRIVATE_LINKS = [
  { href: "/add-book", label: "Add Book" },
  { href: "/my-books", label: "My Books" },
  { href: "/my-borrows", label: "My Borrows" },
];

const closeMenus = () => (document.activeElement as HTMLElement | null)?.blur();

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const links = user ? [...PUBLIC_LINKS, ...PRIVATE_LINKS] : PUBLIC_LINKS;

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const linkClass = (href: string) =>
    `rounded-lg px-3 py-2 text-sm transition-colors hover:text-primary ${isActive(href) ? "text-primary font-medium" : ""}`;

  async function handleLogout() {
    closeMenus();
    await authClient.signOut();
    queryClient.clear();
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-base-content/10 bg-base-100">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6" aria-label="Main">
        <div className="flex items-center gap-2">
          <div className="dropdown lg:hidden">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle" aria-label="Open menu">
              <Menu className="size-5" aria-hidden="true" />
            </div>
            <ul tabIndex={0} className="menu dropdown-content z-50 mt-3 w-60 rounded-box border border-base-content/10 bg-base-200 p-2 shadow-lg">
              {links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} onClick={closeMenus} className={isActive(l.href) ? "text-primary" : ""}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <Logo />
        </div>

        <ul className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className={linkClass(l.href)} aria-current={isActive(l.href) ? "page" : undefined}>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {isPending ? (
            <span className="skeleton size-10 rounded-full" aria-hidden="true" />
          ) : user ? (
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle" aria-label="Open account menu">
                <Avatar name={user.name} image={user.image} />
              </div>
              <ul tabIndex={0} className="menu dropdown-content z-50 mt-3 w-60 rounded-box border border-base-content/10 bg-base-200 p-2 shadow-lg">
                <li className="menu-title truncate px-3 py-2 normal-case text-base-content">{user.name}</li>
                <li>
                  <Link href="/profile" onClick={closeMenus}>My Profile</Link>
                </li>
                <li>
                  <button type="button" onClick={handleLogout}>Logout</button>
                </li>
              </ul>
            </div>
          ) : (
            <>
              <Link href="/login" className="btn btn-primary btn-sm sm:btn-md">Login</Link>
              <Link href="/register" className="btn btn-outline btn-primary btn-sm sm:btn-md">Register</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
