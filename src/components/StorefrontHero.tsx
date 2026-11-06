"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowDown,
  ArrowUpRight,
  BadgeCheck,
  Boxes,
  CheckCircle2,
  Layers3,
  PackageSearch,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

type Props = {
  productCount: number;
  categoryCount: number;
  featuredCategories: string[];
};

const formatCount = (value: number) => value.toLocaleString("en-IN");

export default function StorefrontHero({
  productCount,
  categoryCount,
  featuredCategories,
}: Props) {
  const reducedMotion = useReducedMotion();

  const entrance = (delay: number) => ({
    initial: reducedMotion ? false : { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reducedMotion ? 0 : 0.55, delay: reducedMotion ? 0 : delay, ease: "easeOut" as const },
  });

  return (
    <section
      className="storefront-hero"
      aria-label="Store introduction"
    >
      <div className="storefront-hero__mesh" aria-hidden="true" />
      <div className="storefront-hero__glow storefront-hero__glow--one" aria-hidden="true" />
      <div className="storefront-hero__glow storefront-hero__glow--two" aria-hidden="true" />

      <div className="storefront-hero__layout">
        <motion.div className="storefront-hero__copy" {...entrance(0.04)}>
          <div className="storefront-hero__eyebrow">
            <span className="storefront-hero__brand-mark">H</span>
            <span>HARI RAM <i /> AWPL STORE</span>
            <span className="storefront-hero__eyebrow-tag">
              <Sparkles size={12} aria-hidden="true" />
              Product catalogue
            </span>
          </div>

          <h1
            id="storefront-hero-title"
            aria-label="HARI RAM — Everyday essentials, one clear catalogue"
            className="storefront-hero__title"
          >
            Everyday essentials,
            <span>one clear catalogue.</span>
          </h1>

          <p className="storefront-hero__description">
            Explore the AWPL range by category, find the right pack size, and review listed MRP
            before sending an order enquiry.
          </p>

          <div className="storefront-hero__actions">
            <Link href="#catalogue" className="storefront-hero__primary">
              Explore catalogue
              <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
            <Link href="#catalogue-categories" className="storefront-hero__secondary">
              Browse categories
              <ArrowDown size={16} aria-hidden="true" />
            </Link>
          </div>

          <div className="storefront-hero__stats" role="group" aria-label="Catalogue overview">
            <div className="storefront-hero__stat">
              <strong>{formatCount(productCount)}</strong>
              <span>listed products</span>
            </div>
            <div className="storefront-hero__stat">
              <strong>{formatCount(categoryCount)}</strong>
              <span>categories in navigation</span>
            </div>
            <div className="storefront-hero__stat storefront-hero__stat--note">
              <span className="storefront-hero__stat-icon"><BadgeCheck size={16} aria-hidden="true" /></span>
              <span><b>MRP-first</b><small>Clear listed pricing</small></span>
            </div>
          </div>
        </motion.div>

        <motion.div className="storefront-hero__visual" {...entrance(0.16)} role="group" aria-label="Catalogue features">
          <div className="storefront-hero__orbit storefront-hero__orbit--outer" aria-hidden="true" />
          <div className="storefront-hero__orbit storefront-hero__orbit--inner" aria-hidden="true" />

          <div className="storefront-hero__showcase">
            <div className="storefront-hero__showcase-top">
              <span className="storefront-hero__live-dot" />
              <span>CATALOGUE OVERVIEW</span>
            </div>

            <div className="storefront-hero__showcase-icon">
              <Layers3 size={38} strokeWidth={1.35} aria-hidden="true" />
              <span className="storefront-hero__icon-spark"><Sparkles size={13} aria-hidden="true" /></span>
            </div>

            <p className="storefront-hero__showcase-kicker">Explore with clarity</p>
            <h2>Find your<br /><span>everyday range.</span></h2>
            <p className="storefront-hero__showcase-copy">
              A single place to browse products, categories and pack details.
            </p>

            <div className="storefront-hero__category-preview" aria-label="Featured categories">
              {featuredCategories.slice(0, 3).map((category) => (
                <span key={category}>{category}</span>
              ))}
            </div>
          </div>

          <div className="storefront-hero__float-card storefront-hero__float-card--top">
            <span className="storefront-hero__float-icon"><PackageSearch size={17} aria-hidden="true" /></span>
            <span><b>Easy discovery</b><small>Search by name or pack size</small></span>
          </div>

          <div className="storefront-hero__float-card storefront-hero__float-card--bottom">
            <span className="storefront-hero__float-icon storefront-hero__float-icon--mint"><ShieldCheck size={17} aria-hidden="true" /></span>
            <span><b>Enquire with confidence</b><small>Confirm stock and delivery first</small></span>
            <CheckCircle2 className="storefront-hero__float-check" size={16} aria-hidden="true" />
          </div>

          <span className="storefront-hero__visual-caption">Browse <i /> Compare <i /> Enquire</span>
        </motion.div>
      </div>
    </section>
  );
}
