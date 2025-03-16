"use client";

import { useEffect } from "react";

export default function ClientLoader() {
  useEffect(() => {
    const loader = document.createElement("div");
    loader.className =
      "fixed inset-0 bg-white/95 backdrop-blur-sm z-[9999] flex items-center justify-center transition-opacity duration-300";
    loader.innerHTML =
      '<div class="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>';
    document.body.appendChild(loader);

    const timer = setTimeout(() => {
      loader.style.opacity = "0";
      setTimeout(() => loader.remove(), 300);
    }, 800);

    return () => {
      clearTimeout(timer);
      loader?.remove();
    };
  }, []);

  return null;
}
