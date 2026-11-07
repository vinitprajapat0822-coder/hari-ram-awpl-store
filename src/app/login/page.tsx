import type { Metadata } from "next";
import LoginExperience from "@/components/LoginExperience";

export const metadata: Metadata = {
  title: "Customer Login | HARI RAM AWPL Store",
  description: "Secure customer sign-in and registration for the HARI RAM AWPL Store.",
};

export default function LoginPage() {
  return <LoginExperience />;
}
