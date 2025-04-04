"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isActivePath } from "@/utils/path.util";

interface MobileNavLinksProps {
  item: any;
}

export default function MobileNavLinks({ item }: MobileNavLinksProps) {
  const pathname = usePathname();

  const isActiveLink = (path: string) => {
    return isActivePath(pathname, path);
  };

  if (!item.hasChildren) {
    return (
      <Link
        href={item.to}
        className={`block px-3 py-2 text-sm sm:text-base rounded-md transition-all duration-200 ${
          isActiveLink(item.to)
            ? "bg-[rgb(1,82,168)] text-white"
            : "text-gray-700 hover:bg-[rgb(1,82,168)]/10 hover:text-[rgb(1,82,168)]"
        }`}
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div className="w-full space-y-1">
      <div className="text-sm font-medium text-gray-700 px-3 py-2 bg-gray-50">
        {item.label}
      </div>
      {item.children?.map((child: any) => (
        <Link
          key={child.label}
          href={child.to}
          className={`block px-4 py-2 rounded-md transition-all duration-200 ${
            isActiveLink(child.to)
              ? "bg-[rgb(1,82,168)] text-white font-medium shadow-md"
              : "text-gray-600 hover:bg-[rgb(1,82,168)]/10 hover:text-[rgb(1,82,168)]"
          }`}
        >
          {child.label}
        </Link>
      ))}
    </div>
  );
}
