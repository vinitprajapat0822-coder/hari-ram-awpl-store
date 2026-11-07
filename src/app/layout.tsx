import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { MotionConfig } from "framer-motion";
import "./globals.css";
import StoreHydration from "@/components/StoreHydration";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], display: "swap" });

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <MotionConfig reducedMotion="user">
          <StoreHydration />
          {children}
          <Footer />
        </MotionConfig>
      </body>
    </html>
  );
}
