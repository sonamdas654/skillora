export const LEAD_STATUSES = [
  "New",
  "Reviewed",
  "Contacted",
  "Qualified",
  "Quoted",
  "Waiting for Payment",
  "In Progress",
  "Revision",
  "Delivered",
  "Closed",
  "Rejected",
  "Spam",
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];
