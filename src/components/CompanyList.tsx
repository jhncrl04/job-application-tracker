"use client";

import { useState } from "react";
import { BarList } from "./charts";

export default function CompanyList({
  companies,
  topCount = 10,
}: {
  companies: { name: string; count: number }[];
  topCount?: number;
}) {
  const [showAll, setShowAll] = useState(false);
  const canToggle = companies.length > topCount;
  const visible = showAll ? companies : companies.slice(0, topCount);
  const items = visible.map((c) => ({ label: c.name, value: c.count }));

  return (
    <div>
      <div
        {...(showAll
          ? {
              className: "max-h-96 overflow-y-auto pr-2",
              tabIndex: 0,
              role: "region",
              "aria-label": "All companies",
            }
          : {})}
      >
        <BarList items={items} />
      </div>

      {canToggle && (
        <button
          type="button"
          onClick={() => setShowAll((v) => !v)}
          aria-expanded={showAll}
          className="mt-4 text-sm font-medium hover:underline"
        >
          {showAll
            ? `Show top ${topCount} only`
            : `Show all ${companies.length} companies`}
        </button>
      )}
    </div>
  );
}
