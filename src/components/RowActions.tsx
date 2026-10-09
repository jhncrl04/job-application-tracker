"use client";

import { useState, useTransition } from "react";
import { deleteApplication } from "@/app/actions";
import ApplicationDialog from "./ApplicationDialog";
import type { Application } from "@/lib/types";

export default function RowActions({
  application,
}: {
  application: Application;
}) {
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();

  if (confirming) {
    return (
      <div className="flex justify-end gap-3 text-sm">
        <button
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              await deleteApplication(application.id);
            })
          }
          className="font-medium text-[#9B3048] disabled:opacity-60"
        >
          {pending ? "Deleting…" : "Delete permanently"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="text-muted hover:text-ink"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div className="flex justify-end gap-4 text-sm">
      <ApplicationDialog
        application={application}
        className="text-muted hover:text-ink"
      >
        Edit
      </ApplicationDialog>
      <button
        onClick={() => setConfirming(true)}
        className="text-muted hover:text-[#9B3048]"
      >
        Delete
      </button>
    </div>
  );
}
