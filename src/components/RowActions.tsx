"use client";

import { useState, useTransition } from "react";
import { deleteApplication } from "@/app/actions";
import ApplicationDialog from "./ApplicationDialog";
import type { Application } from "@/lib/types";

const action = "-mx-2 rounded-lg px-2 py-2.5 sm:py-1";

export default function RowActions({
  application,
}: {
  application: Application;
}) {
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();

  if (confirming) {
    return (
      <div className="flex flex-wrap justify-start gap-3 text-sm sm:justify-end">
        <button
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              await deleteApplication(application.id);
            })
          }
          className={`${action} font-medium text-[#9B3048] disabled:opacity-60`}
        >
          {pending ? "Deleting…" : "Delete permanently"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className={`${action} text-muted hover:text-ink`}
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div className="flex justify-start gap-3 text-sm sm:justify-end">
      <ApplicationDialog
        application={application}
        className={`${action} text-muted hover:text-ink`}
      >
        Edit
      </ApplicationDialog>
      <button
        onClick={() => setConfirming(true)}
        className={`${action} text-muted hover:text-[#9B3048]`}
      >
        Delete
      </button>
    </div>
  );
}
