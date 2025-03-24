import Image from "next/image";
import { Trash2 } from "lucide-react";
import { removeFromCart } from "@/actions/cart.actions";
import CartQuantityForm from "./CartQuantityForm";
import CartSummary from "./CartSummary";
import RemoveCartButton from "./RemoveCartButton";

interface CartDisplayProps {
  cart: any;
  user: any;
  pathname: string;
}

export default function CartDisplay({
  cart,
  user,
  pathname
}: CartDisplayProps) {
  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold mb-4">Your Cart is Empty</h2>
        <p className="text-gray-600">
          Add items to your cart to start shopping
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-4">
        <h1 className="text-2xl font-bold mb-6">
          Shopping Cart ({cart.items.length} items)
        </h1>

        {cart.items.map((item: any) => (
          <div
            key={item.productId}
            className="flex gap-4 p-4 bg-white rounded-lg shadow"
          >
            <div className="relative w-24 h-24">
              <Image
                src={item.logo || "/default-product.jpg"}
                key={item.logo || "/default-product.jpg"}
                alt={item.name}
                fill
                className="object-cover rounded-md"
                sizes="96px"
              />
            </div>

            <div className="flex-1">
              <h3 className="font-medium">{item.name}</h3>
              <p className="text-sm text-gray-600">{item.categoryName}</p>

              <div className="flex gap-2 items-baseline mt-2">
                <span className="text-lg font-semibold">
                  ₹{parseFloat(item.sellingPrice).toFixed(2)}
                </span>
                {item.mrp > item.sellingPrice && (
                  <>
                    <span className="text-sm text-gray-500 line-through">
                      ₹{item.mrp.toFixed(2)}
                    </span>
                    <span className="text-sm text-green-600">
                      -{item.discount}%
                    </span>
                  </>
                )}
              </div>

              <div className="flex items-center gap-4 mt-4">
                <CartQuantityForm item={item} />
                <RemoveCartButton
                  productId={item.productId}
                  quantity={item.quantity}
                  itemName={item.name}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <CartSummary cart={cart} user={user} pathname={pathname} />
    </div>
  );
}
