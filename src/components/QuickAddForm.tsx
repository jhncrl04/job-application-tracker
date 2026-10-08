"use client";

import { useRef, useState } from "react";
import { addApplication } from "@/app/actions";

export default function QuickAddForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const today = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD in your local time

  async function handleAction(formData: FormData) {
    setPending(true);
    setError("");
    const result = await addApplication(formData);
    setPending(false);

    if (result?.error) {
      setError(result.error);
      return;
    }
    formRef.current?.reset();
  }

  return (
    <form
      ref={formRef}
      action={handleAction}
      className="mb-6 grid gap-3 rounded border p-4 sm:grid-cols-2"
    >
      <input
        name="job_title"
        placeholder="Job title *"
        className="rounded border p-2"
        required
      />
      <input
        name="company"
        placeholder="Company"
        className="rounded border p-2"
      />

      <select
        name="source"
        defaultValue="company_site"
        className="rounded border p-2"
      >
        <option value="company_site">Company website</option>
        <option value="email">Direct email</option>
        <option value="linkedin">LinkedIn</option>
        <option value="indeed">Indeed</option>
        <option value="jobstreet">JobStreet</option>
        <option value="other">Other</option>
      </select>
      <input
        type="date"
        name="applied_at"
        defaultValue={today}
        className="rounded border p-2"
      />

      <input
        name="job_url"
        placeholder="Job posting URL (optional)"
        className="rounded border p-2 sm:col-span-2"
      />
      <textarea
        name="notes"
        placeholder="Notes (optional)"
        rows={2}
        className="rounded border p-2 sm:col-span-2"
      />

      {error && <p className="text-sm text-red-600 sm:col-span-2">{error}</p>}

      <button
        disabled={pending}
        className="rounded bg-black p-2 text-white disabled:opacity-50 sm:col-span-2"
      >
        {pending ? "Saving..." : "Add application"}
      </button>
    </form>
  );
}
