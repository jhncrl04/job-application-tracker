import Link from "next/link";
import { listHref } from "@/lib/url";

export default function Pagination({
  page,
  totalPages,
  total,
  pageSize,
  status,
  q,
}: {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  status: string;
  q: string;
}) {
  if (total === 0) return null;

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);
  const btn = "rounded-lg border border-line bg-white px-3 py-1.5";

  return (
    <nav
      aria-label="Pagination"
      className="mt-4 flex items-center justify-between text-sm text-muted"
    >
      <p>
        Showing {from} to {to} of {total}
      </p>
      <div className="flex items-center gap-3">
        {page > 1 ? (
          <Link
            href={listHref({ status, q, page: page - 1 })}
            className={`${btn} text-ink hover:bg-mist`}
          >
            Previous
          </Link>
        ) : (
          <span className={`${btn} opacity-40`}>Previous</span>
        )}
        <span>
          Page {page} of {totalPages}
        </span>
        {page < totalPages ? (
          <Link
            href={listHref({ status, q, page: page + 1 })}
            className={`${btn} text-ink hover:bg-mist`}
          >
            Next
          </Link>
        ) : (
          <span className={`${btn} opacity-40`}>Next</span>
        )}
      </div>
    </nav>
  );
}
