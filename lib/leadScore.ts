// Lead quality scoring — plan section 16.
export function scoreLead(input: {
  budgetRange?: string;
  deadline?: string;
  projectStatus?: string;
  readyToStart?: string;
  advancePaymentComfort?: string;
  hasFilesOrReferences?: boolean;
}): "High" | "Medium" | "Low" {
  const hasBudget = !!input.budgetRange && input.budgetRange !== "";
  const hasDeadline = !!input.deadline;
  const readyToStart =
    input.readyToStart === "Yes" ||
    input.projectStatus === "Ready to start" ||
    input.projectStatus === "Urgent project";
  const acceptsAdvance = input.advancePaymentComfort === "Yes";
  const justExploring = input.projectStatus === "Just exploring";

  if (hasBudget && hasDeadline && input.hasFilesOrReferences && readyToStart && acceptsAdvance) {
    return "High";
  }
  if (!hasBudget && !hasDeadline && justExploring) {
    return "Low";
  }
  if (hasBudget) return "Medium";
  return "Low";
}
