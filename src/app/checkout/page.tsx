import { Suspense } from "react";
import { validateAuth } from "@/utils/auth.utils";
import { getCart } from "@/actions/cart.actions";
import { getAddresses } from "@/actions/address.actions";
import {
  getPaymentMethods,
  getDeliveryCharges
} from "@/actions/checkout.actions";
import { redirect } from "next/navigation";
import CheckoutContent from "@/components/Checkout/CheckoutContent";
import LoadingSpinner from "@/app/loading";

export default async function CheckoutPage() {
  const user = await validateAuth();

  if (!user) {
    redirect("/login?redirect=/checkout");
  }

  const [cart, addresses, paymentMethods] :any = await Promise.all([
    getCart(),
    getAddresses(),
    getPaymentMethods()
  ]);

  if (!cart?.items?.length) {
    redirect("/cart");
  }

  // Get delivery charges for default address if exists
  const defaultAddress = addresses?.find((addr) => addr.isDefault);
  const deliveryCharges = defaultAddress
    ? await getDeliveryCharges(defaultAddress._id)
    : null;

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <CheckoutContent
        cart={cart}
        addresses={addresses}
        paymentMethods={paymentMethods}
        initialDeliveryCharges={deliveryCharges}
        defaultAddressId={defaultAddress?._id}
      />
    </Suspense>
  );
}
