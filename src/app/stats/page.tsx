import { Suspense } from "react";
import Link from "@/components/NavLink";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import { fetchAllRows } from "@/lib/rows";
import {
  SOURCE_LABEL,
  STATUSES,
  STATUS_COLOR,
  STATUS_LABEL,
} from "@/lib/constants";
import {
  computeStats,
  formatDay,
  formatDayLong,
  formatMonth,
} from "@/lib/stats";
import AppHeader from "@/components/AppHeader";
import { BarChart, BarList } from "@/components/charts";
import CompanyList from "@/components/CompanyList";
import LoadingBoundary from "@/components/LoadingBoundary";
import { StatsSkeleton } from "@/components/skeletons";

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

function Panel({
  title,
  children,
  action,
}: {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-line bg-white p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

async function Stats({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const auth = await createClient();
  const {
    data: { user },
  } = await auth.auth.getUser();
  if (!user) redirect("/login");

  const { range } = await searchParams;
  const rangeDays = range === "90" ? 90 : 30;

  const rows = await fetchAllRows();
  if (rows.length === 0) {
    return (
      <div className="rounded-xl border border-line bg-white px-6 py-12 text-center text-sm text-muted">
        No applications yet. Your statistics will show up here once you have
        some.
      </div>
    );
  }

  const s = computeStats(rows, rangeDays);

  const daily = s.daily.map((d) => ({
    label: formatDay(d.key),
    value: d.value,
    title: `${formatDayLong(d.key)}: ${plural(d.value, "application")}`,
  }));

  return (
    <div className="grid gap-4">
      {/* summary strip */}
      <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-4">
        <div className="bg-white p-4">
          <dt className="text-sm text-muted">Total sent</dt>
          <dd className="mt-1 text-2xl font-semibold tabular-nums">
            {s.total}
          </dd>
          <p className="text-xs text-muted">{s.last7} in the last 7 days</p>
        </div>
        <div className="bg-white p-4">
          <dt className="text-sm text-muted">This month</dt>
          <dd className="mt-1 text-2xl font-semibold tabular-nums">
            {s.thisMonth}
          </dd>
          <p className="text-xs text-muted">{s.lastMonth} last month</p>
        </div>
        <div className="bg-white p-4">
          <dt className="text-sm text-muted">Average per week</dt>
          <dd className="mt-1 text-2xl font-semibold tabular-nums">
            {s.perWeek.toFixed(1)}
          </dd>
          <p className="text-xs text-muted">since your first application</p>
        </div>
        <div className="bg-white p-4">
          <dt className="text-sm text-muted">Heard back</dt>
          <dd className="mt-1 text-2xl font-semibold tabular-nums">
            {Math.round(s.heardRate * 100)}%
          </dd>
          <p className="text-xs text-muted">
            {s.heard} of {s.total} applications
          </p>
        </div>
      </dl>

      {/* per day */}
      <Panel
        title="Applications per day"
        action={
          <div className="flex gap-1 text-sm">
            {[30, 90].map((n) => (
              <Link
                key={n}
                href={n === 30 ? "/stats" : `/stats?range=${n}`}
                aria-current={rangeDays === n ? "page" : undefined}
                className={`rounded-lg px-3 py-1 ${
                  rangeDays === n
                    ? "bg-brand text-white"
                    : "text-muted hover:text-ink"
                }`}
              >
                {n} days
              </Link>
            ))}
          </div>
        }
      >
        <BarChart
          data={daily}
          labelEvery={rangeDays === 30 ? 5 : 15}
          description={`Bar chart of applications per day over the last ${rangeDays} days, ${s.rangeTotal} in total`}
        />
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted">
            {plural(s.rangeTotal, "application")} in the last {rangeDays} days.
            {s.busiest &&
              ` Busiest day overall: ${formatDayLong(s.busiest.key)} with ${s.busiest.count}.`}
          </p>
          <Link
            href="/stats/days"
            className="rounded-lg border border-line px-3 py-1.5 text-sm font-medium hover:bg-mist"
          >
            View daily details
          </Link>
        </div>
      </Panel>

      {/* month, year, pipeline */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="By month">
          <BarList
            items={s.months.map((m) => ({
              label: formatMonth(m.key),
              value: m.value,
              href: `/stats/days?month=${m.key}`,
            }))}
          />
          <p className="mt-3 text-xs text-muted">
            Showing up to the last 12 months. Select a month to see each day.
          </p>
        </Panel>

        <div className="grid content-start gap-4">
          <Panel title="By year">
            <BarList
              items={s.years.map((y) => ({ label: y.key, value: y.value }))}
            />
          </Panel>

          <Panel title="Pipeline">
            <div
              className="flex h-3 overflow-hidden rounded-full bg-mist"
              role="img"
              aria-label="Share of applications by status"
            >
              {STATUSES.map((st) =>
                s.status[st] ? (
                  <div
                    key={st}
                    title={`${STATUS_LABEL[st]}: ${s.status[st]}`}
                    style={{
                      width: `${(s.status[st] / s.total) * 100}%`,
                      background: STATUS_COLOR[st],
                    }}
                  />
                ) : null,
              )}
            </div>
            <ul className="mt-3 grid grid-cols-2 gap-2 text-sm">
              {STATUSES.map((st) => (
                <li key={st} className="flex items-center gap-2">
                  <span
                    aria-hidden
                    className="inline-block size-2.5 rounded-full"
                    style={{ background: STATUS_COLOR[st] }}
                  />
                  <span>{STATUS_LABEL[st]}</span>
                  <span className="ml-auto tabular-nums text-muted">
                    {s.status[st] ?? 0}
                  </span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>

      {/* companies and sources */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Companies">
          {s.companies.length === 0 ? (
            <p className="text-sm text-muted">No company names recorded yet.</p>
          ) : (
            <CompanyList companies={s.companies} />
          )}
          <p className="mt-3 text-xs text-muted">
            {plural(s.companyCount, "company")} in total
            {s.repeatCompanies > 0 &&
              `, ${s.repeatCompanies} with more than one application`}
            .
            {s.noCompany > 0 &&
              ` ${plural(s.noCompany, "application")} ${s.noCompany === 1 ? "has" : "have"} no company recorded.`}
          </p>
        </Panel>

        <Panel title="Where replies come from">
          <table className="w-full text-left text-sm">
            <thead className="text-muted">
              <tr>
                <th className="pb-2 font-medium">Source</th>
                <th className="pb-2 text-right font-medium">Sent</th>
                <th className="pb-2 text-right font-medium">Heard back</th>
                <th className="pb-2 text-right font-medium">Rate</th>
              </tr>
            </thead>
            <tbody>
              {s.sources.map((src) => (
                <tr key={src.key} className="border-t border-line">
                  <td className="py-2">{SOURCE_LABEL[src.key] ?? src.key}</td>
                  <td className="py-2 text-right tabular-nums">{src.sent}</td>
                  <td className="py-2 text-right tabular-nums">{src.heard}</td>
                  <td className="py-2 text-right tabular-nums">
                    {Math.round((src.heard / src.sent) * 100)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-3 text-xs text-muted">
            “Heard back” counts every application whose status is not Applied.
          </p>
        </Panel>
      </div>
    </div>
  );
}

export default function StatsPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <AppHeader
        title="Statistics"
        switchTo={{ href: "/", label: "Applications" }}
      />
      <LoadingBoundary fallback={<StatsSkeleton />}>
        <Stats searchParams={searchParams} />
      </LoadingBoundary>
    </main>
  );
}
