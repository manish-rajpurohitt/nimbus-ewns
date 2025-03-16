"use client";

interface CartBadgeProps {
  count: number;
}

export function CartBadge({ count }: CartBadgeProps) {
  if (count === 0) return null;

  return (
    <span className="cart-badge" aria-label={`${count} items in cart`}>
      {count > 99 ? "99+" : count}
    </span>
  );
}
