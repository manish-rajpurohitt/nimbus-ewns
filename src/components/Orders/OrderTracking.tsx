import { formatDate } from "@/utils/date.utils";
import { Loader2 } from "lucide-react";
import type { Order } from "@/types/order.types";

interface OrderTrackingProps {
  order: Order;
  onCancel: () => void;
  isCancelling: boolean;
}

export default function OrderTracking({
  order,
  onCancel,
  isCancelling
}: OrderTrackingProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "#00C853";
      case "shipped":
        return "#2196F3";
      case "processing":
        return "#FFC107";
      case "cancelled":
        return "#F44336";
      default:
        return "#9E9E9E";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-8">
      {/* Order Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-semibold">Order Status</h2>
          <p className="text-gray-600 mt-1">Order ID: {order._id}</p>
          {order.shippingDetails?.eta && (
            <p className="text-gray-600">
              Expected Delivery: {formatDate(order.shippingDetails.eta)}
            </p>
          )}
        </div>
        {order.orderStatus === "Processing" && (
          <button
            onClick={onCancel}
            disabled={isCancelling}
            className="px-4 py-2 text-red-600 border border-red-600 rounded-md hover:bg-red-50 disabled:opacity-50"
          >
            {isCancelling ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Cancel Order"
            )}
          </button>
        )}
      </div>

      {/* Status Timeline */}
      <div className="space-y-4">
        {order.orderStatusHistory.map((status, index) => (
          <div key={index} className="relative pl-8">
            <div
              className="absolute left-0 w-4 h-4 rounded-full"
              style={{ backgroundColor: getStatusColor(status.status) }}
            />
            {index < order.orderStatusHistory.length - 1 && (
              <div
                className="absolute left-2 top-4 w-0.5 h-12"
                style={{
                  background: `linear-gradient(${getStatusColor(
                    status.status
                  )}, ${getStatusColor(
                    order.orderStatusHistory[index + 1].status
                  )})`
                }}
              />
            )}
            <div className="ml-4">
              <div
                className="inline-block px-2 py-1 rounded-full text-sm"
                style={{
                  backgroundColor: `${getStatusColor(status.status)}22`,
                  color: getStatusColor(status.status)
                }}
              >
                {status.status}
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {formatDate(status.timestamp)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Delivery Information */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="font-semibold mb-4">Delivery Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Recipient</p>
            <p className="font-medium">{order.shippingDetails.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Contact</p>
            <p className="font-medium">{order.shippingDetails.phone}</p>
          </div>
          <div className="col-span-2">
            <p className="text-sm text-gray-600">Email</p>
            <p className="font-medium">{order.shippingDetails.email}</p>
          </div>
          {order.shippingDetails.information && (
            <div className="col-span-2">
              <p className="text-sm text-gray-600">Additional Information</p>
              <p className="font-medium">{order.shippingDetails.information}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
