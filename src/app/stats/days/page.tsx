import { Suspense } from "react";
import Link from "@/components/NavLink";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import { fetchAllRows } from "@/lib/rows";
import {
  formatDay,
  formatDayLong,
  formatMonthLong,
  monthDetail,
} from "@/lib/stats";
import AppHeader from "@/components/AppHeader";
import LoadingBoundary from "@/components/LoadingBoundary";
import { StatsSkeleton } from "@/components/skeletons";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;
const navBtn = "rounded-lg border border-line bg-white px-3 py-1.5";

async function Days({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const auth = await createClient();
  const {
    data: { user },
  } = await auth.auth.getUser();
  if (!user) redirect("/login");

  const { month: requested } = await searchParams;
  const rows = await fetchAllRows();
  const d = monthDetail(rows, requested);
  const max = Math.max(1, ...d.days.map((day) => day.count));

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">{formatMonthLong(d.month)}</h2>
        <div className="flex gap-2 text-sm">
          {d.prev ? (
            <Link
              href={`/stats/days?month=${d.prev}`}
              className={`${navBtn} hover:bg-mist`}
            >
              Previous month
            </Link>
          ) : (
            <span className={`${navBtn} opacity-40`}>Previous month</span>
          )}
          {d.next ? (
            <Link
              href={`/stats/days?month=${d.next}`}
              className={`${navBtn} hover:bg-mist`}
            >
              Next month
            </Link>
          ) : (
            <span className={`${navBtn} opacity-40`}>Next month</span>
          )}
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-4">
        <div className="bg-white p-4">
          <dt className="text-sm text-muted">Applications sent</dt>
          <dd className="mt-1 text-2xl font-semibold tabular-nums">
            {d.total}
          </dd>
          <p className="text-xs text-muted">
            {d.isCurrent
              ? `${formatDay(d.days[0].key)} to ${formatDay(d.today)}`
              : "Whole month"}
          </p>
        </div>
        <div className="bg-white p-4">
          <dt className="text-sm text-muted">Days with applications</dt>
          <dd className="mt-1 text-2xl font-semibold tabular-nums">
            {d.activeDays}
          </dd>
          <p className="text-xs text-muted">of {d.elapsedDays} days</p>
        </div>
        <div className="bg-white p-4">
          <dt className="text-sm text-muted">Busiest day</dt>
          <dd className="mt-1 text-2xl font-semibold">
            {d.best ? formatDay(d.best.key) : "None"}
          </dd>
          <p className="text-xs text-muted">
            {d.best
              ? plural(d.best.count, "application")
              : "No applications yet"}
          </p>
        </div>
        <div className="bg-white p-4">
          <dt className="text-sm text-muted">Average per day</dt>
          <dd className="mt-1 text-2xl font-semibold tabular-nums">
            {(d.total / Math.max(1, d.elapsedDays)).toFixed(1)}
          </dd>
          <p className="text-xs text-muted">
            across {plural(d.elapsedDays, "day")}
          </p>
        </div>
      </dl>

      <section className="rounded-xl border border-line bg-white p-4">
        <div
          aria-hidden
          className="mb-2 grid grid-cols-7 gap-1 text-center text-xs text-muted"
        >
          {WEEKDAYS.map((w) => (
            <div key={w}>{w}</div>
          ))}
        </div>

        <ol className="grid grid-cols-7 gap-1">
          {Array.from({ length: d.startWeekday }, (_, i) => (
            <li key={`blank-${i}`} aria-hidden />
          ))}
          {d.days.map((day) => {
            const isToday = day.key === d.today;
            return (
              <li
                key={day.key}
                aria-current={isToday ? "date" : undefined}
                aria-label={
                  day.future
                    ? formatDayLong(day.key)
                    : `${formatDayLong(day.key)}: ${plural(day.count, "application")}`
                }
                className={`flex min-h-14 flex-col justify-between rounded-lg border p-1.5 sm:min-h-[4.5rem] sm:p-2 ${
                  day.future
                    ? "border-dashed border-line opacity-60"
                    : "border-line"
                } ${isToday ? "ring-2 ring-brand" : ""}`}
                style={
                  !day.future && day.count > 0
                    ? {
                        background: `rgba(47, 75, 124, ${0.1 + 0.3 * (day.count / max)})`,
                      }
                    : undefined
                }
              >
                <span className="text-xs text-muted">{day.day}</span>
                {!day.future && (
                  <span
                    className={`text-right text-lg tabular-nums ${
                      day.count === 0 ? "text-muted" : "font-semibold"
                    }`}
                  >
                    {day.count}
                  </span>
                )}
              </li>
            );
          })}
        </ol>

        <p className="mt-3 text-sm text-muted">
          Each box shows how many applications you sent that day. Darker boxes
          mean more.
          {d.isCurrent && " Days that haven't happened yet are dashed."}
        </p>
      </section>
    </div>
  );
}

export default function DaysPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <AppHeader
        title="Daily details"
        switchTo={{ href: "/stats", label: "Statistics" }}
      />
      <LoadingBoundary fallback={<StatsSkeleton />}>
        <Days searchParams={searchParams} />
      </LoadingBoundary>
    </main>
  );
}
