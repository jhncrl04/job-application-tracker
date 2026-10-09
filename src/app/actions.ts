"use server";

import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase";
import { createClient } from "@/lib/supabase-server";
import { SOURCES, STATUSES } from "@/lib/constants";

type Result = { ok?: boolean; error?: string };

async function isSignedIn() {
  const auth = await createClient();
  const {
    data: { user },
  } = await auth.auth.getUser();
  return !!user;
}

function readForm(formData: FormData) {
  const text = (key: string) => String(formData.get(key) ?? "").trim();

  const job_title = text("job_title");
  const source = text("source") || "other";
  const status = text("status") || "applied";
  const job_url = text("job_url");
  const applied_at = text("applied_at");

  if (!job_title) return { error: "Job title is required" };
  if (!(SOURCES as readonly string[]).includes(source))
    return { error: "Invalid source" };
  if (!(STATUSES as readonly string[]).includes(status))
    return { error: "Invalid status" };
  if (job_url && !/^https?:\/\//i.test(job_url))
    return { error: "Job URL must start with http:// or https://" };

  const date = applied_at ? new Date(applied_at) : new Date();
  if (isNaN(date.getTime())) return { error: "Invalid date" };

  return {
    values: {
      job_title,
      company: text("company") || null,
      source,
      status,
      applied_at: date.toISOString(),
      job_url: job_url || null,
      notes: text("notes") || null,
    },
  };
}

export async function addApplication(formData: FormData): Promise<Result> {
  if (!(await isSignedIn())) return { error: "Not signed in" };

  const parsed = readForm(formData);
  if ("error" in parsed) return parsed;

  const { error } = await supabase.from("applications").insert(parsed.values);
  if (error) return { error: error.message };

  revalidatePath("/");
  return { ok: true };
}

export async function updateApplication(
  id: string,
  formData: FormData,
): Promise<Result> {
  if (!(await isSignedIn())) return { error: "Not signed in" };

  const parsed = readForm(formData);
  if ("error" in parsed) return parsed;

  // saving an edit counts as reviewing it, so the flag is cleared
  const { error } = await supabase
    .from("applications")
    .update({ ...parsed.values, needs_review: false })
    .eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/");
  return { ok: true };
}

export async function updateStatus(
  id: string,
  status: string,
): Promise<Result> {
  if (!(await isSignedIn())) return { error: "Not signed in" };
  if (!(STATUSES as readonly string[]).includes(status))
    return { error: "Invalid status" };

  const { error } = await supabase
    .from("applications")
    .update({ status })
    .eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/");
  return { ok: true };
}

export async function deleteApplication(id: string): Promise<Result> {
  if (!(await isSignedIn())) return { error: "Not signed in" };

  const { error } = await supabase.from("applications").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/");
  return { ok: true };
}
