import Link from "next/link";

interface CartSummaryProps {
  cart: any;
  user: any;
  pathname: string;
}

export default function CartSummary({
  cart,
  user,
  pathname
}: CartSummaryProps) {
  const summary = cart?.summary || {};

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg h-fit">
      <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

      <div className="space-y-4">
        <div className="flex justify-between">
          <span>Price ({cart.items.length} items)</span>
          <span>₹{summary.itemsTotal?.toFixed(2) || "0.00"}</span>
        </div>

        <div className="flex justify-between text-green-600">
          <span>Discount</span>
          <span>-₹{summary.totalDiscount?.toFixed(2) || "0.00"}</span>
        </div>

        <div className="flex justify-between">
          <span>Delivery</span>
          <span>Free</span>
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between font-semibold text-lg">
            <span>Total Amount</span>
            <span>
              ₹{(summary.itemsTotal - (summary.totalDiscount || 0)).toFixed(2)}
            </span>
          </div>

          <div className="text-green-600 text-sm mt-2">
            You save ₹{summary.totalDiscount?.toFixed(2) || "0.00"} (
            {summary.percentage?.toFixed(1) || "0"}%)
          </div>
        </div>

        <Link
          href={user ? "/checkout" : `/login?redirect=${pathname}`}
          className="block w-full text-center bg-[rgb(1,82,168)] text-white py-3 rounded-md hover:bg-[rgb(3,48,97)]"
        >
          {user ? "Proceed to Checkout" : "Login to Continue"}
        </Link>
      </div>
    </div>
  );
}
