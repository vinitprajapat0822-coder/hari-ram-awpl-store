import type { Metadata } from "next";
import { Inter, Noto_Sans_Devanagari } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import "@zakisheriff/liquid-glass/styles.css";
import "./liquid-glass-theme.css";
import StoreHydration from "@/components/StoreHydration";
import Footer from "@/components/Footer";
import CatalogueAssistant from "@/components/CatalogueAssistant";
import { LanguageProvider } from "@/i18n/LanguageProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap", preload: true });
const devanagari = Noto_Sans_Devanagari({ subsets: ["devanagari"], variable: "--font-devanagari", display: "swap", preload: true });

// Static export emits English metadata. The in-page language toggle updates document.lang.
// Both descriptions are retained here; GitHub Pages serves the English static metadata.
export const metadataDescriptions = {
  en: "Explore the Hari Ram AWPL product catalogue, review listed MRP and pack sizes, and send an order enquiry on WhatsApp.",
  hi: "Hari Ram AWPL उत्पाद कैटलॉग देखें, सूचीबद्ध एमआरपी और पैक आकार जाँचें तथा WhatsApp पर ऑर्डर पूछताछ भेजें।",
} as const;

export const metadata: Metadata = {
  title: "Hari Ram AWPL Store | Everyday Essentials",
  description: metadataDescriptions.en,
  applicationName: "Hari Ram AWPL Store",
  openGraph: {
    title: "Hari Ram AWPL Store",
    description: "A clearer, calmer way to explore the AWPL catalogue.",
    type: "website",
  },
};

const basePath = process.env.NODE_ENV === "production" ? "/hari-ram-awpl-store" : "";

const restoreLanguageScript = `(function(){try{var l=localStorage.getItem('lang');if(l==='hi'||l==='en'){document.documentElement.lang=l;}}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${devanagari.variable}`}>
        <Script id="restore-language" strategy="beforeInteractive">{restoreLanguageScript}</Script>
        <svg
          aria-hidden="true"
          className="crystal-refraction-defs"
          width="0"
          height="0"
          focusable="false"
        >
          <defs>
            <filter
              id="hari-ram-crystal-refraction"
              x="-15%"
              y="-15%"
              width="130%"
              height="130%"
              colorInterpolationFilters="sRGB"
            >
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.008 0.012"
                numOctaves="2"
                seed="7"
                result="crystalNoise"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="crystalNoise"
                scale="3.5"
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
          </defs>
        </svg>
        <div
          className="ambient-backdrop"
          style={{ backgroundImage: `url("${basePath}/midnight-teal-backdrop.svg")` }}
          aria-hidden="true"
        />
        <LanguageProvider>
            <StoreHydration />
            {children}
            <Footer />
            <CatalogueAssistant />
        </LanguageProvider>
      </body>
    </html>
  );
}
