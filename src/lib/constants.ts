export const STATUSES = [
  "applied",
  "interviewing",
  "offer",
  "rejected",
] as const;
export type Status = (typeof STATUSES)[number];

export const STATUS_LABEL: Record<Status, string> = {
  applied: "Applied",
  interviewing: "Interviewing",
  offer: "Offer",
  rejected: "Rejected",
};

export const STATUS_STYLE: Record<Status, string> = {
  applied: "bg-[#E6EEFC] text-[#1F4FA8]",
  interviewing: "bg-[#FBF1DC] text-[#8A5A0B]",
  offer: "bg-[#E2F3E8] text-[#1F6A3E]",
  rejected: "bg-[#F9E5E9] text-[#9B3048]",
};

export const SOURCES = [
  "company_site",
  "email",
  "linkedin",
  "indeed",
  "jobstreet",
  "other",
] as const;

export const SOURCE_LABEL: Record<string, string> = {
  company_site: "Company site",
  email: "Email",
  linkedin: "LinkedIn",
  indeed: "Indeed",
  jobstreet: "JobStreet",
  other: "Other",
};

export const STATUS_COLOR: Record<Status, string> = {
  applied: "#4F7FDB",
  interviewing: "#E0A230",
  offer: "#3E9B64",
  rejected: "#C85A70",
};
