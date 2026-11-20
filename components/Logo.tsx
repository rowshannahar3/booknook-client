import Link from "next/link";

/* Two logo files: ivory-and-peach for the dark theme, charcoal-and-peach for the light theme. */
export default function Logo({ className = "h-9" }: { className?: string }) {
  return (
    <Link href="/" className="inline-flex items-center" aria-label="BookNook home">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo-dark.png" alt="BookNook" className={`${className} w-auto hidden dark:block`} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo-light.png" alt="" aria-hidden="true" className={`${className} w-auto dark:hidden`} />
    </Link>
  );
}
