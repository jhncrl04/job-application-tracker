import { Suspense } from "react";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { createClient } from "@/lib/supabase-server";
import { SOURCE_LABEL, STATUSES } from "@/lib/constants";
import type { Application } from "@/lib/types";
import SignOutButton from "@/components/SignOutButton";
import ApplicationDialog from "@/components/ApplicationDialog";
import RowActions from "@/components/RowActions";
import StatusSelect from "@/components/StatusSelect";
import StatusTabs from "@/components/StatusTabs";
import Pagination from "@/components/Pagination";
import SearchBox from "@/components/SearchBox";

const PAGE_SIZE = 10;
const FILTERS: string[] = ["all", ...STATUSES, "review"];

const dateFormat = new Intl.DateTimeFormat("en-PH", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "Asia/Manila",
});

type SearchParams = Promise<{ page?: string; status?: string; q?: string }>;

// strips characters that have special meaning in database search filters
function cleanQuery(raw: string | undefined) {
  return (raw ?? "")
    .replace(/[%,()"\\*_]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 100);
}

async function Applications({ searchParams }: { searchParams: SearchParams }) {
  const auth = await createClient();
  const {
    data: { user },
  } = await auth.auth.getUser();
  if (!user) redirect("/login");

  const params = await searchParams;
  const q = cleanQuery(params.q);
  const status = FILTERS.includes(params.status ?? "")
    ? (params.status as string)
    : "all";

  const search = q ? `job_title.ilike.%${q}%,company.ilike.%${q}%` : null;

  // tab counts (respecting the search)
  let countQuery = supabase.from("applications").select("status, needs_review");
  if (search) countQuery = countQuery.or(search);
  const { data: rows } = await countQuery;

  const counts: Record<string, number> = {
    all: 0,
    review: 0,
    applied: 0,
    interviewing: 0,
    offer: 0,
    rejected: 0,
  };
  rows?.forEach((r) => {
    counts.all++;
    if (r.needs_review) counts.review++;
    if ((STATUSES as readonly string[]).includes(r.status)) counts[r.status]++;
  });

  // pagination
  const total = counts[status];
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(
    Math.max(1, parseInt(params.page ?? "1", 10) || 1),
    totalPages,
  );
  const from = (page - 1) * PAGE_SIZE;

  let query = supabase
    .from("applications")
    .select("*")
    .order("applied_at", { ascending: false })
    .order("created_at", { ascending: false });
  if (search) query = query.or(search);
  if (status === "review") query = query.eq("needs_review", true);
  else if (status !== "all") query = query.eq("status", status);

  const { data } = await query.range(from, from + PAGE_SIZE - 1);
  const apps = (data ?? []) as Application[];

  return (
    <>
      <SearchBox q={q} status={status} />
      <StatusTabs active={status} counts={counts} q={q} />

      {apps.length === 0 ? (
        <div className="rounded-xl border border-line bg-white px-6 py-12 text-center text-sm text-muted">
          {q
            ? `No applications match “${q}”.`
            : status === "all"
              ? "No applications yet. Add one with the button above, or wait for the next email sync."
              : "Nothing here right now."}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-line bg-white">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="border-b border-line text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="hidden px-4 py-3 font-medium sm:table-cell">
                  Source
                </th>
                <th className="px-4 py-3 font-medium">Applied</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {apps.map((a) => (
                <tr key={a.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 align-top">
                    <div className="flex flex-wrap items-center gap-2">
                      {a.job_url && /^https?:\/\//i.test(a.job_url) ? (
                        <a
                          href={a.job_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium hover:underline"
                        >
                          {a.job_title}
                        </a>
                      ) : (
                        <span className="font-medium">{a.job_title}</span>
                      )}
                      {a.needs_review && (
                        <span className="rounded bg-[#FBF1DC] px-1.5 py-0.5 text-xs font-medium text-[#8A5A0B]">
                          Needs review
                        </span>
                      )}
                    </div>
                    <div className="text-muted">
                      {a.company ?? "Company missing"}
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 align-top text-muted sm:table-cell">
                    {SOURCE_LABEL[a.source] ?? a.source}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 align-top text-muted">
                    {dateFormat.format(new Date(a.applied_at))}
                  </td>
                  <td className="px-4 py-3 align-top">
                    <StatusSelect id={a.id} status={a.status} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 align-top">
                    <RowActions application={a} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Pagination
        page={page}
        totalPages={totalPages}
        total={total}
        pageSize={PAGE_SIZE}
        status={status}
        q={q}
      />
    </>
  );
}

export default function Home({ searchParams }: { searchParams: SearchParams }) {
  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <header className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">Applications</h1>
        <div className="flex items-center gap-4">
          <SignOutButton />
          <ApplicationDialog className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-[#263d66]">
            Add application
          </ApplicationDialog>
        </div>
      </header>

      <Suspense fallback={<p className="text-sm text-muted">Loading…</p>}>
        <Applications searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
