// src/components/Header.tsx
import React from "react";
import Link from "next/link";
import type { Business, StaticData } from "@/types/business.types";

interface HeaderProps {
  businessData: Business;
  staticData: StaticData;
}

export default function Header({ businessData, staticData }: HeaderProps) {
  const headerData = staticData?.navbar?.heading || "";
  const businessPhone = businessData?.countryCode
    ? `${businessData?.countryCode}-${businessData?.phone}`
    : staticData?.phone?.[0] || "";
  const businessEmail = businessData?.email || staticData?.email?.[0] || "";

  return (
    <header className="bg-[var(--primary-color)] text-[var(--text-white-color)] py-3 px-4 md:px-6 lg:px-8">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
        <div className="text-[var(--font-size-medium)] md:text-[var(--font-size-navbar)] font-medium tracking-wide">
          {headerData}
        </div>

        <div className="flex items-center space-x-4 text-[var(--font-size-small)] md:text-[var(--font-size-medium)]">
          {businessPhone && (
            <Link
              href={`tel:${businessPhone}`}
              className="hover:text-[var(--tertiary-color)] transition-all duration-300 flex items-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <span>{businessPhone}</span>
            </Link>
          )}

          {businessPhone && businessEmail && (
            <span className="hidden sm:inline text-[var(--text-white-color)]">
              |
            </span>
          )}

          {businessEmail && (
            <Link
              href={`mailto:${businessEmail}`}
              className="hover:text-[var(--tertiary-color)] transition-all duration-300 flex items-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span>{businessEmail}</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
