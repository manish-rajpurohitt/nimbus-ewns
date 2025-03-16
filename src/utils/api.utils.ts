import { get, post } from "@/lib/api";
import { cookies } from "next/headers";

export interface BusinessResponse {
  isSuccess: boolean;
  data: {
    business: any;
    staticData: any;
    navbar?: any;
  };
}

export interface AddressResponse {
  isSuccess: boolean;
  data: {
    address: any;
  };
}

export async function fetchBusinessData(hostname: any) {
  try {
    // console.log("Fetching business data...");
    const response: any = await get<BusinessResponse>(
      "/website/getBusinessDetails?getJson=true"
    );

    // console.log("Raw Business Response:", response);

    // Transform and validate data
    const transformedResponse = {
      isSuccess: Boolean(response?.isSuccess),
      data: {
        business: response?.data?.business || response?.data || null,
        staticData: response?.data?.staticData || response?.data?.navbar || null
      }
    };

    // console.log("Transformed Business Data:", transformedResponse);
    return transformedResponse;
  } catch (error) {
    console.error("Business Data Error:", error);
    return { isSuccess: false, data: { business: null, staticData: null } };
  }
}

export async function fetchBusinessAddress() {
  try {
    // console.log("Fetching business address...");
    const response = await get<AddressResponse>("/website/getBusinessAddress");
    // console.log("Business Address Response:", {
    //   isSuccess: response?.isSuccess,
    //   address: response?.data?.address
    // });
    return response;
  } catch (error) {
    console.error("Error fetching business address:", error);
    return { isSuccess: false, data: null };
  }
}

export async function validateAuth() {
  try {
    const token = (await cookies()).get("_et");
    if (!token) return null;

    const response = await get<{ isSuccess: boolean; data: any }>(
      "/website/user/validate"
    );
    if (!response.isSuccess) {
      (await cookies()).delete("_et");
      return null;
    }

    return response.data;
  } catch (error) {
    console.error("Auth validation error:", error);
    return null;
  }
}

// Add debug logging for product data
export async function validateProductData(product: any) {
  // Debug full product data
  // console.log("Raw Product Full Data:", {
  //   id: product._id,
  //   name: product.name,
  //   stock: product.stock,
  //   available: product.available,
  //   rawData: product
  // });

  // Ensure stock is properly parsed
  const stock = parseInt(product.stock) || parseInt(product.available) || 0;

  const validated = {
    ...product,
    stock,
    price: {
      sellingPrice: Number(product.price) || 0,
      mrp: Number(product.mrp) || Number(product.price) || 0
    },
    taxDetails: {
      isInclusive: Boolean(product.taxDetails?.isInclusive),
      rate: Number(product.taxDetails?.rate) || 0
    }
  };

  // console.log("Validated Product:", {
  //   name: validated.name,
  //   stock: validated.stock,
  //   price: validated.price
  // });

  return validated;
}
