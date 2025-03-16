import Link from "next/link";
import Image from "next/image";
import type { Order } from "@/types/order.types";

interface OrderItemsProps {
  order: Order;
}

export default function OrderItems({ order }: OrderItemsProps) {
  return (
    <div className="space-y-6">
      {/* Order Items */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {order.orderItems.map((item) => (
          <Link
            key={item.productId}
            href={`/product/${item.productId}`}
            className="block p-6 hover:bg-gray-50 border-b last:border-0"
          >
            <div className="flex gap-4">
              <div className="relative w-24 h-24 flex-shrink-0">
                <Image
                  src={item.logo}
                  alt={item.name}
                  fill
                  className="object-cover rounded-md"
                  sizes="96px"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{item.name}</h3>
                <div className="mt-2 space-y-1 text-sm text-gray-600">
                  <p>Quantity: {item.quantity}</p>
                  <p>Price: ₹{item.price.toLocaleString()}</p>
                  <p className="font-medium text-gray-900">
                    Total: ₹{item.total.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Order Summary */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="font-semibold mb-4">Order Summary</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{order.totalPrice.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Payment Method</span>
            <span>{order.paymentMethod}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Payment Status</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs ${
                order.paymentStatus.toLowerCase() === "completed"
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {order.paymentStatus}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
