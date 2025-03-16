"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useTransition, useEffect } from "react";
import SpringLoader from "./SpringLoader";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath?: string; // Changed prop name to match usage
}

export default function Pagination({
  currentPage,
  totalPages,
  basePath = "/services"
}: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(false);
  }, [searchParams]);

  const handlePageChange = (page: number) => {
    if (page === currentPage) return; // Prevent unnecessary navigation
    setLoading(true);
    startTransition(() => {
      router.push(`${basePath}?page=${page}`);
    });
  };

  const getVisiblePages = () => {
    const delta = 1; // Number of pages to show before and after current page
    const range : any = [];
    const rangeWithDots : any = [];
    let l;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i);
      }
    }

    for (const i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };

  return (
    <>
      {loading && isPending && <SpringLoader />}
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
          className={`pagination-button ${
            currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={currentPage === 1 || loading}
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="sr-only">Previous</span>
        </button>

        {getVisiblePages().map((page, index) =>
          typeof page === "number" ? (
            <button
              key={index}
              onClick={() => handlePageChange(page)}
              className={`pagination-number ${
                currentPage === page ? "pagination-active" : ""
              }`}
              disabled={loading}
            >
              {page}
            </button>
          ) : (
            <span key={index} className="pagination-dots">
              {page}
            </span>
          )
        )}

        <button
          onClick={() =>
            handlePageChange(Math.min(totalPages, currentPage + 1))
          }
          className={`pagination-button ${
            currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={currentPage === totalPages || loading}
        >
          <ChevronRight className="w-4 h-4" />
          <span className="sr-only">Next</span>
        </button>
      </div>
    </>
  );
}
