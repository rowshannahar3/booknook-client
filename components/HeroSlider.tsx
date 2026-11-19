"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Autoplay, EffectFade, Keyboard, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

const SLIDES = [
  {
    title: "Stories Travel Further When Shared.",
    text: "Discover a shared collection where beloved books find new readers and every borrowed story begins a new journey.",
    image: "/images/hero-1.png",
    alt: "A group of books displayed on round cream pedestals",
  },
  {
    title: "Add a Book, Lend a Story.",
    text: "Contribute a title from your shelf and let other readers discover it. Every book you add grows the library.",
    image: "/images/hero-2.png",
    alt: "An open book beside a small stack of books on a pedestal",
  },
  {
    title: "Borrow Today, Return With Ease.",
    text: "Borrow a copy for seven days, see your due date, and return it in one click.",
    image: "/images/hero-3.png",
    alt: "A stack of books beside a due-date card on a pedestal",
  },
];

export default function HeroSlider() {
  const reduceMotion = useReducedMotion();
  return (
    <section aria-label="Featured" className="bg-base-100 pb-10">
      <h1 className="sr-only">BookNook, a small online library</h1>
      <Swiper
        modules={[Autoplay, Pagination, EffectFade, A11y, Keyboard]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        loop
        keyboard
        a11y={{ enabled: true }}
        pagination={{ clickable: true }}
        autoplay={reduceMotion ? false : { delay: 5500, pauseOnMouseEnter: true, disableOnInteraction: false }}
      >
        {SLIDES.map((s) => (
          <SwiperSlide key={s.title}>
            <div className="mx-auto flex max-w-7xl flex-col items-center px-4 pb-12 pt-12 text-center sm:px-6">
              <h2 className="max-w-3xl text-4xl sm:text-5xl lg:text-6xl">{s.title}</h2>
              <p className="mt-4 max-w-xl text-base-content/80">{s.text}</p>
              <Link href="/books" className="btn btn-primary mt-6">
                Browse Books <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <div className="mt-10 grid h-[260px] w-full place-items-center overflow-hidden rounded-[2rem] bg-gradient-to-br from-sky-100 via-orange-50 to-orange-200 sm:h-[380px] lg:h-[460px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.image} alt={s.alt} className="size-full object-cover object-top" onError={(e) => (e.currentTarget.style.display = "none")} />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
