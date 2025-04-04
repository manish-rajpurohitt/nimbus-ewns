export function normalizePathForComparison(path: string): string {
  // Remove trailing slash and query parameters
  return path.split("?")[0].replace(/\/+$/, "");
}

export function isActivePath(currentPath: string, targetPath: string): boolean {
  const normalizedCurrent = normalizePathForComparison(currentPath);
  const normalizedTarget = normalizePathForComparison(targetPath);

  // Exact match
  if (normalizedCurrent === normalizedTarget) return true;

  // Special case for home page
  if (targetPath === "/" && normalizedCurrent === "") return true;

  // Handle nested paths
  if (targetPath !== "/" && normalizedCurrent.startsWith(normalizedTarget))
    return true;

  return false;
}
