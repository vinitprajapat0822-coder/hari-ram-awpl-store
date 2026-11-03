import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import ProfileForm from "./ProfileForm";

function ProfileFallback() {
  return (
    <main className="min-h-screen pb-24">
      <Navbar />
      <div
        className="mx-auto max-w-md px-4 pt-6 text-sm text-white/50"
        role="status"
      >
        Loading profile…
      </div>
    </main>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<ProfileFallback />}>
      <ProfileForm />
    </Suspense>
  );
}
