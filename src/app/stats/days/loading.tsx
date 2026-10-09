import AppHeader from "@/components/AppHeader";
import { DaysSkeleton } from "@/components/skeletons";

export default function Loading() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <AppHeader
        title="Daily details"
        switchTo={{ href: "/stats", label: "Statistics" }}
      />
      <DaysSkeleton />
    </main>
  );
}
