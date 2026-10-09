import Link from "next/link";

type Bar = { label: string; value: number; title: string };

// vertical bars, used for the daily chart
export function BarChart({
  data,
  labelEvery,
  description,
}: {
  data: Bar[];
  labelEvery: number;
  description: string;
}) {
  const max = Math.max(1, ...data.map((d) => d.value));

  return (
    <div role="img" aria-label={description}>
      <p className="mb-2 text-xs text-muted">Tallest bar: {max}</p>
      <div className="flex h-40 items-end gap-px border-b border-line">
        {data.map((d) => (
          <div
            key={d.title}
            title={d.title}
            className="flex h-full flex-1 items-end"
          >
            <div
              className="w-full rounded-t-sm bg-brand"
              style={{
                height: d.value ? `${(d.value / max) * 100}%` : "2px",
                opacity: d.value ? 1 : 0.25,
              }}
            />
          </div>
        ))}
      </div>
      <div className="mt-1 flex gap-px text-[11px] text-muted">
        {data.map((d, i) => (
          <div
            key={d.title}
            className="flex flex-1 justify-center whitespace-nowrap"
          >
            {i % labelEvery === 0 ? d.label : ""}
          </div>
        ))}
      </div>
    </div>
  );
}

// horizontal bars with a label and a number
export function BarList({
  items,
}: {
  items: { label: string; value: number; href?: string }[];
}) {
  const max = Math.max(1, ...items.map((i) => i.value));

  return (
    <ul className="grid gap-2.5">
      {items.map((i) => (
        <li
          key={i.label}
          className="grid grid-cols-[minmax(0,9rem)_1fr_2rem] items-center gap-3 text-sm sm:grid-cols-[minmax(0,12rem)_1fr_2rem]"
        >
          {i.href ? (
            <Link
              href={i.href}
              title={`${i.label}: see each day`}
              className="block truncate underline decoration-line underline-offset-4 hover:decoration-ink"
            >
              {i.label}
            </Link>
          ) : (
            <span className="block truncate" title={i.label}>
              {i.label}
            </span>
          )}
          <div className="h-2 rounded-full bg-mist">
            <div
              className="h-2 rounded-full bg-brand"
              style={{ width: `${(i.value / max) * 100}%` }}
            />
          </div>
          <span className="text-right tabular-nums">{i.value}</span>
        </li>
      ))}
    </ul>
  );
}
