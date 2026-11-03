import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import StoreHydration from "@/components/StoreHydration";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hari Ram AWPL Store | AWPL Category Catalogue",
  description: "Browse AWPL category listings with MRP references, product variants and image placeholders. Send an order enquiry on WhatsApp.",
  openGraph: {
    title: "Hari Ram AWPL Store",
    description: "AWPL category catalogue with MRP references and product variants.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <StoreHydration />
        {children}
      </body>
    </html>
  );
}
