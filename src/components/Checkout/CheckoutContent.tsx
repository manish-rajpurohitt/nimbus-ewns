"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { placeOrder } from "@/actions/checkout.actions";
import { toast } from "sonner";
import CheckoutSummary from "./CheckoutSummary";
import AddressList from "./AddressList";
import PaymentMethodList from "./PaymentMethodList";

interface CheckoutContentProps {
  cart: any;
  addresses: any[];
  paymentMethods: any[];
  initialDeliveryCharges: any;
  defaultAddressId?: string;
}

export default function CheckoutContent({
  cart,
  addresses,
  paymentMethods,
  initialDeliveryCharges,
  defaultAddressId
}: CheckoutContentProps) {
  console.log("Available payment methods:", paymentMethods);

  const router = useRouter();
  const [selectedAddress, setSelectedAddress] = useState(defaultAddressId);
  const [selectedPayment, setSelectedPayment] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error("Please select a delivery address");
      return;
    }
    if (!selectedPayment) {
      toast.error("Please select a payment method");
      return;
    }

    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append("addressId", selectedAddress);
      formData.append("paymentMethod", selectedPayment);

      console.log("Placing order with:", {
        addressId: selectedAddress,
        paymentMethod: selectedPayment,
        address: addresses.find((a) => a._id === selectedAddress)
      });

      const result = await placeOrder(formData);

      if (result.success) {
        toast.success("Order placed successfully!");
        router.push("/orders");
      } else {
        toast.error(result.error || "Failed to place order");

        // Refresh if address is invalid
        if (result.error === "Address not found") {
          router.refresh();
        }
      }
    } catch (error) {
      console.error("Order placement error:", error);
      toast.error("Something went wrong");
    } finally {
      setIsProcessing(false);
    }
  };

  const availableMethods = Array.isArray(paymentMethods)
    ? paymentMethods
    : ["COD"];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Address Selection */}
          <section className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Delivery Address</h2>
            <AddressList
              addresses={addresses}
              selectedAddress={selectedAddress}
              onSelect={setSelectedAddress}
            />
          </section>

          {/* Payment Method Selection */}
          <section className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
            <PaymentMethodList
              methods={availableMethods}
              selectedMethod={selectedPayment}
              onSelect={setSelectedPayment}
            />
          </section>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <CheckoutSummary
            cart={cart}
            deliveryCharges={initialDeliveryCharges}
            onPlaceOrder={handlePlaceOrder}
            isProcessing={isProcessing}
            isValid={Boolean(selectedAddress && selectedPayment)}
          />
        </div>
      </div>
    </div>
  );
}
