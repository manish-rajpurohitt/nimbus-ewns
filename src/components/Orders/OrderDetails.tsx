"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cancelOrder } from "@/actions/order.actions";
import { Check, Package, Truck, Clock } from "lucide-react";
import { formatDate } from "@/utils/date.utils";
import { toast } from "sonner";
import type { Order } from "@/types/order.types";
import OrderTracking from "./OrderTracking";
import OrderItems from "./OrderItems";

interface OrderDetailsProps {
  order: Order;
}

export default function OrderDetails({ order }: OrderDetailsProps) {
  const [activeTab, setActiveTab] = useState<"tracking" | "items">("tracking");
  const router = useRouter();
  const [isCancelling, setIsCancelling] = useState(false);

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel this order?")) return;

    setIsCancelling(true);
    try {
      const result = await cancelOrder(order._id);
      if (result.success) {
        toast.success("Order cancelled successfully");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to cancel order");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Tab Navigation */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab("tracking")}
          className={`px-4 py-2 rounded-md ${
            activeTab === "tracking"
              ? "bg-[rgb(1,82,168)] text-white"
              : "bg-gray-100"
          }`}
        >
          Order Tracking
        </button>
        <button
          onClick={() => setActiveTab("items")}
          className={`px-4 py-2 rounded-md ${
            activeTab === "items"
              ? "bg-[rgb(1,82,168)] text-white"
              : "bg-gray-100"
          }`}
        >
          Order Items
        </button>
      </div>

      {/* Content */}
      {activeTab === "tracking" ? (
        <OrderTracking
          order={order}
          onCancel={handleCancel}
          isCancelling={isCancelling}
        />
      ) : (
        <OrderItems order={order} />
      )}
    </div>
  );
}

// ... rest of the components (OrderTracking, OrderItems) implementation
