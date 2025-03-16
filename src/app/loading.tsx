import { fetchBusinessData } from "@/utils/api.utils";
import Image from "next/image";

export default async function Loading() {
  const businessRes = await fetchBusinessData();
  const businessName =
    businessRes?.data?.business?.businessName || "Loading...";
  const logoUrl = businessRes?.data?.business?.logoURl;

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-white to-gray-50 backdrop-blur-sm z-[9999] flex items-center justify-center">
      <div className="w-full max-w-md p-8">
        <div className="text-center space-y-6">
          {logoUrl && (
            <div className="w-48 h-24 mx-auto relative animate-pulse">
              <Image
                src={logoUrl}
                alt="Business Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          )}

          <div className="space-y-3">
            <h2 className="text-2xl font-semibold text-[rgb(1,82,168)] animate-fadeIn">
              {businessName}
            </h2>
            <div className="flex justify-center space-x-2">
              <div className="w-2 h-2 bg-[rgb(1,82,168)] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-2 h-2 bg-[rgb(1,82,168)] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 bg-[rgb(1,82,168)] rounded-full animate-bounce"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
