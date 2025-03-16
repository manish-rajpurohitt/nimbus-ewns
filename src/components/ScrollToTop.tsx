"use client";

import { useEffect } from "react";

export default function ScrollToTop() {
  useEffect(() => {
    const scrollBtn = document.getElementById("scroll-top");
    if (!scrollBtn) return;

    const handleScroll = () => {
      requestAnimationFrame(() => {
        const shouldShow = window.pageYOffset > 300;
        scrollBtn.style.opacity = shouldShow ? "1" : "0";
        scrollBtn.style.pointerEvents = shouldShow ? "auto" : "none";
      });
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial state

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <button
      id="scroll-top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-8 right-8 bg-[rgb(1,82,168)] text-white p-3 rounded-full shadow-lg transition-all duration-300 opacity-0"
      aria-label="Scroll to top"
    >
      <svg
        className="w-6 h-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 10l7-7m0 0l7 7m-7-7v18"
        />
      </svg>
    </button>
  );
}
