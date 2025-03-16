// src/utils/path.util.ts

export function shouldHideHeaderFooter(pathname: string) {
  return pathname.includes("/albums/") && pathname.includes("/media/");
}

export function getPathSegments(pathname: string) {
  return pathname.split("/").filter(Boolean);
}

export const getActiveRoute = (
  currentPath: string,
  linkPath: string
): boolean => {
  // Normalize paths - remove leading/trailing slashes and convert to lowercase
  const current = currentPath.toLowerCase().replace(/^\/+|\/+$/g, "");
  const link = linkPath.toLowerCase().replace(/^\/+|\/+$/g, "");

  // Home page special case
  if (link === "" || link === "/") {
    return current === "" || current === "/";
  }

  // Exact match
  if (current === link) {
    return true;
  }

  // Parent route match (e.g., /blogs should match /blogs/123)
  if (link !== "" && current.startsWith(link + "/")) {
    return true;
  }

  return false;
};

export const getParentActiveState = (
  currentPath: string,
  childPaths: string[]
): boolean => {
  if (!currentPath || !childPaths?.length) return false;

  // Check if any child path is active
  return childPaths.some((path) => getActiveRoute(currentPath, path));
};
