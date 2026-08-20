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
