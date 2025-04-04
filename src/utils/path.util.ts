// src/utils/path.util.ts

export function normalizePath(path: string): string {
  if (!path) return "/";
  return path.split(/[?#]/)[0].replace(/\/+$/, "").toLowerCase() || "/";
}

export function isActivePath(currentPath: string, targetPath: string): boolean {
  const normalizedCurrent = normalizePath(currentPath);
  const normalizedTarget = normalizePath(targetPath);

  if (normalizedTarget === "/") {
    return normalizedCurrent === "/";
  }

  return (
    normalizedCurrent === normalizedTarget ||
    (normalizedTarget !== "/" &&
      normalizedCurrent.startsWith(normalizedTarget + "/"))
  );
}

export function isActiveParentPath(
  currentPath: string,
  childPaths: string[]
): boolean {
  if (!currentPath || !childPaths?.length) return false;

  const normalizedCurrent = normalizePath(currentPath);

  return childPaths.some((childPath) => {
    const normalizedChild = normalizePath(childPath);
    return (
      normalizedCurrent === normalizedChild ||
      normalizedCurrent.startsWith(normalizedChild + "/")
    );
  });
}
