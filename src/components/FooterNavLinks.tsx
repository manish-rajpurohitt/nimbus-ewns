"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isActivePath } from "@/utils/path.util";

interface NavLinkProps {
  title: string;
  path: string;
}

export default function FooterNavLinks({ links }: { links: NavLinkProps[] }) {
  const pathname = usePathname();

  const isActiveLink = (path: string) => {
    return isActivePath(pathname, path);
  };

  return (
    <ul className="space-y-3">
      {links.map((link) => (
        <li key={link.path}>
          <Link
            href={link.path}
            className={`transition-colors duration-200 ${
              isActiveLink(link.path)
                ? "text-[var(--primary-color)] font-medium border-b-2 border-[var(--primary-color)]"
                : "text-[var(--text-color)] hover:text-[var(--primary-color)]"
            }`}
          >
            {link.title}
          </Link>
        </li>
      ))}
    </ul>
  );
}
