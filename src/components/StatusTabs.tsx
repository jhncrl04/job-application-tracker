import Link from "next/link";
import { STATUSES, STATUS_LABEL } from "@/lib/constants";

const TABS = [
  { key: "all", label: "All" },
  ...STATUSES.map((s) => ({ key: s as string, label: STATUS_LABEL[s] })),
  { key: "review", label: "Needs review" },
];

export default function StatusTabs({
  active,
  counts,
}: {
  active: string;
  counts: Record<string, number>;
}) {
  return (
    <nav
      aria-label="Filter by status"
      className="mb-4 flex gap-1 overflow-x-auto border-b border-line"
    >
      {TABS.map((t) => {
        const isActive = t.key === active;
        return (
          <Link
            key={t.key}
            href={t.key === "all" ? "/" : `/?status=${t.key}`}
            aria-current={isActive ? "page" : undefined}
            className={`-mb-px whitespace-nowrap border-b-2 px-3 py-2 text-sm ${
              isActive
                ? "border-brand font-semibold text-ink"
                : "border-transparent text-muted hover:text-ink"
            }`}
          >
            {t.label} <span className="text-muted">{counts[t.key] ?? 0}</span>
          </Link>
        );
      })}
    </nav>
  );
}
