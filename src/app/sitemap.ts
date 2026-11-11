import type { MetadataRoute } from "next";

const BASE_PATH = "/hari-ram-awpl-store";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: BASE_PATH + "/",
      disallow: [
        BASE_PATH + "/cart/",
        BASE_PATH + "/wishlist/",
        BASE_PATH + "/profile/",
        BASE_PATH + "/login/",
        BASE_PATH + "/reset-password/",
      ],
    },
    sitemap: "https://vinitprajapat0822-coder.github.io" + BASE_PATH + "/sitemap.xml",
  };
}
