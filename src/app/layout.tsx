import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hari Ram AWPL Store | Premium Ayurvedic & Wellness",
  description: "Hari Ram AWPL Store - Premium Ayurvedic, Wellness & Personal Care products. Order directly on WhatsApp.",
  openGraph: {
    title: "Hari Ram AWPL Store",
    description: "Premium Ayurvedic & Wellness Products",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
