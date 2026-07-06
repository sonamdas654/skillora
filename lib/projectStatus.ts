export const PROJECT_STATUSES = [
  "Requirement received",
  "Scope finalized",
  "Advance received",
  "Work started",
  "First preview sent",
  "Revision pending",
  "Final approval",
  "Final payment pending",
  "Delivered",
  "Maintenance active",
] as const;

export type ProjectStatus = (typeof PROJECT_STATUSES)[number];
