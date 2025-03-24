"use client";

import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/utils/date.utils";
import type { Order } from "@/types/order.types";

interface RecentOrdersProps {
  orders: Order[];
}

export default function RecentOrders({ orders }: RecentOrdersProps) {
  if (!orders.length) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-6">Recent Orders</h2>
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">No orders found</p>
          <Link
            href="/products"
            className="text-[rgb(1,82,168)] hover:text-[rgb(3,48,97)]"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Recent Orders</h2>
        <Link
          href="/orders"
          className="text-[rgb(1,82,168)] hover:text-[rgb(3,48,97)]"
        >
          View All
        </Link>
      </div>

      <div className="space-y-6">
        {orders.map((order) => (
          <Link
            key={order._id}
            href={`/order/${order._id}`}
            className="block border rounded-lg p-4 hover:border-[rgb(1,82,168)] transition-colors"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-gray-600">
                  Ordered on {formatDate(order.createdAt)}
                </p>
                <p className="text-sm font-medium mt-1">
                  Order ID: {order._id}
                </p>
              </div>
              <div
                className={`px-2 py-1 rounded-full text-sm ${getStatusBadgeStyle(
                  order.orderStatus
                )}`}
              >
                {order.orderStatus}
              </div>
            </div>

            {/* Order Items Preview */}
            <div className="flex gap-4 overflow-x-auto pb-2">
              {order.orderItems.map((item) => (
                <div
                  key={item.productId}
                  className="flex-shrink-0 w-16 h-16 relative"
                >
                  <Image
                    src={item.logo}
                    key={item.logo}
                    alt={item.name}
                    fill
                    className="object-cover rounded"
                    sizes="64px"
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center mt-4 pt-4 border-t">
              <div className="text-sm font-medium">
                ₹{order.totalPrice.toLocaleString()}
              </div>
              <div
                className={`text-xs px-2 py-1 rounded-full ${getPaymentBadgeStyle(
                  order.paymentStatus
                )}`}
              >
                {order.paymentMethod} - {order.paymentStatus}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function getStatusBadgeStyle(status: string) {
  switch (status.toLowerCase()) {
    case "delivered":
      return "bg-green-100 text-green-800";
    case "shipped":
      return "bg-blue-100 text-blue-800";
    case "processing":
      return "bg-yellow-100 text-yellow-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

function getPaymentBadgeStyle(status: string) {
  switch (status.toLowerCase()) {
    case "completed":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "failed":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}
