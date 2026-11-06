import type { Metadata } from "next";
import AboutContent from "@/components/AboutContent";
export const metadata: Metadata = {
 title: "About Us | Hari Ram AWPL Store",
 description: "Meet Hari Ram AWPL Store, an independent AWPL product store managed by Hariram Prajapat. Browse the catalogue and contact the store directly.",
};
export default function AboutPage() { return <AboutContent />; }
