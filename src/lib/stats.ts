export type Row = {
  company: string | null;
  source: string;
  status: string;
  applied_at: string;
};

const TZ = "Asia/Manila";

const dayFmt = new Intl.DateTimeFormat("en-CA", { timeZone: TZ }); // gives YYYY-MM-DD
const dayShortFmt = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});
const dayLongFmt = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});
const monthFmt = new Intl.DateTimeFormat("en-US", {
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

export const dayKey = (d: Date) => dayFmt.format(d);
export const formatDay = (key: string) =>
  dayShortFmt.format(new Date(key + "T00:00:00Z"));
export const formatDayLong = (key: string) =>
  dayLongFmt.format(new Date(key + "T00:00:00Z"));
export const formatMonth = (key: string) =>
  monthFmt.format(new Date(key + "-01T00:00:00Z"));
const monthLongFmt = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});
export const formatMonthLong = (key: string) =>
  monthLongFmt.format(new Date(key + "-01T00:00:00Z"));

function addDays(key: string, n: number) {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10);
}

function daysBetween(a: string, b: string) {
  const t = (k: string) => {
    const [y, m, d] = k.split("-").map(Number);
    return Date.UTC(y, m - 1, d);
  };
  return Math.round((t(b) - t(a)) / 86400000);
}

// returns "YYYY-MM" keys, oldest first, ending with the current month
function monthsBack(todayKey: string, count: number) {
  let y = Number(todayKey.slice(0, 4));
  let m = Number(todayKey.slice(5, 7));
  const out: string[] = [];
  for (let i = 0; i < count; i++) {
    out.unshift(`${y}-${String(m).padStart(2, "0")}`);
    m--;
    if (m === 0) {
      m = 12;
      y--;
    }
  }
  return out;
}

const inc = (map: Map<string, number>, key: string) =>
  map.set(key, (map.get(key) ?? 0) + 1);

export function computeStats(rows: Row[], rangeDays: number) {
  const today = dayKey(new Date());
  const thisMonthKey = today.slice(0, 7);
  const lastMonthKey = monthsBack(today, 2)[0];

  const perDay = new Map<string, number>();
  const perMonth = new Map<string, number>();
  const perYear = new Map<string, number>();
  const companies = new Map<string, { name: string; count: number }>();
  const sources = new Map<string, { sent: number; heard: number }>();
  const status: Record<string, number> = {};
  let firstDay = today;
  let noCompany = 0;
  let heard = 0;

  for (const r of rows) {
    const day = dayKey(new Date(r.applied_at));
    inc(perDay, day);
    inc(perMonth, day.slice(0, 7));
    inc(perYear, day.slice(0, 4));
    if (day < firstDay) firstDay = day;

    // company names are grouped ignoring upper/lower case
    const name = r.company?.trim();
    if (name) {
      const key = name.toLowerCase();
      const cur = companies.get(key);
      if (cur) cur.count++;
      else companies.set(key, { name, count: 1 });
    } else {
      noCompany++;
    }

    const isHeard = r.status !== "applied";
    if (isHeard) heard++;
    const src = sources.get(r.source) ?? { sent: 0, heard: 0 };
    src.sent++;
    if (isHeard) src.heard++;
    sources.set(r.source, src);

    status[r.status] = (status[r.status] ?? 0) + 1;
  }

  const total = rows.length;

  const daily = Array.from({ length: rangeDays }, (_, i) => {
    const key = addDays(today, i - (rangeDays - 1));
    return { key, value: perDay.get(key) ?? 0 };
  });

  let last7 = 0;
  for (let i = 0; i < 7; i++) last7 += perDay.get(addDays(today, -i)) ?? 0;

  let busiest: { key: string; count: number } | null = null;
  perDay.forEach((count, key) => {
    if (!busiest || count > busiest.count) busiest = { key, count };
  });

  const firstMonth = firstDay.slice(0, 7);
  const months = monthsBack(today, 12)
    .filter((m) => m >= firstMonth)
    .map((key) => ({ key, value: perMonth.get(key) ?? 0 }))
    .reverse(); // newest first

  const years = Array.from(perYear.entries())
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([key, value]) => ({ key, value }));

  const companyList = Array.from(companies.values()).sort(
    (a, b) => b.count - a.count || a.name.localeCompare(b.name),
  );

  const sourceList = Array.from(sources.entries())
    .map(([key, v]) => ({ key, ...v }))
    .sort((a, b) => b.sent - a.sent);

  return {
    total,
    last7,
    rangeTotal: daily.reduce((sum, d) => sum + d.value, 0),
    thisMonth: perMonth.get(thisMonthKey) ?? 0,
    lastMonth: perMonth.get(lastMonthKey) ?? 0,
    perWeek: total / Math.max(1, (daysBetween(firstDay, today) + 1) / 7),
    heard,
    heardRate: total ? heard / total : 0,
    busiest: busiest as { key: string; count: number } | null,
    daily,
    months,
    years,
    companies: companyList,
    companyCount: companyList.length,
    repeatCompanies: companyList.filter((c) => c.count > 1).length,
    noCompany,
    sources: sourceList,
    status,
  };
}

export function shiftMonth(key: string, n: number) {
  const [y, m] = key.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1 + n, 1)).toISOString().slice(0, 7);
}

type Day = { key: string; day: number; count: number; future: boolean };

export function monthDetail(rows: Row[], requested: string | undefined) {
  const today = dayKey(new Date());
  const currentMonth = today.slice(0, 7);

  const perDay = new Map<string, number>();
  let firstDay = today;
  for (const r of rows) {
    const day = dayKey(new Date(r.applied_at));
    inc(perDay, day);
    if (day < firstDay) firstDay = day;
  }
  const firstMonth = firstDay.slice(0, 7);

  // use the requested month if it's valid, and keep it between your first month and now
  let month =
    requested && /^\d{4}-(0[1-9]|1[0-2])$/.test(requested)
      ? requested
      : currentMonth;
  if (month > currentMonth) month = currentMonth;
  if (month < firstMonth) month = firstMonth;

  const [y, m] = month.split("-").map(Number);
  const daysInMonth = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const startWeekday = new Date(Date.UTC(y, m - 1, 1)).getUTCDay(); // 0 = Sunday

  const days: Day[] = Array.from({ length: daysInMonth }, (_, i) => {
    const key = `${month}-${String(i + 1).padStart(2, "0")}`;
    return {
      key,
      day: i + 1,
      count: perDay.get(key) ?? 0,
      future: key > today,
    };
  });

  const elapsed = days.filter((d) => !d.future);
  const total = elapsed.reduce((sum, d) => sum + d.count, 0);
  const best = elapsed.reduce<Day | null>(
    (b, d) => (d.count > (b?.count ?? 0) ? d : b),
    null,
  );

  return {
    month,
    today,
    isCurrent: month === currentMonth,
    days,
    startWeekday,
    total,
    elapsedDays: elapsed.length,
    activeDays: elapsed.filter((d) => d.count > 0).length,
    best,
    prev: month > firstMonth ? shiftMonth(month, -1) : null,
    next: month < currentMonth ? shiftMonth(month, 1) : null,
  };
}
