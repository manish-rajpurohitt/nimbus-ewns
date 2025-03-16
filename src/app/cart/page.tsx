import { getCart } from "@/actions/cart.actions";
import CartDisplay from "@/components/Cart/CartDisplay";
import { validateAuth } from "@/utils/auth.utils";
import { headers } from "next/headers";

export default async function CartPage() {
  try {
    // Get all async data in parallel
    const [cart, user, headersList] = await Promise.all([
      getCart(),
      validateAuth(),
      headers()
    ]);

    const pathname = headersList.get("x-invoke-path") || "/cart";

    return (
      <div className="container mx-auto px-4 py-8">
        <CartDisplay cart={cart} user={user} pathname={pathname} />
      </div>
    );
  } catch (error) {
    console.error("Cart page error:", error);
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-500">Failed to load cart. Please try again.</p>
        </div>
      </div>
    );
  }
}
