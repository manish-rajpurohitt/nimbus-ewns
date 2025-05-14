"use client";

import { useEffect } from "react";

export default function ErrorBoundary({
  error,
  reset
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    // console.error("Error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h2 className="text-lg font-semibold text-red-600">
        Something went wrong!
      </h2>
      <button
        onClick={reset}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Try again
      </button>
    </div>
  );
}
