export interface Address {
  _id: string;
  name: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  landmark?: string;
  isDefault: boolean;
  email?: string;
  businessId?: string;
  consumerId?: string;
  userId?: string;
  type?: string;
}

export interface AddressResponse {
  isSuccess: boolean;
  data: Address[];
}
