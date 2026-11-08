import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { MotionConfig } from "framer-motion";
import Script from "next/script";
import "./globals.css";
import "@zakisheriff/liquid-glass/styles.css";
import "./liquid-glass-theme.css";
import StoreHydration from "@/components/StoreHydration";
import Footer from "@/components/Footer";
import CatalogueAssistant from "@/components/CatalogueAssistant";
import { LanguageProvider } from "@/i18n/LanguageProvider";

const inter = Inter({ subsets: ["latin"], display: "swap", preload: true });

// Static export emits English metadata. The in-page language toggle updates document.lang.
export const metadata: Metadata = {
  title: "Hari Ram AWPL Store | Everyday Essentials",
  description: "Explore the Hari Ram AWPL product catalogue, review listed MRP and pack sizes, and send an order enquiry on WhatsApp.",
  applicationName: "Hari Ram AWPL Store",
  openGraph: {
    title: "Hari Ram AWPL Store",
    description: "A clearer, calmer way to explore the AWPL catalogue.",
    type: "website",
  },
};

const basePath = process.env.NODE_ENV === "production" ? "/hari-ram-awpl-store" : "";

const restoreLanguageScript = `(function(){try{var l=localStorage.getItem('lang');if(l==='hi'||l==='en'){document.documentElement.lang=l;document.documentElement.dataset.lang=l;}}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Script id="restore-language" strategy="beforeInteractive">{restoreLanguageScript}</Script>
        <div
          className="ambient-backdrop"
          style={{ backgroundImage: `url("${basePath}/midnight-teal-backdrop.svg")` }}
          aria-hidden="true"
        />
        <MotionConfig reducedMotion="user">
          <LanguageProvider>
            <StoreHydration />
            {children}
            <Footer />
            <CatalogueAssistant />
          </LanguageProvider>
        </MotionConfig>
      </body>
    </html>
  );
}
