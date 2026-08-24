export function formatMalayalamDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("ml-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return new Date(iso).toLocaleDateString();
  }
}

export function formatMalayalamMonthYear(iso: string): string {
  try {
    return new Intl.DateTimeFormat("ml-IN", {
      month: "long",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return new Date(iso).toLocaleDateString();
  }
}

// Used by the magazine submission form to auto-assign a piece to the
// current month's issue, creating it if it doesn't exist yet.
export function getCurrentIssueInfo() {
  const now = new Date();
  const firstOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const monthSlug = new Intl.DateTimeFormat("en-US", { month: "long" })
    .format(firstOfMonth)
    .toLowerCase();
  const year = firstOfMonth.getUTCFullYear();

  return {
    slug: `${monthSlug}-${year}`,
    title: `${formatMalayalamMonthYear(firstOfMonth.toISOString())} ലക്കം`,
    issueDate: firstOfMonth.toISOString().slice(0, 10),
  };
}
