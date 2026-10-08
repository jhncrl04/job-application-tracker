"use server";

import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase";
import { createClient } from "@/lib/supabase-server";

const SOURCES = [
  "indeed",
  "jobstreet",
  "linkedin",
  "company_site",
  "email",
  "other",
];

export async function addApplication(formData: FormData) {
  // Server actions are public endpoints, so always verify the login here
  const auth = await createClient();
  const {
    data: { user },
  } = await auth.auth.getUser();
  if (!user) return { error: "Not signed in" };

  const job_title = String(formData.get("job_title") ?? "").trim();
  const company = String(formData.get("company") ?? "").trim();
  const source = String(formData.get("source") ?? "other");
  const applied_at = String(formData.get("applied_at") ?? "");
  const job_url = String(formData.get("job_url") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();

  if (!job_title) return { error: "Job title is required" };
  if (!SOURCES.includes(source)) return { error: "Invalid source" };

  const { error } = await supabase.from("applications").insert({
    job_title,
    company: company || null,
    source,
    applied_at: applied_at
      ? new Date(applied_at).toISOString()
      : new Date().toISOString(),
    job_url: job_url || null,
    notes: notes || null,
  });

  if (error) return { error: error.message };

  revalidatePath("/");
  return { ok: true };
}
