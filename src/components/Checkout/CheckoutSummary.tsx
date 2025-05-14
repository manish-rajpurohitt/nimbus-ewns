"use client";

import { Loader2 } from "lucide-react";

interface CheckoutSummaryProps {
  cart: any;
  deliveryCharges: number;
  onPlaceOrder: () => void;
  isProcessing: boolean;
  isValid: boolean;
}

export default function CheckoutSummary({
  cart,
  deliveryCharges,
  onPlaceOrder,
  isProcessing,
  isValid
}: CheckoutSummaryProps) {
  const summary = cart?.summary || {};

  // Match reference implementation calculations
  const itemsTotal = Number(summary.itemsTotal || 0);
  const tax = Number(summary.totalTax || 0);
  const basePrice = itemsTotal - tax;
  const discount = Number(summary.totalDiscount || 0);
  const delivery = Number(deliveryCharges || 0);

  // Final total calculation matching reference
  const totalAmount = (basePrice + tax - discount + delivery).toFixed(2);

  // console.log("Price details:", {
  //   basePrice,
  //   tax,
  //   discount,
  //   delivery,
  //   total: totalAmount
  // });

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg h-fit sticky top-24">
      <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

      <div className="space-y-4">
        {/* Price details */}
        <div className="flex justify-between">
          <span>Subtotal ({cart.items?.length || 0} items)</span>
          <span>₹{basePrice.toFixed(2)}</span>
        </div>

        {/* Discount */}
        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span>-₹{discount.toFixed(2)}</span>
          </div>
        )}

        {/* Delivery */}
        <div className="flex justify-between">
          <span>Delivery Charges</span>
          <span>{delivery > 0 ? `₹${delivery.toFixed(2)}` : "Free"}</span>
        </div>

        {/* Taxes */}
        <div className="flex justify-between">
          <span>GST & Taxes</span>
          <span>₹{tax.toFixed(2)}</span>
        </div>

        {/* Total */}
        <div className="pt-4 border-t">
          <div className="flex justify-between font-semibold text-lg">
            <span>Total Amount</span>
            <span>₹{totalAmount}</span>
          </div>

          {discount > 0 && (
            <p className="text-green-600 text-sm mt-1">
              You save ₹{discount.toFixed(2)}
            </p>
          )}
        </div>

        <button
          onClick={onPlaceOrder}
          disabled={!isValid || isProcessing}
          className="w-full mt-6 bg-[rgb(1,82,168)] text-white py-3 px-4 rounded-md hover:bg-[rgb(3,48,97)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing...
            </>
          ) : (
            "Place Order"
          )}
        </button>

        <p className="text-sm text-gray-500 text-center mt-4">
          By placing this order, you agree to our Terms and Conditions
        </p>
      </div>
    </div>
  );
}
