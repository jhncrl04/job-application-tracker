function Bone({
  className = "",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      aria-hidden
      style={style}
      className={`rounded bg-line motion-safe:animate-pulse ${className}`}
    />
  );
}

const CHART_HEIGHTS = [
  35, 50, 20, 65, 40, 80, 30, 55, 45, 70, 25, 60, 38, 75, 48, 22, 68, 42, 58,
  33, 72, 28, 52, 62, 36, 78, 44, 26, 64, 46,
];

function PanelSkeleton({ children }: { children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-line bg-white p-5">
      <Bone className="mb-4 h-5 w-40" />
      {children}
    </section>
  );
}

function BarListSkeleton({ rows }: { rows: number }) {
  return (
    <div className="grid gap-3">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Bone className="h-4 w-24 sm:w-36" />
          <Bone className="h-2 flex-1 rounded-full" />
          <Bone className="h-4 w-6" />
        </div>
      ))}
    </div>
  );
}

function SummarySkeleton() {
  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-4">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="bg-white p-4">
          <Bone className="h-4 w-24" />
          <Bone className="mt-3 h-7 w-16" />
          <Bone className="mt-2 h-3 w-28" />
        </div>
      ))}
    </div>
  );
}

export function ListSkeleton() {
  return (
    <div role="status" aria-busy="true">
      <span className="sr-only">Loading applications…</span>

      <div className="mb-4 flex gap-2">
        <Bone className="h-[38px] flex-1 rounded-lg" />
        <Bone className="h-[38px] w-20 rounded-lg" />
      </div>

      <div className="mb-4 flex gap-4 border-b border-line pb-2.5">
        {["w-10", "w-16", "w-24", "w-16", "w-20", "w-24"].map((w, i) => (
          <Bone key={i} className={`h-4 ${w}`} />
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-line bg-white">
        <div className="border-b border-line px-4 py-3">
          <Bone className="h-4 w-24" />
        </div>
        {Array.from({ length: 10 }, (_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 border-b border-line px-4 py-3 last:border-0"
          >
            <div className="flex-1">
              <Bone className="h-4 w-3/5" />
              <Bone className="mt-2 h-3.5 w-2/5" />
            </div>
            <Bone className="hidden h-4 w-16 sm:block" />
            <Bone className="h-4 w-20" />
            <Bone className="h-6 w-24 rounded-full" />
            <Bone className="h-4 w-14" />
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <Bone className="h-4 w-40" />
        <Bone className="h-8 w-48 rounded-lg" />
      </div>
    </div>
  );
}

export function StatsSkeleton() {
  return (
    <div role="status" aria-busy="true" className="grid gap-4">
      <span className="sr-only">Loading statistics…</span>

      <SummarySkeleton />

      <PanelSkeleton>
        <div className="flex h-40 items-end gap-px border-b border-line">
          {CHART_HEIGHTS.map((h, i) => (
            <Bone
              key={i}
              className="flex-1 rounded-b-none"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
        <Bone className="mt-4 h-4 w-2/3" />
      </PanelSkeleton>

      <div className="grid gap-4 lg:grid-cols-2">
        <PanelSkeleton>
          <BarListSkeleton rows={8} />
        </PanelSkeleton>
        <div className="grid content-start gap-4">
          <PanelSkeleton>
            <BarListSkeleton rows={2} />
          </PanelSkeleton>
          <PanelSkeleton>
            <Bone className="h-3 w-full rounded-full" />
            <div className="mt-4 grid grid-cols-2 gap-3">
              {[0, 1, 2, 3].map((i) => (
                <Bone key={i} className="h-4 w-full" />
              ))}
            </div>
          </PanelSkeleton>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <PanelSkeleton>
          <BarListSkeleton rows={10} />
        </PanelSkeleton>
        <PanelSkeleton>
          <BarListSkeleton rows={4} />
        </PanelSkeleton>
      </div>
    </div>
  );
}

export function DaysSkeleton() {
  return (
    <div role="status" aria-busy="true" className="grid gap-4">
      <span className="sr-only">Loading daily details…</span>

      <div className="flex items-center justify-between gap-3">
        <Bone className="h-7 w-44" />
        <div className="flex gap-2">
          <Bone className="h-[34px] w-32 rounded-lg" />
          <Bone className="h-[34px] w-28 rounded-lg" />
        </div>
      </div>

      <SummarySkeleton />

      <section className="rounded-xl border border-line bg-white p-4">
        <div className="mb-2 grid grid-cols-7 gap-1">
          {Array.from({ length: 7 }, (_, i) => (
            <Bone key={i} className="mx-auto h-3 w-8" />
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: 35 }, (_, i) => (
            <Bone key={i} className="h-14 rounded-lg sm:h-[4.5rem]" />
          ))}
        </div>
      </section>
    </div>
  );
}
