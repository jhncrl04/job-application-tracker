"use client";

import { useRef, useState } from "react";
import { addApplication, updateApplication } from "@/app/actions";
import { SOURCES, SOURCE_LABEL, STATUSES, STATUS_LABEL } from "@/lib/constants";
import type { Application } from "@/lib/types";

const input =
  "w-full rounded-lg border border-line bg-white px-3 py-2 text-sm font-normal";

function Field({
  label,
  className = "",
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`grid gap-1 text-sm font-medium ${className}`}>
      {label}
      {children}
    </label>
  );
}

const toDateInput = (d: Date) =>
  d.toLocaleDateString("en-CA", { timeZone: "Asia/Manila" });

export default function ApplicationDialog({
  application,
  className,
  children,
}: {
  application?: Application;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  function openDialog() {
    setError("");
    setOpen(true);
    ref.current?.showModal();
  }

  async function handleAction(formData: FormData) {
    setPending(true);
    setError("");
    const result = application
      ? await updateApplication(application.id, formData)
      : await addApplication(formData);
    setPending(false);

    if (result.error) {
      setError(result.error);
      return;
    }
    ref.current?.close();
  }

  const date = application ? new Date(application.applied_at) : new Date();

  return (
    <>
      <button type="button" onClick={openDialog} className={className}>
        {children}
      </button>

      <dialog
        ref={ref}
        onClose={() => setOpen(false)}
        onClick={(e) => {
          if (e.target === ref.current) ref.current?.close();
        }}
        className="m-auto max-h-[90dvh] w-[min(34rem,calc(100%-2rem))] overflow-y-auto rounded-xl bg-white p-0 text-ink shadow-xl backdrop:bg-ink/40"
      >
        {open && (
          <form action={handleAction} className="grid gap-4 p-6 sm:grid-cols-2">
            <h2 className="text-lg font-semibold sm:col-span-2">
              {application ? "Edit application" : "Add application"}
            </h2>

            <Field label="Job title">
              <input
                name="job_title"
                defaultValue={application?.job_title}
                required
                className={input}
              />
            </Field>
            <Field label="Company">
              <input
                name="company"
                defaultValue={application?.company ?? ""}
                className={input}
              />
            </Field>

            <Field label="Source">
              <select
                name="source"
                defaultValue={application?.source ?? "company_site"}
                className={input}
              >
                {SOURCES.map((s) => (
                  <option key={s} value={s}>
                    {SOURCE_LABEL[s]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Status">
              <select
                name="status"
                defaultValue={application?.status ?? "applied"}
                className={input}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABEL[s]}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Date applied">
              <input
                type="date"
                name="applied_at"
                defaultValue={toDateInput(date)}
                className={input}
              />
            </Field>
            <Field label="Job posting URL">
              <input
                name="job_url"
                defaultValue={application?.job_url ?? ""}
                placeholder="https://"
                className={input}
              />
            </Field>

            <Field label="Notes" className="sm:col-span-2">
              <textarea
                name="notes"
                rows={3}
                defaultValue={application?.notes ?? ""}
                className={input}
              />
            </Field>

            {error && (
              <p role="alert" className="text-sm text-[#9B3048] sm:col-span-2">
                {error}
              </p>
            )}

            <div className="flex justify-end gap-3 sm:col-span-2">
              <button
                type="button"
                onClick={() => ref.current?.close()}
                className="rounded-lg px-4 py-2 text-sm text-muted hover:text-ink"
              >
                Cancel
              </button>
              <button
                disabled={pending}
                className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-[#263d66] disabled:opacity-60"
              >
                {pending
                  ? "Saving…"
                  : application
                    ? "Save changes"
                    : "Add application"}
              </button>
            </div>
          </form>
        )}
      </dialog>
    </>
  );
}
