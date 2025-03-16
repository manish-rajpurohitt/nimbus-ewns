export interface CartItem {
  productId: string;
  name: string;
  logo?: string;
  quantity: number;
  sellingPrice: number;
  mrp: number;
  categoryName?: string;
  isGstInclusive?: boolean;
  tax?: number;
  discount?: number;
}

export interface CartSummary {
  itemsTotal: number;
  totalDiscount: number;
  totalTax?: number;
}

export interface Cart {
  items: CartItem[];
  summary: CartSummary;
}

export interface AddToCartAction {
  productId: string;
  quantity: number;
}

export interface CartResponse {
  success: boolean;
  error?: string;
}
