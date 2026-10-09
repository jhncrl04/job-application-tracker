export function listHref({
  status,
  q,
  page,
}: {
  status?: string;
  q?: string;
  page?: number;
}) {
  const p = new URLSearchParams();
  if (status && status !== "all") p.set("status", status);
  if (q) p.set("q", q);
  if (page && page > 1) p.set("page", String(page));
  const s = p.toString();
  return s ? `/?${s}` : "/";
}
