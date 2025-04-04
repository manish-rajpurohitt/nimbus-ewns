"use client";

import { usePathname } from "next/navigation";
import { isActivePath } from "@/utils/path.util";

export function useFooterNavigation() {
  const pathname = usePathname();

  const isActiveLink = (path: string) => {
    return isActivePath(pathname, path);
  };

  return {
    isActiveLink,
    pathname
  };
}
