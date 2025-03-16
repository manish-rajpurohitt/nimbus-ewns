import { getCart } from "@/actions/cart.actions";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { CartBadge } from "./Cart/CartBadge";

export default async function NavbarCartBadge() {
  const cart : any = await getCart();
  const itemCount = cart?.items?.length || 0;

  return (
    <Link href="/cart" className="relative">
      <ShoppingCart className="w-6 h-6" />
      <CartBadge count={itemCount} />
    </Link>
  );
}
