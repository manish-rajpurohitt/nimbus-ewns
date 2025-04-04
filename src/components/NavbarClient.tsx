"use client";

import { usePathname } from "next/navigation";
import { isActivePath, isActiveParentPath } from "@/utils/path.util";

export function useNavigation() {
  const pathname = usePathname();

  const getActiveState = (path: string) => {
    return isActivePath(pathname, path);
  };

  const getParentActiveState = (item: any) => {
    if (!item.hasChildren) return getActiveState(item.to);
    return item.children?.some((child: any) => getActiveState(child.to));
  };

  return {
    getActiveState,
    getParentActiveState,
    pathname
  };
}
