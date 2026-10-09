export type Application = {
  id: string;
  company: string | null;
  job_title: string;
  source: string;
  applied_at: string;
  status: string;
  needs_review: boolean;
  job_url: string | null;
  notes: string | null;
};
