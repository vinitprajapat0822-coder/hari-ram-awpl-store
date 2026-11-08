"use client";

import Link from "next/link";
import { ArrowDown, ArrowUpRight, BadgeCheck, CheckCircle2, Layers3, PackageSearch, ShieldCheck, Sparkles } from "lucide-react";
import { useLanguage } from "@/i18n/useLanguage";

type Props = { productCount: number; categoryCount: number; populatedCategoryCount: number; featuredCategories: string[] };

export default function StorefrontHero({ productCount, categoryCount, populatedCategoryCount, featuredCategories }: Props) {
  const { t, categoryLabel, formatNumber } = useLanguage();

  return (
    <section className="storefront-hero" aria-label={t("heroAria")}>
      <div className="storefront-hero__mesh" aria-hidden="true" />
      <div className="storefront-hero__glow storefront-hero__glow--one" aria-hidden="true" />
      <div className="storefront-hero__glow storefront-hero__glow--two" aria-hidden="true" />
      <div className="storefront-hero__layout">
        <div className="storefront-hero__copy motion-enter motion-enter--left">
          <div className="storefront-hero__eyebrow">
            <span className="storefront-hero__brand-mark">H</span>
            <span>HARI RAM <i /> AWPL {t("authStoreSuffix").toUpperCase()}</span>
            <span className="storefront-hero__eyebrow-tag"><Sparkles size={12} aria-hidden="true" />{t("heroEyebrow")}</span>
          </div>
          <h1 id="storefront-hero-title" aria-label={t("heroTitle")} className="storefront-hero__title">
            {t("heroTitle")}
          </h1>
          <p className="storefront-hero__description">
            {t("heroDescription")} {formatNumber(populatedCategoryCount)} / {formatNumber(categoryCount)} {t("categoryCountLabel")}.
          </p>
          <div className="storefront-hero__actions">
            <Link href="#catalogue" className="storefront-hero__primary focus-visible:amber">{t("exploreCatalogue")} <ArrowUpRight size={17} aria-hidden="true" /></Link>
            <Link href="#catalogue-categories" className="storefront-hero__secondary focus-visible:amber">{t("browseCategories")} <ArrowDown size={16} aria-hidden="true" /></Link>
          </div>
          <div className="storefront-hero__stats" role="group" aria-label={t("catalogueOverview")}>
            <div className="storefront-hero__stat"><strong>{formatNumber(productCount)}</strong><span>{t("productCountLabel")}</span></div>
            <div className="storefront-hero__stat"><strong>{formatNumber(categoryCount)}</strong><span>{t("categoryCountLabel")}</span></div>
            <div className="storefront-hero__stat storefront-hero__stat--note"><span className="storefront-hero__stat-icon"><BadgeCheck size={16} aria-hidden="true" /></span><span><b>{t("mrpFirst")}</b><small>{t("clearPricing")}</small></span></div>
          </div>
        </div>
        <div className="storefront-hero__visual motion-enter motion-enter--right" role="group" aria-label={t("catalogueOverview")}>
          <div className="storefront-hero__orbit storefront-hero__orbit--outer" aria-hidden="true" />
          <div className="storefront-hero__orbit storefront-hero__orbit--inner" aria-hidden="true" />
          <div className="storefront-hero__showcase">
            <div className="storefront-hero__showcase-top"><span className="storefront-hero__live-dot" /><span>{t("catalogueOverview").toUpperCase()}</span></div>
            <div className="storefront-hero__showcase-icon"><Layers3 size={38} strokeWidth={1.35} aria-hidden="true" /><span className="storefront-hero__icon-spark"><Sparkles size={13} aria-hidden="true" /></span></div>
            <p className="storefront-hero__showcase-kicker">{t("exploreWithClarity")}</p>
            <h2>{t("everydayRange")}</h2>
            <p className="storefront-hero__showcase-copy">{t("singlePlace")}</p>
            <div className="storefront-hero__category-preview" role="group" aria-label={t("categoryNavigation")}>
              {featuredCategories.slice(0, 3).map((category) => <span key={category}>{categoryLabel(category)}</span>)}
            </div>
          </div>
          <div className="storefront-hero__float-card storefront-hero__float-card--top">
            <span className="storefront-hero__float-icon"><PackageSearch size={17} aria-hidden="true" /></span>
            <span><b>{t("easyDiscovery")}</b><small>{t("easyDiscoveryDescription")}</small></span>
          </div>
          <div className="storefront-hero__float-card storefront-hero__float-card--bottom">
            <span className="storefront-hero__float-icon storefront-hero__float-icon--mint"><ShieldCheck size={17} aria-hidden="true" /></span>
            <span><b>{t("confidentEnquiry")}</b><small>{t("confirmBeforeOrder")}</small></span>
            <CheckCircle2 className="storefront-hero__float-check" size={16} aria-hidden="true" />
          </div>
          <span className="storefront-hero__visual-caption">{t("browseCompare")}</span>
        </div>
      </div>
    </section>
  );
}
