export function isActivePath(currentPath: string, targetPath: string): boolean {
  // Normalize paths and split into segments
  const currentSegments = normalizePath(currentPath).split("/").filter(Boolean);
  const targetSegments = normalizePath(targetPath).split("/").filter(Boolean);

  // Special cases
  if (targetPath === "#") return false;
  if (targetPath === "/") return currentPath === "/";

  // If target has more segments than current path, it can't be active
  if (targetSegments.length > currentSegments.length) return false;

  // Check if all target segments match the start of current segments
  for (let i = 0; i < targetSegments.length; i++) {
    if (targetSegments[i] !== currentSegments[i]) return false;
  }

  return true;
}

export function normalizePath(path: string): string {
  if (!path) return "/";
  return (
    path
      .toLowerCase()
      .split("?")[0]
      .split("#")[0]
      .replace(/\/+/g, "/")
      .replace(/\/$/, "") || "/"
  );
}
