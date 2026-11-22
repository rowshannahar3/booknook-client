"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion, type Variants } from "framer-motion";
import { CalendarClock, CheckCircle2, MousePointerClick, Search, Undo2 } from "lucide-react";
import { DUE_SOON_DAYS, LOAN_DAYS } from "@/lib/utils";
import Reveal from "./Reveal";

const STEPS = [
  {
    icon: Search,
    title: "Find a book",
    text: "Browse the catalogue, filter by shelf, and open any book to see its details and how many copies are free.",
  },
  {
    icon: MousePointerClick,
    title: "Borrow it",
    text: `Log in, press Borrow This Book, and confirm. One copy leaves the shelf and is yours for ${LOAN_DAYS} days.`,
  },
  {
    icon: CalendarClock,
    title: "Read and track",
    text: `Your return date is set for you. Follow it in My Borrows, where a Due Soon tag appears ${DUE_SOON_DAYS} days before.`,
  },
  {
    icon: Undo2,
    title: "Return it",
    text: "Press Return Book when you are done. The copy goes straight back on the shelf for the next reader.",
  },
];

const STEP_MS = 2000;

const list: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.25, delayChildren: 0.1 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function HowItWorks() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const inView = useInView(wrapRef, { margin: "-80px" });
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  // The highlight walks through the four steps again and again while the section is on screen.
  useEffect(() => {
    if (!inView || paused || reduceMotion) return;
    const id = setInterval(() => setActive((a) => (a + 1) % STEPS.length), STEP_MS);
    return () => clearInterval(id);
  }, [inView, paused, reduceMotion]);

  const current = reduceMotion ? -1 : active; // -1 = no highlighting, every step looks complete
  const lit = (i: number) => current === -1 || i <= current;
  const progress = current === -1 ? 1 : current / (STEPS.length - 1);

  return (
    <section className="mx-auto max-w-7xl px-4 pt-40 pb-50 sm:px-6" aria-labelledby="how">
      <Reveal>
        <h2 id="how" className="mb-2 text-3xl sm:text-4xl">How Borrowing Works</h2>
        <p className="mb-12 text-base-content/70">Four simple steps, from finding a book to giving it back.</p>
      </Reveal>

      <div
        ref={wrapRef}
        className="relative"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        {/* Mobile: a plain vertical guide line */}
        <div className="absolute bottom-7 left-7 top-7 w-0.5 bg-primary/30 md:hidden" aria-hidden="true" />

        {/* Desktop: a track whose orange fill follows the active step */}
        <div className="absolute left-[12.5%] right-[12.5%] top-7 hidden h-0.5 bg-base-content/15 md:block" aria-hidden="true">
          <motion.div
            className="h-full w-full origin-left bg-primary"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: inView ? progress : 0 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
          />
        </div>

        <motion.ol
          className="relative grid gap-10 md:grid-cols-4 md:gap-6"
          variants={list}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
        >
          {STEPS.map((s, i) => {
            const isActive = i === current;
            return (
              <motion.li key={s.title} variants={item} className="flex gap-4 md:flex-col md:items-center md:text-center" aria-current={isActive ? "step" : undefined}>
                <motion.div
                  animate={{ scale: isActive ? 1.15 : 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 18 }}
                  className={`relative z-10 grid size-14 shrink-0 place-items-center rounded-full border-2 transition-colors duration-500 ${isActive
                      ? "border-primary bg-primary text-primary-content"
                      : lit(i)
                        ? "border-primary bg-base-100 text-primary"
                        : "border-base-content/20 bg-base-100 text-base-content/50"
                    }`}
                >
                  {isActive && !reduceMotion && (
                    <motion.span
                      key={`ring-${current}`}
                      className="absolute inset-0 rounded-full border-2 border-primary"
                      initial={{ scale: 1, opacity: 0.7 }}
                      animate={{ scale: 1.8, opacity: 0 }}
                      transition={{ duration: 1.3, ease: "easeOut" }}
                      aria-hidden="true"
                    />
                  )}
                  <s.icon className="size-6" aria-hidden="true" />
                  <span className="absolute -right-1 -top-1 grid size-6 place-items-center rounded-full bg-base-content text-xs font-semibold text-base-100">
                    {i + 1}
                  </span>
                </motion.div>
                <div className={`transition-opacity duration-500 ${current === -1 || isActive ? "opacity-100" : "opacity-60"}`}>
                  <h3 className="mb-1 text-xl">{s.title}</h3>
                  <p className="text-sm text-base-content/70">{s.text}</p>
                </div>
              </motion.li>
            );
          })}
        </motion.ol>
      </div>
    </section>
  );
}