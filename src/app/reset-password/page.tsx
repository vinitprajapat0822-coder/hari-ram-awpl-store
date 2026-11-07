import type { Metadata } from "next";
import ResetPasswordForm from "@/components/ResetPasswordForm";

export const metadata: Metadata = {
  title: "Reset Password | HARI RAM AWPL Store",
  description: "Set a new password for your HARI RAM AWPL Store customer account.",
};

export default function ResetPasswordPage() {
  return <ResetPasswordForm />;
}
