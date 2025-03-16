// Enhanced PathDebugger.tsx
import React from "react";

interface PathDebuggerProps {
  pathname: string;
}

export default function PathDebugger({ pathname }: PathDebuggerProps) {
  // Only show in development
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  // Test some common paths
  const testPaths = ["/", "/about", "/services", "/contact"];

  return (
    <div className="fixed bottom-0 left-0 bg-black/80 text-white p-2 text-xs z-[9999] font-mono max-w-full overflow-auto">
      <div>Current path: &quot;{pathname}&quot;</div>
      <div className="mt-1">Test results:</div>
      {testPaths.map((path) => (
        <div key={path} className="pl-2">
          {path}: {isPathActive(path, pathname) ? "✅" : "❌"}
        </div>
      ))}
    </div>
  );
}

// Helper function to test paths
function isPathActive(path: string, currentPath: string): boolean {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const normalizedCurrentPath = currentPath.startsWith("/")
    ? currentPath
    : `/${currentPath}`;

  if (normalizedPath === "/") {
    return normalizedCurrentPath === "/";
  }

  if (normalizedPath === normalizedCurrentPath) {
    return true;
  }

  if (
    normalizedPath !== "/" &&
    normalizedCurrentPath.startsWith(`${normalizedPath}/`) &&
    !normalizedCurrentPath.slice(normalizedPath.length + 1).includes("/")
  ) {
    return true;
  }

  return false;
}
