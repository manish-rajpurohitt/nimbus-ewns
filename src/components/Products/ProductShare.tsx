"use client";

import { Share2 } from "lucide-react";
import { toast } from "sonner";

export default function ProductShare() {
  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("URL copied to clipboard!");

      if (navigator.share) {
        await navigator.share({
          title: document.title,
          url: window.location.href
        });
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  return (
    <button onClick={handleShare} className="share-btn">
      <Share2 size={20} />
      Share
    </button>
  );
}
