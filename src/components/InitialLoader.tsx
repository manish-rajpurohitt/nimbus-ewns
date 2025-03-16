"use client";

import { useEffect } from "react";

export default function InitialLoader() {
  useEffect(() => {
    const key = "initial-load-shown";
    if (!sessionStorage.getItem(key)) {
      sessionStorage.setItem(key, "true");
      const loaderDiv = document.createElement("div");
      loaderDiv.className = "initial-loader";
      loaderDiv.innerHTML = '<div class="loader-spinner"></div>';
      document.body.appendChild(loaderDiv);

      setTimeout(() => {
        loaderDiv.classList.add("hide");
        setTimeout(() => loaderDiv.remove(), 300);
      }, 800);
    }
  }, []);

  return null;
}
