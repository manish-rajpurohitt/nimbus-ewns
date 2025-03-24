import Link from "next/link";
import type { Order } from "@/types/order.types";
import { formatDate } from "@/utils/date.utils";
import Image from "next/image";

interface OrderListProps {
  orders: Order[];
}

export default function OrderList({ orders }: OrderListProps) {
  if (!orders.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">No orders found</p>
        <Link
          href="/products"
          className="text-[rgb(1,82,168)] hover:text-[rgb(3,48,97)]"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <Link
          key={order._id}
          href={`/order/${order._id}`}
          className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="p-6">
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
                className={`px-3 py-1 rounded-full text-sm ${getStatusStyle(
                  order.orderStatus
                )}`}
              >
                {order.orderStatus}
              </div>
            </div>

            <div className="space-y-4">
              {order.orderItems.map((item) => (
                <div key={item.productId} className="flex gap-4">
                  <div className="relative w-20 h-20">
                    <Image 
                      src={item.logo}
                      key={item.logo}
                      alt={item.name}
                      width="100"
                      height="100"
                      className="object-cover rounded-md"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-600">
                      Qty: {item.quantity}
                    </p>
                    <p className="text-sm font-medium">
                      ₹{item.total.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center mt-6 pt-4 border-t">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">
                  Total: ₹{order.totalPrice.toLocaleString()}
                </span>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${getPaymentStatusStyle(
                    order.paymentStatus
                  )}`}
                >
                  {order.paymentMethod} - {order.paymentStatus}
                </span>
              </div>
              <span className="text-[rgb(1,82,168)]">View Details →</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

function getStatusStyle(status: string) {
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

function getPaymentStatusStyle(status: string) {
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
