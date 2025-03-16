export interface OrderItem {
  productId: string;
  name: string;
  logo: string;
  quantity: number;
  price: number;
  total: number;
  isGstInclusive: boolean;
  totalTax: number;
}

export interface ShippingDetails {
  name: string;
  email: string;
  phone: string;
  information: string;
  eta: string;
  showShippingDetails: boolean;
}

export interface StatusHistory {
  status: string;
  timestamp: string;
}

export interface Order {
  _id: string;
  shippingDetails: ShippingDetails;
  orderItems: OrderItem[];
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  totalPrice: number;
  orderStatusHistory: StatusHistory[];
  createdAt: string;
  isReturnAllowed?: boolean;
}
