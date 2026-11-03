"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowDownRight, ArrowLeft, ArrowRight, Layers3, PackageCheck, Sparkles } from "lucide-react";

type PromoSlide = {
  eyebrow: string;
  title: [string, string];
  description: string;
  detail: string;
  Icon: typeof Sparkles;
};

const slides: PromoSlide[] = [
  {
    eyebrow: "HARI RAM AWPL",
    title: ["Everyday essentials,", "beautifully organised."],
    description: "Explore wellness, personal care, home and everyday ranges in one calm catalogue.",
    detail: "135 individual product listings",
    Icon: Sparkles,
  },
  {
    eyebrow: "A CLEARER CATALOGUE",
    title: ["Find your range,", "without the clutter."],
    description: "Move through the category collection and narrow the catalogue by name or pack size.",
    detail: "15 category filters",
    Icon: Layers3,
  },
  {
    eyebrow: "SKU-FIRST SHOPPING",
    title: ["Every pack size,", "listed separately."],
    description: "Browse each captured size and apparel SKU as its own product and cart line.",
    detail: "Separate product listings",
    Icon: PackageCheck,
  },
];

type Props = {
  productCount: number;
  categoryCount: number;
};

export default function PromoCarousel({ productCount, categoryCount }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const reducedMotion = useReducedMotion();
  const activeSlide = slides[activeIndex] ?? slides[0]!;
  const Icon = activeSlide.Icon;

  const showSlide = (index: number) => {
    setActiveIndex((index + slides.length) % slides.length);
  };

  useEffect(() => {
    if (reducedMotion) return undefined;
    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 6200);

    return () => window.clearInterval(intervalId);
  }, [reducedMotion]);

  const detail = activeIndex === 0
    ? productCount + " individual product listings"
    : activeIndex === 1
      ? categoryCount + " category filters"
      : activeSlide.detail;

  return (
    <section
      className="hero-panel hero-carousel relative overflow-hidden rounded-[27px] p-5 sm:rounded-[34px] sm:p-9 lg:p-11"
      aria-label="Store highlights"
      aria-roledescription="carousel"
    >
      <div className="hero-carousel__inner relative z-10 grid items-center gap-7 md:grid-cols-[1.2fr_0.8fr]">
        <div className="max-w-2xl">
          <div className="flex items-center justify-between gap-3">
            <span className="hero-eyebrow">{activeSlide.eyebrow}</span>
            <span className="hero-carousel__counter" aria-label={"Slide " + (activeIndex + 1) + " of " + slides.length}>
              {String(activeIndex + 1).padStart(2, "0")} <span>/</span> {String(slides.length).padStart(2, "0")}
            </span>
          </div>

          <div className="hero-carousel__copy" aria-live="off">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeIndex}
                initial={reducedMotion ? false : { opacity: 0, y: 15, filter: "blur(7px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={reducedMotion ? undefined : { opacity: 0, y: -12, filter: "blur(5px)" }}
                transition={{ duration: reducedMotion ? 0 : 0.42, ease: "easeOut" }}
              >
                <h1 className="mt-5 text-[clamp(2.1rem,7vw,4.1rem)] font-black leading-[0.98] tracking-[-0.055em] text-white">
                  <span className="block text-[0.34em] font-extrabold tracking-[0.22em] text-teal-100/75">HARI RAM</span>
                  <span className="mt-3 block">{activeSlide.title[0]}</span>
                  <span className="hero-title-accent mt-1 block">{activeSlide.title[1]}</span>
                </h1>
                <p className="mt-5 max-w-lg text-sm leading-7 text-slate-200/60 sm:text-[15px]">
                  {activeSlide.description}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-4">
            <Link href="#catalogue" className="hero-cta">
              Explore catalogue <ArrowDownRight size={17} aria-hidden="true" />
            </Link>
            <span className="inline-flex items-center gap-2 text-[11px] font-medium text-white/45">
              <PackageCheck size={15} className="text-teal-200/75" aria-hidden="true" />
              {detail}
            </span>
          </div>
        </div>

        <div className="hero-carousel__visual hidden md:grid">
          <div className="hero-orbit">
            <div className="hero-orbit__core"><Icon size={42} strokeWidth={1.25} aria-hidden="true" /></div>
            <span className="hero-orbit__tag hero-orbit__tag--left">Daily care</span>
            <span className="hero-orbit__tag hero-orbit__tag--bottom">Home & living</span>
            <span className="hero-orbit__tag hero-orbit__tag--right">Wellness</span>
          </div>
          <div className="hero-carousel__controls" aria-label="Carousel controls">
            <button type="button" onClick={() => showSlide(activeIndex - 1)} aria-label="Previous highlight">
              <ArrowLeft size={16} aria-hidden="true" />
            </button>
            <div className="hero-carousel__dots" aria-label="Choose highlight">
              {slides.map((slide, index) => (
                <button
                  key={slide.eyebrow}
                  type="button"
                  onClick={() => showSlide(index)}
                  aria-label={"Show highlight " + (index + 1)}
                  aria-current={activeIndex === index ? "true" : undefined}
                  className={activeIndex === index ? "is-active" : ""}
                />
              ))}
            </div>
            <button type="button" onClick={() => showSlide(activeIndex + 1)} aria-label="Next highlight">
              <ArrowRight size={16} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <div className="hero-carousel__mobile-controls md:hidden">
        <button type="button" onClick={() => showSlide(activeIndex - 1)} aria-label="Previous highlight">
          <ArrowLeft size={16} aria-hidden="true" />
        </button>
        <div className="hero-carousel__dots" aria-label="Choose highlight">
          {slides.map((slide, index) => (
            <button
              key={slide.eyebrow}
              type="button"
              onClick={() => showSlide(index)}
              aria-label={"Show highlight " + (index + 1)}
              aria-current={activeIndex === index ? "true" : undefined}
              className={activeIndex === index ? "is-active" : ""}
            />
          ))}
        </div>
        <button type="button" onClick={() => showSlide(activeIndex + 1)} aria-label="Next highlight">
          <ArrowRight size={16} aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
