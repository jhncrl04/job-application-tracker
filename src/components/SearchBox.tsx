import Link from "@/components/NavLink";
import { listHref } from "@/lib/url";

export default function SearchBox({
  q,
  status,
}: {
  q: string;
  status: string;
}) {
  return (
    <form action="/" method="get" role="search" className="mb-4 flex gap-2">
      {status !== "all" && <input type="hidden" name="status" value={status} />}
      <input
        key={q}
        type="search"
        name="q"
        defaultValue={q}
        placeholder="Search by job title or company"
        aria-label="Search applications"
        className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm"
      />
      <button className="rounded-lg border border-line bg-white px-4 py-2 text-sm hover:bg-mist">
        Search
      </button>
      {q && (
        <Link
          href={listHref({ status })}
          className="self-center whitespace-nowrap text-sm text-muted hover:text-ink"
        >
          Clear
        </Link>
      )}
    </form>
  );
}
