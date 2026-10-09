import AppHeader from "@/components/AppHeader";
import ApplicationDialog from "@/components/ApplicationDialog";
import { ListSkeleton } from "@/components/skeletons";

export default function Loading() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <AppHeader
        title="Applications"
        switchTo={{ href: "/stats", label: "Statistics" }}
      >
        <ApplicationDialog className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-[#263d66]">
          Add application
        </ApplicationDialog>
      </AppHeader>
      <ListSkeleton />
    </main>
  );
}
