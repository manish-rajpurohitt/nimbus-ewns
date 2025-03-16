export function formatDate(dateStr: string): string {
  try {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    }).format(new Date(dateStr));
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateStr;
  }
}

export function formatDateTime(dateStr: string): string {
  try {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).format(new Date(dateStr));
  } catch (error) {
    console.error("Error formatting datetime:", error);
    return dateStr;
  }
}
