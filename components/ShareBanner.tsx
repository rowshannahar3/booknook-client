import Link from "next/link";
import Reveal from "./Reveal";

export default function ShareBanner() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
      <Reveal>
        <div className="rounded-[2rem] bg-gradient-to-br from-orange-300 to-orange-100 p-10 text-center text-neutral">
          <h2 className="mb-2 text-3xl sm:text-4xl">Got a book to share?</h2>
          <p className="mx-auto mb-6 max-w-md">Add it to the shelves and let another reader find their next favourite.</p>
          <Link href="/add-book" className="btn btn-neutral">Add a Book</Link>
        </div>
      </Reveal>
    </section>
  );
}
