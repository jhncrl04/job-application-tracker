import AppHeader from "@/components/AppHeader";
import { StatsSkeleton } from "@/components/skeletons";

export default function Loading() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <AppHeader
        title="Statistics"
        switchTo={{ href: "/", label: "Applications" }}
      />
      <StatsSkeleton />
    </main>
  );
}
