import type { MetadataRoute } from "next";
import { catalogueCategories } from "@/data/catalogue";
import { products } from "@/data/products";

export const dynamic = "force-static";

const SITE_URL = "https://vinitprajapat0822-coder.github.io/hari-ram-awpl-store";

export default function sitemap(): MetadataRoute.Sitemap {
  const informationalRoutes = ["", "about/", "privacy/", "product-disclaimer/"];
  const pages: MetadataRoute.Sitemap = informationalRoutes.map((route) => ({
    url: SITE_URL + "/" + route,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.4,
  }));

  const categoryPages: MetadataRoute.Sitemap = catalogueCategories.map((category) => ({
    url: SITE_URL + "/category/" + category.slug + "/",
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const productPages: MetadataRoute.Sitemap = products.map((product) => ({
    url: SITE_URL + "/product/" + encodeURIComponent(product.id) + "/",
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...pages, ...categoryPages, ...productPages];
}
