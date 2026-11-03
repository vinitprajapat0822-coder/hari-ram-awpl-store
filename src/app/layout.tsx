import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import AnimationProvider from "@/components/AnimationProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hari Ram AWPL Store | Premium Ayurvedic & Wellness",
  description:
    "Hari Ram AWPL Store - Product catalogue, shopping cart and WhatsApp order requests.",
  openGraph: {
    title: "Hari Ram AWPL Store",
    description: "Browse the Hari Ram AWPL Store product catalogue.",
  },
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <AnimationProvider>{children}</AnimationProvider>
      </body>
    </html>
  );
}
