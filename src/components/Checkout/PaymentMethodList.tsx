"use client";

import { CreditCard, Wallet, Banknote } from "lucide-react";

interface PaymentMethodListProps {
  methods: string[];
  selectedMethod: string;
  onSelect: (method: string) => void;
}

export default function PaymentMethodList({
  methods,
  selectedMethod,
  onSelect
}: PaymentMethodListProps) {
  // Ensure methods array exists and has items
  const availableMethods =
    Array.isArray(methods) && methods.length > 0 ? methods : ["COD"];

  console.log("Available payment methods:", availableMethods);

  // Match reference error handling
  if (!methods || methods.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        Payment methods not available
      </div>
    );
  }

  // Normalize payment method names
  const normalizeMethod = (method: string) => {
    const normalized = method.toLowerCase().trim();
    if (normalized.includes("cod") || normalized.includes("cash")) return "COD";
    if (normalized.includes("razor")) return "Razor Pay";
    return method;
  };

  const getMethodDisplay = (method: string) => {
    switch (method.toLowerCase()) {
      case "cod":
        return "Cash on Delivery";
      case "razor pay":
      case "razorpay":
        return "Pay Online";
      default:
        return method;
    }
  };

  const getIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case "cod":
      case "cash on delivery":
        return <Banknote className="w-5 h-5" />;
      case "razorpay":
      case "razor pay":
        return <CreditCard className="w-5 h-5" />;
      case "cashfree":
      default:
        return <Wallet className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-3">
      {methods.map((method) => {
        const normalizedMethod = normalizeMethod(method);
        return (
          <div
            key={method}
            onClick={() => onSelect(method)}
            className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-all ${
              selectedMethod === method
                ? "border-[rgb(1,82,168)] bg-[rgb(1,82,168)]/5"
                : "border-gray-200 hover:border-[rgb(1,82,168)]"
            }`}
          >
            <div className="text-gray-600">{getIcon(method)}</div>
            <span className="flex-1">{getMethodDisplay(method)}</span>
            <div
              className={`w-4 h-4 rounded-full border-2 ${
                selectedMethod === method
                  ? "border-[rgb(1,82,168)] bg-[rgb(1,82,168)]"
                  : "border-gray-300"
              }`}
            />
          </div>
        );
      })}
    </div>
  );
}
