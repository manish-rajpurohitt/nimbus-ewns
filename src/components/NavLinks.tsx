"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isActivePath } from "@/utils/path.util";

interface NavLinkProps {
  item: any;
  children?: React.ReactNode;
}

export default function NavLinks({ item }: NavLinkProps) {
  const pathname = usePathname();

  const isActiveLink = (path: string) => {
    return isActivePath(pathname, path);
  };

  const isActiveParent = (item: any) => {
    if (!item.hasChildren) return isActiveLink(item.to);
    return item.children?.some((child: any) => isActiveLink(child.to));
  };

  if (!item.hasChildren) {
    return (
      <Link
        href={item.to}
        className={`px-4 py-2 rounded-md transition-all duration-200 ${
          isActiveLink(item.to)
            ? "text-[rgb(1,82,168)] bg-[rgb(1,82,168)]/5 font-medium"
            : "text-gray-700 hover:text-[rgb(1,82,168)] hover:bg-[rgb(1,82,168)]/5"
        }`}
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div className="relative inline-block text-left group">
      <button
        className={`px-4 py-2 rounded-md transition-all duration-200 inline-flex items-center relative ${
          isActiveParent(item)
            ? "text-[rgb(1,82,168)] font-medium after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[rgb(1,82,168)]"
            : "text-gray-700 hover:text-[rgb(1,82,168)] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[rgb(1,82,168)] after:transition-all after:duration-300 group-hover:after:w-full"
        }`}
      >
        <span>{item.label}</span>
        <svg
          className="w-4 h-4 ml-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
        {item.children?.map((child: any) => (
          <Link
            key={child.label}
            href={child.to}
            className={`block px-4 py-2 text-sm transition-all duration-200 ${
              isActiveLink(child.to)
                ? "bg-[rgb(1,82,168)]/10 text-[rgb(1,82,168)] font-medium"
                : "text-gray-700 hover:bg-[rgb(1,82,168)]/5 hover:text-[rgb(1,82,168)]"
            }`}
          >
            {child.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
