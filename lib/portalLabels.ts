export const REQUEST_STATUS_LABEL: Record<string, string> = {
  draft: "Draft",
  submitted: "Submitted",
  under_review: "Under review",
  quote_prepared: "Quote prepared",
  converted: "Converted to project",
  closed: "Closed",
};

export const PROJECT_STATUS_LABEL: Record<string, string> = {
  request_received: "Request received",
  quote_sent: "Quote sent",
  advance_pending: "Advance pending",
  in_progress: "In progress",
  preview_shared: "Preview shared",
  revision: "In revision",
  final_payment_pending: "Final payment pending",
  delivered: "Delivered",
  closed: "Closed",
};

export const QUOTE_STATUS_LABEL: Record<string, string> = {
  draft: "Draft",
  sent: "Awaiting your review",
  viewed: "Viewed",
  change_requested: "Change requested",
  approved: "Approved",
  rejected: "Rejected",
  expired: "Expired",
};

export const PAYMENT_STATUS_LABEL: Record<string, string> = {
  pending: "Payment requested",
  submitted: "Proof submitted — under review",
  verified: "Verified",
  rejected: "Rejected — please resubmit",
};

export const REVISION_STATUS_LABEL: Record<string, string> = {
  submitted: "Submitted",
  under_review: "Under review",
  accepted: "Accepted",
  completed: "Completed",
  not_in_scope: "Not in scope",
};

export const PROJECT_STATUS_OPTIONS = Object.keys(PROJECT_STATUS_LABEL) as (keyof typeof PROJECT_STATUS_LABEL)[];
export const REVISION_STATUS_OPTIONS = Object.keys(REVISION_STATUS_LABEL) as (keyof typeof REVISION_STATUS_LABEL)[];

export function statusPillClass(status: string) {
  const positive = ["approved", "verified", "completed", "delivered", "converted"];
  const negative = ["rejected", "not_in_scope", "closed", "expired"];
  const pending = ["submitted", "sent", "under_review", "pending", "draft", "revision", "advance_pending", "final_payment_pending", "change_requested"];
  if (positive.includes(status)) return "bg-mint/15 text-emerald-700";
  if (negative.includes(status)) return "bg-red-50 text-red-600";
  if (pending.includes(status)) return "bg-accent-soft text-accent";
  return "bg-accent-soft text-accent";
}
