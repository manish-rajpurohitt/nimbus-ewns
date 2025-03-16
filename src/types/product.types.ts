export interface ProductFile {
  type: string;
  url: string;
}

export interface Product {
  _id: string;
  name: string;
  files: ProductFile[];
  price: {
    sellingPrice: number;
    mrp: number;
  };
  gst: {
    gstRate: number;
    gstInclusive: boolean;
  };
  discount: {
    type: string;
    percentage?: number;
  };
  stock: number;
  averageRating: number;
  reviews: any[];
  description: string;
  features: string[];
  sku: string;
}

export interface Category {
  _id: string;
  name: string;
  imageUrl: string;
}

export interface ProductsResponse {
  isSuccess: boolean;
  data: {
    products: Product[];
    totalProducts: number;
  };
}

export interface CategoriesResponse {
  isSuccess: boolean;
  data: {
    categories: Category[];
  };
}
