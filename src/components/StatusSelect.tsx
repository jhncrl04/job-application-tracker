"use client";

import { useOptimistic, useTransition } from "react";
import { updateStatus } from "@/app/actions";
import {
  STATUSES,
  STATUS_LABEL,
  STATUS_STYLE,
  type Status,
} from "@/lib/constants";

export default function StatusSelect({
  id,
  status,
}: {
  id: string;
  status: string;
}) {
  const [, startTransition] = useTransition();
  const [current, setCurrent] = useOptimistic(status);
  const style =
    STATUS_STYLE[current as Status] ?? "bg-slate-100 text-slate-700";

  return (
    <select
      aria-label="Application status"
      value={current}
      onChange={(e) => {
        const next = e.target.value;
        startTransition(async () => {
          setCurrent(next);
          await updateStatus(id, next);
        });
      }}
      className={`pill cursor-pointer rounded-full border-0 px-3 py-1 text-xs font-medium ${style}`}
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {STATUS_LABEL[s]}
        </option>
      ))}
    </select>
  );
}
