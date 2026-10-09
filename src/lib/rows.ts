import { supabase } from "@/lib/supabase";
import type { Row } from "@/lib/stats";

export async function fetchAllRows(): Promise<Row[]> {
  const rows: Row[] = [];
  // the database returns at most 1000 rows per request, so read in pages
  for (let from = 0; ; from += 1000) {
    const { data, error } = await supabase
      .from("applications")
      .select("company, source, status, applied_at")
      .order("applied_at")
      .order("id")
      .range(from, from + 999);
    if (error) throw new Error(error.message);
    rows.push(...((data ?? []) as Row[]));
    if (!data || data.length < 1000) break;
  }
  return rows;
}
